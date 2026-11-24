import { Prisma } from "@/generated/prisma/client";

const CONNECTION_ERROR_CODES = new Set([
    "ECONNREFUSED",
    "ECONNRESET",
    "ENOTFOUND",
    "EHOSTUNREACH",
    "ENETUNREACH",
    "ETIMEDOUT",
]);

function isConnectionCode(code: string): boolean {
    return /^P10\d+$/.test(code) || CONNECTION_ERROR_CODES.has(code);
}

/**
 * True for errors that mean "the database is not reachable right now", as
 * opposed to a bug in a specific query (e.g. a bad field name or a missing
 * record). Prisma uses P10xx for connection/auth failures; driver adapters
 * bubble up Node's `ECONN*` codes.
 */
export function isDatabaseUnavailableError(error: unknown): boolean {
    if (error instanceof Prisma.PrismaClientInitializationError) return true;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return isConnectionCode(error.code);
    }

    if (typeof error !== "object" || error === null) return false;

    const { code, name } = error as { code?: unknown; name?: unknown };

    if (name === "PrismaClientInitializationError") return true;

    return typeof code === "string" && isConnectionCode(code);
}

/**
 * Logs the full error on the server (where it is useful) and returns a safe
 * fallback for page rendering. Non-database errors are rethrown so real bugs
 * still surface instead of being silently turned into empty pages.
 */
export async function withDatabaseFallback<T>(
    label: string,
    fallback: T,
    operation: () => Promise<T>,
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        if (isDatabaseUnavailableError(error)) {
            console.error(`[db] ${label}: database is unavailable`, error);
            return fallback;
        }
        throw error;
    }
}
