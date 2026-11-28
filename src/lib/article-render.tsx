import React from "react";

import {
    parseArticleHtml,
    extractHeadings,
    type HtmlNode,
    type ArticleHeading,
} from "./article-html";

export { extractHeadings, parseArticleHtml } from "./article-html";
export type { ArticleHeading, HtmlNode } from "./article-html";

/**
 * Allow-listed HTML → React renderer for article bodies.
 *
 * Pairs with the parser in article-html.ts: only known tags are rebuilt as
 * React elements, attributes pass through a per-tag allow-list (with URL
 * scheme validation), and everything else — script/iframe/style subtrees,
 * event handlers, inline styles — never reaches the DOM. Because the tree
 * is rendered as React children (not dangerouslySetInnerHTML), even
 * mis-parsed text is escaped by React.
 */

const SAFE_URL = /^(https?:\/\/|mailto:|\/)/i;

function safeUrl(value: string): string | null {
    const trimmed = value.trim();
    if (!SAFE_URL.test(trimmed)) return null;
    if (/[\u0000-\u001f]/.test(trimmed)) return null;
    return trimmed;
}

function isExternal(href: string): boolean {
    return /^https?:\/\//i.test(href);
}

/** Render an anchor with validated href and safe rel/target. */
function ArticleLink({ href, title, children }: {
    href: string;
    title?: string;
    children: React.ReactNode;
}) {
    const external = isExternal(href);
    return (
        <a
            href={href}
            title={title}
            {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
        >
            {children}
        </a>
    );
}

function ArticleImage({ src, alt, title }: {
    src: string;
    alt: string;
    title?: string;
}) {
    return (
        // Content images come from arbitrary author-supplied hosts, so they
        // intentionally use a plain <img> — next/image would reject unknown
        // hosts. lazy loading keeps long pages fast; the prose styles add
        // rounding and a hairline border.
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            title={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            decoding="async"
        />
    );
}

function textOf(node: HtmlNode): string {
    return node.kind === "text" ? node.text : node.children.map(textOf).join("");
}

/**
 * Tracks how many non-empty h2/h3 headings have been rendered so far, so the
 * Nth heading receives `headings[N]` — the same order extractHeadings used.
 */
interface HeadingCursor {
    count: number;
}

/** HTML colspan/rowspan values arrive as strings; validate into numbers. */
function toSpan(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : undefined;
}

/** Render one parser node (recursively) as React elements. */
function renderNode(
    node: HtmlNode,
    headings: ArticleHeading[],
    cursor: HeadingCursor,
    key: React.Key,
): React.ReactNode {
    if (node.kind === "text") {
        return <React.Fragment key={key}>{node.text}</React.Fragment>;
    }

    const { tag, attrs, children } = node;
    const kids = children.map((child, i) =>
        renderNode(child, headings, cursor, i),
    );

    switch (tag) {
        case "p":
            return <p key={key}>{kids}</p>;
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6": {
            const Tag = tag as "h2";
            if (tag !== "h2" && tag !== "h3") {
                return <Tag key={key}>{kids}</Tag>;
            }
            const text = children.map(textOf).join("").trim();
            let id: string | undefined;
            if (text) {
                const expected = headings[cursor.count];
                if (
                    expected &&
                    expected.text === text &&
                    expected.level === (tag === "h2" ? 2 : 3)
                ) {
                    id = expected.id;
                }
                cursor.count += 1;
            }
            return <Tag key={key} id={id}>{kids}</Tag>;
        }
        case "ul":
            return <ul key={key}>{kids}</ul>;
        case "ol":
            return <ol key={key}>{kids}</ol>;
        case "li":
            return <li key={key}>{kids}</li>;
        case "blockquote":
            return <blockquote key={key}>{kids}</blockquote>;
        case "pre":
            return <pre key={key}>{kids}</pre>;
        case "code":
            return <code key={key}>{kids}</code>;
        case "strong":
        case "b":
            return <strong key={key}>{kids}</strong>;
        case "em":
        case "i":
            return <em key={key}>{kids}</em>;
        case "u":
            return <u key={key}>{kids}</u>;
        case "s":
        case "del":
            return <s key={key}>{kids}</s>;
        case "mark":
            return <mark key={key}>{kids}</mark>;
        case "sub":
            return <sub key={key}>{kids}</sub>;
        case "sup":
            return <sup key={key}>{kids}</sup>;
        case "br":
            return <br key={key} />;
        case "hr":
            return <hr key={key} />;
        case "a": {
            const href = safeUrl(attrs.href ?? "");
            if (!href) return <React.Fragment key={key}>{kids}</React.Fragment>;
            return (
                <ArticleLink key={key} href={href} title={attrs.title}>
                    {kids}
                </ArticleLink>
            );
        }
        case "img": {
            const src = safeUrl(attrs.src ?? "");
            if (!src) return null;
            return (
                <ArticleImage
                    key={key}
                    src={src}
                    alt={attrs.alt ?? ""}
                    title={attrs.title}
                />
            );
        }
        case "figure":
            return <figure key={key}>{kids}</figure>;
        case "figcaption":
            return <figcaption key={key}>{kids}</figcaption>;
        case "table":
            return (
                <div key={key} className="overflow-x-auto">
                    <table>{kids}</table>
                </div>
            );
        case "thead":
            return <thead key={key}>{kids}</thead>;
        case "tbody":
            return <tbody key={key}>{kids}</tbody>;
        case "tr":
            return <tr key={key}>{kids}</tr>;
        case "th":
            return (
                <th
                    key={key}
                    colSpan={toSpan(attrs.colspan)}
                    rowSpan={toSpan(attrs.rowspan)}
                >
                    {kids}
                </th>
            );
        case "td":
            return (
                <td
                    key={key}
                    colSpan={toSpan(attrs.colspan)}
                    rowSpan={toSpan(attrs.rowspan)}
                >
                    {kids}
                </td>
            );
        default:
            // Transparent/unknown tags: keep the content, drop the wrapper.
            return <React.Fragment key={key}>{kids}</React.Fragment>;
    }
}

export interface RenderArticleOptions {
    /** Optional CSS class for the wrapper div (defaults to prose styling). */
    className?: string;
}

/**
 * Render stored article HTML as safe React elements.
 * Server- and client-safe (no DOMParser), so the same function powers the
 * public article page and the author workspace preview dialog.
 */
export function ArticleHtml({ html, className }: { html: string; className?: string }) {
    const nodes = React.useMemo(() => parseArticleHtml(html), [html]);
    const headings = React.useMemo(() => extractHeadings(nodes), [nodes]);
    const cursor = React.useRef<HeadingCursor>({ count: 0 });
    // Reset the cursor on every (re)render.
    cursor.current.count = 0;

    return (
        <div className={className}>
            {nodes.map((node, i) =>
                renderNode(node, headings, cursor.current, i),
            )}
        </div>
    );
}
