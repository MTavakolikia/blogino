import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        "DATABASE_URL is not set. Copy .env.example to .env and start the local database with `npm run db`.",
    );
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString });

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        // Query logging is useful locally but far too noisy in production.
        log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
