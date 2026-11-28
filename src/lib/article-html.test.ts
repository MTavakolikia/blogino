import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

import {
    parseArticleHtml,
    extractHeadings,
    nodesToText,
} from "./article-html";
import { ArticleHtml } from "./article-render";

describe("parseArticleHtml", () => {
    it("parses well-formed tiptap-style html", () => {
        const nodes = parseArticleHtml(
            "<h2>Intro</h2><p>Hello <strong>world</strong></p>",
        );
        expect(nodes).toHaveLength(2);
        expect(nodes[0]).toMatchObject({
            kind: "element",
            tag: "h2",
            children: [{ kind: "text", text: "Intro" }],
        });
        const p = nodes[1] as Extract<typeof nodes[1], { kind: "element" }>;
        expect(p.tag).toBe("p");
        expect(p.children).toHaveLength(2);
        expect(p.children[1]).toMatchObject({
            kind: "element",
            tag: "strong",
        });
    });

    it("drops script/style/iframe subtrees entirely", () => {
        const nodes = parseArticleHtml(
            '<p>before</p><script>alert("x")</script><p>after</p>',
        );
        expect(nodes).toHaveLength(2);
        expect(nodesToText(nodes)).toBe("before after");
    });

    it("drops event handlers and inline style attributes", () => {
        const nodes = parseArticleHtml(
            '<p onclick="evil()" style="color:red" data-x="1">hi</p>',
        );
        const p = nodes[0] as Extract<typeof nodes[0], { kind: "element" }>;
        expect(p.attrs).toEqual({});
    });

    it("keeps only allow-listed attributes on links and images", () => {
        const nodes = parseArticleHtml(
            '<p><a href="https://x.y" rel="nofollow" onmouseover="evil()" target="_blank">link</a></p>',
        );
        const p = nodes[0] as Extract<typeof nodes[0], { kind: "element" }>;
        const a = p.children[0] as Extract<typeof p.children[0], { kind: "element" }>;
        expect(a.attrs).toEqual({ href: "https://x.y" });
    });

    it("handles mismatched close tags without losing attributes", () => {
        const nodes = parseArticleHtml(
            '<p><strong>bold<p>nested</strong> tail</p>',
        );
        // Whatever the tree shape, text survives and no attrs are invented.
        expect(nodesToText(nodes)).toContain("bold");
        expect(nodesToText(nodes)).toContain("nested");
    });

    it("flushes unclosed elements", () => {
        const nodes = parseArticleHtml("<h2>Unclosed heading");
        expect(nodesToText(nodes)).toBe("Unclosed heading");
        const h = nodes[0] as Extract<typeof nodes[0], { kind: "element" }>;
        expect(h.tag).toBe("h2");
    });

    it("treats unknown benign tags as transparent wrappers", () => {
        const nodes = parseArticleHtml(
            "<div><span>kept</span></div>",
        );
        expect(nodesToText(nodes)).toBe("kept");
    });
});

describe("extractHeadings", () => {
    it("extracts h2/h3 in document order with stable ids", () => {
        const html =
            "<h2>First</h2><p>…</p><h3>Sub</h3><h2>Second</h2><h4>skip</h4>";
        const headings = extractHeadings(parseArticleHtml(html));
        expect(headings).toEqual([
            { id: "h-0", text: "First", level: 2 },
            { id: "h-1", text: "Sub", level: 3 },
            { id: "h-2", text: "Second", level: 2 },
        ]);
    });

    it("skips empty headings", () => {
        const headings = extractHeadings(
            parseArticleHtml("<h2></h2><h2>Real</h2>"),
        );
        expect(headings).toEqual([{ id: "h-0", text: "Real", level: 2 }]);
    });
});

describe("ArticleHtml rendering", () => {
    it("renders prose html to safe markup", () => {
        const markup = renderToStaticMarkup(
            React.createElement(ArticleHtml, {
                html: "<h2>Title</h2><p>Text with <a href='https://e.x'>link</a></p>",
                className: "prose",
            }),
        );
        expect(markup).toContain("<h2 id=\"h-0\">Title</h2>");
        expect(markup).toContain("<p>Text with <a href=\"https://e.x\"");
        expect(markup).toContain('target="_blank"');
        expect(markup).toContain('rel="noopener noreferrer"');
    });

    it("neutralizes malicious content", () => {
        const markup = renderToStaticMarkup(
            React.createElement(ArticleHtml, {
                html: '<p onclick="x()">safe</p><script>alert(1)</script><a href="javascript:alert(2)">c</a><img src="x" onerror="alert(3)">',
            }),
        );
        expect(markup).not.toContain("alert(1)");
        expect(markup).not.toContain("onclick");
        expect(markup).not.toContain("onerror");
        expect(markup).not.toContain("javascript:");
        expect(markup).toContain("safe");
        // javascript: href is stripped; the anchor keeps its text only.
        expect(markup).toContain("c");
    });

    it("renders internal links without target=_blank", () => {
        const markup = renderToStaticMarkup(
            React.createElement(ArticleHtml, {
                html: "<p><a href='/post/abc'>internal</a></p>",
            }),
        );
        expect(markup).toContain('href="/post/abc"');
        expect(markup).not.toContain("target=");
    });

    it("stamps unique ids on duplicate heading texts", () => {
        const markup = renderToStaticMarkup(
            React.createElement(ArticleHtml, {
                html: "<h2>Same</h2><p>a</p><h2>Same</h2><p>b</p>",
            }),
        );
        expect(markup).toContain('id="h-0"');
        expect(markup).toContain('id="h-1"');
    });
});
