// Local dev Postgres via embedded-postgres, matching .env:
//   DATABASE_URL = postgresql://postgres:postgres@localhost:54322/postgres
//   DIRECT_URL   = postgresql://postgres:postgres@localhost:54322/shadow
//
//   npm run db         start the cluster (no-op if the port is already taken)
//   npm run db:stop    stop the cluster
//
// Data persists in .pgdata/ — delete that folder to reset the database.
// The cluster stays up while this process runs.

import net from "node:net";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import EmbeddedPostgres from "embedded-postgres";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 54322;
const DATA_DIR = path.join(ROOT, ".pgdata");

const isPortInUse = () =>
    new Promise((resolve) => {
        const socket = net.createConnection({ host: "127.0.0.1", port: PORT });
        socket.once("connect", () => {
            socket.destroy();
            resolve(true);
        });
        socket.once("error", () => resolve(false));
    });

const options = {
    databaseDir: DATA_DIR,
    port: PORT,
    user: "postgres",
    password: "postgres",
    persistent: true,
    onLog: () => {},
    onError: (message) => console.error("[dev-db]", message),
};

if (process.argv[2] === "stop") {
    if (!(await isPortInUse())) {
        console.log(`No Postgres on port ${PORT} — nothing to stop.`);
        process.exit(0);
    }
    await new EmbeddedPostgres(options).stop();
    console.log("Dev Postgres stopped.");
    process.exit(0);
}

if (await isPortInUse()) {
    console.log(`Postgres is already listening on port ${PORT} — nothing to do.`);
    process.exit(0);
}

const pg = new EmbeddedPostgres(options);

if (!fs.existsSync(path.join(DATA_DIR, "PG_VERSION"))) {
    await pg.initialise();
}
await pg.start();

const client = pg.getPgClient("postgres");
await client.connect();
const { rows } = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = 'shadow'",
);
if (rows.length === 0) {
    await pg.createDatabase("shadow");
    console.log("Created database: shadow");
}
await client.end();

console.log(`Dev Postgres ready on port ${PORT} (data dir: .pgdata)`);
console.log("Keep this process running while the app is up. Ctrl+C stops it.");

process.on("SIGINT", async () => {
    await pg.stop();
    process.exit(0);
});
setInterval(() => {}, 1 << 30);
