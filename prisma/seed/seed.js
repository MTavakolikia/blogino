"use strict";

/*
 * Seed script for Blogino.
 *
 * Populates the database with realistic, human-readable content:
 *   - users (1 admin, 5 authors, 14 readers)
 *   - categories (12)
 *   - posts (108, all published, spread across the past ~120 days)
 *   - likes, comments (with a few reply threads), and saved posts
 *
 * It is idempotent: it clears the seed-owned rows first (in FK-safe order)
 * and then re-inserts everything, so it can be re-run safely.
 *
 * Run from the project root:  node prisma/seed/seed.js
 */

require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const { uid, hashSeed, rngFromSeed, pick, intBetween, buildContent, slugify } = require("./helpers");
const { SEED_PASSWORD, USERS } = require("./users");
const { COMMENTS, REPLIES } = require("./comments");

const DATA_DIR = path.join(__dirname, "data");

// Single loremflickr keyword per category (single words resolve reliably;
// multi-word keywords 403). `?lock=N` makes the photo stable per post.
const CATEGORY_IMAGE_KEYWORD = {
    "Web Development": "web",
    Programming: "programming",
    "AI & Machine Learning": "ai",
    "Data Science": "data",
    Cybersecurity: "cybersecurity",
    "Cloud Computing": "cloud",
    Technology: "technology",
    Productivity: "office",
    Business: "business",
    Design: "design",
    Lifestyle: "life",
    Science: "science",
};

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set. Is it in your .env file?");
    process.exit(1);
}

// Serialize a JS string array into a Postgres text[] literal, safely escaped.
function pgTextArray(arr) {
    return (
        "{" +
        arr
            .map((s) => '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"')
            .join(",") +
        "}"
    );
}

function loadPosts() {
    const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".js")).sort();
    const all = [];
    for (const f of files) {
        const posts = require(path.join(DATA_DIR, f));
        for (const p of posts) all.push(p);
    }
    return all;
}

// Small batching helper: queue parameterized queries, flush them together.
class Batch {
    constructor(client) {
        this.client = client;
        this.queued = [];
    }
    add(text, values) {
        this.queued.push({ text, values: values || [] });
    }
    async flush() {
        const items = this.queued;
        this.queued = [];
        for (const q of items) {
            await this.client.query(q.text, q.values);
        }
        return items.length;
    }
}

