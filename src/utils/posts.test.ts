import { describe, expect, it } from "vitest";

import { normalizePage, readingTime, toPostCard, totalPages } from "./posts";

const post = {
    id: "p1",
    title: "Hello",
    content: "<p>world</p>",
    images: ["https://example.com/cover.jpg"],
    createdAt: new Date("2026-01-02T03:04:05.000Z"),
    author: { firstName: "Ada", lastName: "Lovelace" },
    category: { name: "Tech" },
    _count: { likes: 3 },
};

describe("toPostCard", () => {
    it("serializes the date and keeps the fields used by post cards", () => {
        expect(toPostCard(post)).toEqual({
            ...post,
            createdAt: "2026-01-02T03:04:05.000Z",
        });
    });
});

describe("normalizePage", () => {
    it("defaults to page 1 for invalid input", () => {
        expect(normalizePage(undefined)).toBe(1);
        expect(normalizePage("abc")).toBe(1);
        expect(normalizePage("0")).toBe(1);
        expect(normalizePage(-3)).toBe(1);
    });

    it("accepts valid page numbers", () => {
        expect(normalizePage("2")).toBe(2);
        expect(normalizePage(4.9)).toBe(4);
    });
});

describe("totalPages", () => {
    it("always returns at least one page", () => {
        expect(totalPages(0, 9)).toBe(1);
        expect(totalPages(10, 9)).toBe(2);
        expect(totalPages(18, 9)).toBe(2);
    });
});

describe("readingTime", () => {
    it("ignores HTML tags and rounds up to at least a minute", () => {
        expect(readingTime("<p>short</p>")).toBe(1);
        expect(readingTime(`<p>${"word ".repeat(400)}</p>`)).toBe(2);
    });
});
