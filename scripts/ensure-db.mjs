// Makes `npm run dev` work out of the box: if the local Postgres cluster is
// not running, start it in the background and wait until it accepts connections.
// Production deployments should set DATABASE_URL to a hosted database instead.

import net from "node:net";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(ROOT, ".env") });

const DEFAULT_PORT = 54322;
const databaseUrl = process.env.DATABASE_URL;
let target;

try {
    target = new URL(databaseUrl ?? "");
} catch {
    target = new URL(`postgresql://postgres:postgres@localhost:${DEFAULT_PORT}/postgres`);
}

const isLocalCluster =
    target.hostname === "localhost" ||
    target.hostname === "127.0.0.1" ||
    target.hostname === "::1";

if (!isLocalCluster || (target.port && Number(target.port) !== DEFAULT_PORT)) {
    console.log("Using an external database — skipping the local dev DB.");
    process.exit(0);
}

const PORT = DEFAULT_PORT;
const TIMEOUT_MS = 30_000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isPortOpen = () =>
    new Promise((resolve) => {
        const socket = net.createConnection({ host: "127.0.0.1", port: PORT });
        socket.once("connect", () => {
            socket.destroy();
            resolve(true);
        });
        socket.once("error", () => resolve(false));
    });

if (await isPortOpen()) {
    console.log(`Dev Postgres is already listening on port ${PORT}.`);
    process.exit(0);
}

const child = spawn(process.execPath, [path.join(ROOT, "scripts/dev-db.mjs")], {
    cwd: ROOT,
    detached: true,
    stdio: "ignore",
});
child.unref();

const deadline = Date.now() + TIMEOUT_MS;
while (Date.now() < deadline) {
    await delay(250);
    if (await isPortOpen()) {
        console.log(`Dev Postgres started on port ${PORT}.`);
        process.exit(0);
    }
}

console.error(
    `Timed out waiting for Postgres on port ${PORT}.\n` +
        "Check the output of `npm run db` and your DATABASE_URL, then try again.",
);
process.exit(1);
