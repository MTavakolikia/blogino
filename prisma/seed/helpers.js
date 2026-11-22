"use strict";

const crypto = require("crypto");

// Deterministic, URL-safe unique id (TEXT PK).
function uid() {
    return crypto.randomUUID();
}

// FNV-1a 32-bit hash -> unsigned int, used to seed per-item RNGs.
function hashSeed(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

// xorshift32 PRNG for reproducible, non-uniform-feeling distribution.
function rngFromSeed(seed) {
    let s = seed >>> 0 || 1;
    return function () {
        s ^= s << 13;
        s ^= s >>> 17;
        s ^= s << 5;
        s >>>= 0;
        return s / 4294967296;
    };
}

function pick(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
}

function intBetween(rng, min, max) {
    return min + Math.floor(rng() * (max - min + 1));
}

// Build StarterKit-compatible HTML (p, h2, h3, ul/ol/li, blockquote, strong, em) only.
function buildContent(p) {
    let h = `<p>${p.intro}</p>`;
    for (const s of p.sections || []) {
        h += `<h2>${s.h}</h2><p>${s.p}</p>`;
    }
    if (p.quote) {
        h += `<blockquote><p>${p.quote}</p></blockquote>`;
    }
    if (p.listTitle && p.listItems && p.listItems.length) {
        const tag = p.listType === "ol" ? "ol" : "ul";
        h += `<h2>${p.listTitle}</h2><${tag}>` + p.listItems.map((i) => `<li>${i}</li>`).join("") + `</${tag}>`;
    }
    if (p.faq && p.faq.length) {
        h += `<h2>Frequently Asked Questions</h2>`;
        for (const f of p.faq) {
            h += `<h3>${f.q}</h3><p>${f.a}</p>`;
        }
    }
    if (p.outro) {
        h += `<h2>Final Thoughts</h2><p>${p.outro}</p>`;
    }
    return h;
}

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 70);
}

module.exports = { uid, hashSeed, rngFromSeed, pick, intBetween, buildContent, slugify };
