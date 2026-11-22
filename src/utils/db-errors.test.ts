import { describe, expect, it, vi } from "vitest";

import { Prisma } from "@/generated/prisma/client";
import {
    isDatabaseUnavailableError,
    withDatabaseFallback,
} from "./db-errors";

describe("isDatabaseUnavailableError", () => {
    it("recognizes Prisma connection error codes", () => {
        expect(isDatabaseUnavailableError({ code: "P1001" })).toBe(true);
        expect(isDatabaseUnavailableError({ code: "P1000" })).toBe(true);
        expect(isDatabaseUnavailableError({ code: "P1017" })).toBe(true);
    });

    it("recognizes driver connection errors", () => {
        expect(isDatabaseUnavailableError({ code: "ECONNREFUSED" })).toBe(true);
        expect(isDatabaseUnavailableError({ code: "ENOTFOUND" })).toBe(true);
    });

    it("recognizes a real Prisma error with a driver connection code", () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            "Invalid prisma.post.findMany() invocation",
            { code: "ECONNREFUSED", clientVersion: "7.10.0" },
        );
        expect(isDatabaseUnavailableError(error)).toBe(true);
    });

    it("recognizes Prisma initialization errors by name", () => {
        expect(
            isDatabaseUnavailableError({
                name: "PrismaClientInitializationError",
            }),
        ).toBe(true);
    });

    it("does not treat query bugs as database outages", () => {
        expect(isDatabaseUnavailableError({ code: "P2002" })).toBe(false);
        expect(isDatabaseUnavailableError(new Error("bad query"))).toBe(false);
        expect(isDatabaseUnavailableError(null)).toBe(false);
    });
});

describe("withDatabaseFallback", () => {
    it("returns the operation result when the database works", async () => {
        const result = await withDatabaseFallback("test", [], async () => [1, 2]);
        expect(result).toEqual([1, 2]);
    });

    it("returns the fallback when the database is unavailable and logs it", async () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        const error = Object.assign(new Error("connect ECONNREFUSED"), {
            code: "ECONNREFUSED",
        });

        const result = await withDatabaseFallback("test", null, async () => {
            throw error;
        });

        expect(result).toBeNull();
        expect(spy).toHaveBeenCalledWith(
            "[db] test: database is unavailable",
            error,
        );
        spy.mockRestore();
    });

    it("rethrows non-database errors so real bugs are not hidden", async () => {
        const error = new Error("Column does not exist");
        await expect(
            withDatabaseFallback("test", null, async () => {
                throw error;
            }),
        ).rejects.toBe(error);
    });
});