async function main() {
    const posts = loadPosts();
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    console.log("Connected to database.");

    const batch = new Batch(client);
    const now = new Date();
    const DAY = 24 * 60 * 60 * 1000;

    await client.query("BEGIN");

    try {
        // ---- 1. Clear seed-owned data (FK-safe order) -------------------
        const seedEmails = USERS.map((u) => u.email);
        const n = seedEmails.length;
        const emailList = Array.from({ length: n }, (_, i) => `$${i + 1}`).join(",");
        const userSub = `(SELECT "id" FROM "User" WHERE "email" IN (${emailList}))`;
        const postSub = `(SELECT "id" FROM "Post" WHERE "authorId" IN ${userSub})`;

        // AuditLog rows referencing seed users (defensive; usually none).
        await client.query(`DELETE FROM "AuditLog" WHERE "userId" IN ${userSub}`, seedEmails);

        // Child rows first: any row touching a seed user or a seed-authored post.
        for (const table of ["Like", "Comment", "SavedPost"]) {
            await client.query(
                `DELETE FROM "${table}" WHERE "userId" IN ${userSub} OR "postId" IN ${postSub}`,
                seedEmails
            );
        }
        await client.query(`DELETE FROM "Post" WHERE "authorId" IN ${userSub}`, seedEmails);

        const catNames = Array.from(new Set(posts.map((p) => p.category)));
        await client.query(
            `DELETE FROM "Category" WHERE "name" IN (${Array.from({ length: catNames.length }, (_, i) => `$${i + 1}`).join(",")})`,
            catNames
        );
        await client.query(`DELETE FROM "User" WHERE "email" IN (${emailList})`, seedEmails);

        console.log("Cleared previous seed data.");

        // ---- 2. Users ----------------------------------------------------
        const passwordHash = bcrypt.hashSync(SEED_PASSWORD, 10);
        const userIdByEmail = {};
        for (const u of USERS) {
            const id = uid();
            userIdByEmail[u.email] = id;
            const createdAt = new Date(now.getTime() - intBetween(rngFromSeed(hashSeed(u.email)), 60, 200) * DAY);
            batch.add(
                `INSERT INTO "User" ("id","firstName","lastName","email","password","role","active","createdAt","updatedAt")
                 VALUES ($1,$2,$3,$4,$5,$6,TRUE,$7,$7)`,
                [id, u.firstName, u.lastName, u.email, passwordHash, u.role, createdAt]
            );
        }
        const adminEmail = USERS.find((u) => u.role === "ADMIN").email;
        const adminId = userIdByEmail[adminEmail];
        const authorEmails = USERS.filter((u) => u.role === "AUTHOR").map((u) => u.email);
        const readerEmails = USERS.filter((u) => u.role === "USER").map((u) => u.email);
        const allSeedUserIds = Object.values(userIdByEmail);
        await batch.flush();
        console.log(`Inserted ${USERS.length} users.`);

        // ---- 3. Categories ----------------------------------------------
        const catIdByName = {};
        for (const name of catNames) {
            const id = uid();
            catIdByName[name] = id;
            const createdAt = new Date(now.getTime() - intBetween(rngFromSeed(hashSeed(name)), 150, 200) * DAY);
            batch.add(`INSERT INTO "Category" ("id","name","createdAt","updatedAt") VALUES ($1,$2,$3,$3)`, [id, name, createdAt]);
        }
        await batch.flush();
        console.log(`Inserted ${catNames.length} categories.`);

        // ---- 4. Posts ----------------------------------------------------
        const insertedPosts = [];
        posts.forEach((post, i) => {
            const slug = slugify(post.title);
            const id = uid();
            const rng = rngFromSeed(hashSeed(slug));

            const daysAgo = intBetween(rng, 0, 120);
            const createdAt = new Date(now.getTime() - daysAgo * DAY - intBetween(rng, 0, 20) * 60 * 60 * 1000);
            const updatedAt = new Date(Math.min(now.getTime(), createdAt.getTime() + intBetween(rng, 3, 90) * 60 * 60 * 1000));
            const approvedAt = new Date(Math.min(now.getTime(), createdAt.getTime() + intBetween(rng, 1, 8) * 60 * 60 * 1000));

            const views = 12 + Math.floor(rng() * 5200);
            const authorEmail = authorEmails[i % authorEmails.length];
            const kw = CATEGORY_IMAGE_KEYWORD[post.category] || "technology";
            const lock = (hashSeed(slug) % 9000) + 1;
            const images = [
                `https://loremflickr.com/1200/675/${kw}?lock=${lock}`,
                `https://loremflickr.com/1200/675/${kw}?lock=${lock + 1}`,
            ];

            const content = buildContent(post);

            insertedPosts.push({ id, title: post.title, slug, category: post.category, authorEmail, createdAt, views, rng });

            batch.add(
                `INSERT INTO "Post"
                   ("id","title","content","published","images","views","authorId","categoryId","createdAt","updatedAt","approvedById","approvedAt")
                 VALUES ($1,$2,$3,TRUE,$4::text[],$5,$6,$7,$8,$9,$10,$11)`,
                [
                    id,
                    post.title,
                    content,
                    pgTextArray(images),
                    views,
                    userIdByEmail[authorEmail],
                    catIdByName[post.category],
                    createdAt,
                    updatedAt,
                    adminId,
                    approvedAt,
                ]
            );
        });
        const postCount = await batch.flush();
        console.log(`Inserted ${postCount} posts.`);

        // ---- 5. Likes ----------------------------------------------------
        const likePool = allSeedUserIds;
        for (const p of insertedPosts) {
            const rng = rngFromSeed(hashSeed(p.id + ":like"));
            const maxLikes = likePool.length;
            let k = Math.min(maxLikes - 1, Math.floor(p.views / 260) + intBetween(rng, 0, 4));
            if (rng() < 0.15) k = 0; // a few posts have no likes yet
            k = Math.max(0, Math.min(maxLikes, k));
            if (k === 0) continue;

            const shuffled = likePool.slice();
            for (let j = shuffled.length - 1; j > 0; j--) {
                const t = Math.floor(rng() * (j + 1));
                [shuffled[j], shuffled[t]] = [shuffled[t], shuffled[j]];
            }
            const likers = shuffled.slice(0, k);
            for (const userId of likers) {
                const at = new Date(Math.min(now.getTime(), p.createdAt.getTime() + intBetween(rng, 1, 96) * 60 * 60 * 1000));
                batch.add(`INSERT INTO "Like" ("id","userId","postId","createdAt") VALUES ($1,$2,$3,$4)`, [uid(), userId, p.id, at]);
            }
        }
        const likeCount = await batch.flush();
        console.log(`Inserted ${likeCount} likes.`);

        // ---- 6. Comments -------------------------------------------------
        for (const p of insertedPosts) {
            const rng = rngFromSeed(hashSeed(p.id + ":comment"));
            if (rng() < 0.4) continue; // ~60% of posts get comments
            const count = intBetween(rng, 1, 4);

            const usedIdx = new Set();
            let firstCommentId = null;
            for (let c = 0; c < count; c++) {
                let idx;
                do {
                    idx = Math.floor(rng() * COMMENTS.length);
                } while (usedIdx.has(idx) && usedIdx.size < COMMENTS.length);
                usedIdx.add(idx);

                const text = COMMENTS[idx];
                const userId = userIdByEmail[pick(rng, readerEmails)];
                const at = new Date(Math.min(now.getTime(), p.createdAt.getTime() + intBetween(rng, 1, 120) * 60 * 60 * 1000));
                const id = uid();
                if (c === 0) firstCommentId = id;
                batch.add(
                    `INSERT INTO "Comment" ("id","content","approved","userId","postId","parentId","createdAt","updatedAt")
                     VALUES ($1,$2,TRUE,$3,$4,NULL,$5,$5)`,
                    [id, text, userId, p.id, at]
                );

                // occasionally the author replies to the first comment
                if (c === 0 && rng() < 0.45) {
                    const replyText = pick(rng, REPLIES);
                    const replyAt = new Date(Math.min(now.getTime(), at.getTime() + intBetween(rng, 1, 30) * 60 * 60 * 1000));
                    batch.add(
                        `INSERT INTO "Comment" ("id","content","approved","userId","postId","parentId","createdAt","updatedAt")
                         VALUES ($1,$2,TRUE,$3,$4,$5,$6,$6)`,
                        [uid(), replyText, userIdByEmail[p.authorEmail], p.id, id, replyAt]
                    );
                }
            }
        }
        const commentCount = await batch.flush();
        console.log(`Inserted ${commentCount} comments.`);

        // ---- 7. Saved posts ---------------------------------------------
        for (const p of insertedPosts) {
            const rng = rngFromSeed(hashSeed(p.id + ":saved"));
            if (rng() < 0.7) continue; // ~30% of posts get saved
            const count = intBetween(rng, 1, 3);
            const shuffled = readerEmails.slice();
            for (let j = shuffled.length - 1; j > 0; j--) {
                const t = Math.floor(rng() * (j + 1));
                [shuffled[j], shuffled[t]] = [shuffled[t], shuffled[j]];
            }
            const savers = shuffled.slice(0, count);
            for (const email of savers) {
                const at = new Date(Math.min(now.getTime(), p.createdAt.getTime() + intBetween(rng, 1, 100) * 60 * 60 * 1000));
                batch.add(`INSERT INTO "SavedPost" ("id","userId","postId","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$4)`, [
                    uid(),
                    userIdByEmail[email],
                    p.id,
                    at,
                ]);
            }
        }
        const savedCount = await batch.flush();
        console.log(`Inserted ${savedCount} saved posts.`);

        await client.query("COMMIT");
        console.log("\nSeed complete. Summary:");
        const counts = await client.query(`
            SELECT
              (SELECT count(*) FROM "User")      AS users,
              (SELECT count(*) FROM "Category")  AS categories,
              (SELECT count(*) FROM "Post")      AS posts,
              (SELECT count(*) FROM "Post" WHERE "published"=TRUE) AS published,
              (SELECT count(*) FROM "Like")      AS likes,
              (SELECT count(*) FROM "Comment")   AS comments,
              (SELECT count(*) FROM "SavedPost") AS saved
        `);
        console.table(counts.rows[0]);
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Seed failed, rolled back:", err);
        throw err;
    } finally {
        await client.end();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
