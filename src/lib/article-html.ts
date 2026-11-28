/**
 * Allow-listed HTML → node-tree parser for Blogino article bodies.
 *
 * Article content is authored in Tiptap (StarterKit + Link) and stored as
 * HTML. This module parses that HTML into a lightweight node tree without
 * any DOM dependency, so it runs on the server. Rendering happens in
 * `article-html.tsx`, which rebuilds ONLY the allow-listed tags with
 * validated attributes — disallowed tags, attributes and URL schemes are
 * dropped rather than escaped, making stored-XSS structurally impossible.
 */

export interface HtmlElementNode {
    kind: "element";
    tag: string;
    attrs: Record<string, string>;
    children: HtmlNode[];
}

export interface HtmlTextNode {
    kind: "text";
    text: string;
}

export type HtmlNode = HtmlElementNode | HtmlTextNode;

/** Tags whose entire subtree is discarded. */
const DROP_WITH_SUBTREE = new Set([
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "button",
    "textarea",
    "select",
    "option",
    "link",
    "meta",
    "base",
    "svg",
    "math",
    "template",
    "noscript",
    "canvas",
    "applet",
    "frame",
    "frameset",
    "html",
    "head",
    "body",
    "title",
    "dialog",
    "video",
    "audio",
    "source",
    "track",
]);

/** Tags rendered transparently (children kept, wrapper dropped). */
const TRANSPARENT = new Set([
    "span",
    "div",
    "section",
    "article",
    "header",
    "footer",
    "main",
    "aside",
    "nav",
    "font",
    "col",
    "colgroup",
]);

const VOID_TAGS = new Set(["br", "hr", "img"]);

/**
 * Attributes kept per tag. Everything else is dropped, including event
 * handler attributes (on*) and inline style — there is no path for them.
 */
const ALLOWED_ATTRS: Record<string, Set<string>> = {
    a: new Set(["href", "title"]),
    img: new Set(["src", "alt", "title"]),
    th: new Set(["colspan", "rowspan"]),
    td: new Set(["colspan", "rowspan"]),
};

/** URL schemes allowed in href/src. */
const SAFE_URL = /^(https?:\/\/|mailto:|\/)/i;

const TAG_TOKEN = /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)([^>]*?)(\/?)\s*>/g;

const ATTR_TOKEN = /([a-zA-Z_:][a-zA-Z0-9_:.-]*)\s*(?:=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

export function normalizeTag(tag: string): string {
    return tag.toLowerCase();
}

function parseAttrs(tag: string, raw: string): Record<string, string> {
    const allowed = ALLOWED_ATTRS[tag];
    const attrs: Record<string, string> = {};
    if (!raw || !allowed) return attrs;
    ATTR_TOKEN.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = ATTR_TOKEN.exec(raw)) !== null) {
        const name = match[1].toLowerCase();
        if (!allowed.has(name)) continue; // hard allow-list, incl. on* handlers
        const value = match[3] ?? match[4] ?? match[5] ?? "";
        if (!attrs.hasOwnProperty(name)) attrs[name] = value;
    }
    return attrs;
}

function safeUrl(value: string): string | null {
    const trimmed = value.trim();
    // Reject anything with suspicious schemes; allow relative + http(s) + mailto.
    if (!SAFE_URL.test(trimmed)) return null;
    // Block encoded control characters and protocol-relative oddities.
    if (/[\u0000-\u001f]/.test(trimmed)) return null;
    return trimmed;
}

/**
 * Parse an HTML string into a node tree. Unknown-but-benign tags become
 * transparent wrappers; dangerous tags are removed with their subtree;
 * mismatched close tags are tolerated (Tiptap output is well-formed, but
 * pasted content may not be).
 */
export function parseArticleHtml(html: string): HtmlNode[] {
    const root: HtmlNode[] = [];
    const stack: { tag: string; attrs: Record<string, string>; children: HtmlNode[] }[] = [
        { tag: "#root", attrs: {}, children: root },
    ];

    // Depth counters per dropped tag name so nested <script><script>…</script>
    // still skips the whole region.
    const skipDepths = new Map<string, number>();

    let lastIndex = 0;
    TAG_TOKEN.lastIndex = 0;

    const pushText = (text: string) => {
        if (!text) return;
        stack[stack.length - 1].children.push({ kind: "text", text });
    };

    let match: RegExpExecArray | null;
    while ((match = TAG_TOKEN.exec(html)) !== null) {
        // Skip state as of BEFORE this tag — text captured since the previous
        // token belongs to the skipped region if one was already active.
        const wasSkipping = [...skipDepths.values()].some((d) => d > 0);

        if (match.index > lastIndex && !wasSkipping) {
            pushText(html.slice(lastIndex, match.index));
        }
        lastIndex = TAG_TOKEN.lastIndex;

        const [, closeSlash, rawTag, rawAttrs, selfSlash] = match;
        const tag = normalizeTag(rawTag);

        // While skipping a dropped subtree, only track its own close tags.
        if (wasSkipping) {
            const activeSkip = [...skipDepths.entries()].find(
                ([, depth]) => depth > 0,
            );
            const skipTag = activeSkip![0];
            if (!closeSlash && tag === skipTag) {
                skipDepths.set(skipTag, (skipDepths.get(skipTag) ?? 0) + 1);
            } else if (closeSlash && tag === skipTag) {
                skipDepths.set(skipTag, Math.max(0, (skipDepths.get(skipTag) ?? 1) - 1));
            }
            continue;
        }

        if (closeSlash) {
            // Close the nearest matching open element (if any).
            let found = -1;
            for (let i = stack.length - 1; i >= 1; i -= 1) {
                if (stack[i].tag === tag) {
                    found = i;
                    break;
                }
            }
            if (found > 0) {
                const closed = stack.splice(found);
                const parent = stack[stack.length - 1];
                for (const el of closed) {
                    parent.children.push({
                        kind: "element",
                        tag: el.tag,
                        attrs: el.attrs,
                        children: el.children,
                    });
                }
            }
            continue;
        }

        if (DROP_WITH_SUBTREE.has(tag)) {
            if (!selfSlash && !VOID_TAGS.has(tag)) {
                // <script src> has no closing tag sometimes; the depth map
                // tolerates a missing close by simply never re-opening.
                skipDepths.set(tag, 1);
            }
            continue;
        }

        const attrs = parseAttrs(tag, rawAttrs);
        const isVoid = VOID_TAGS.has(tag) || selfSlash === "/";

        if (isVoid) {
            stack[stack.length - 1].children.push({
                kind: "element",
                tag,
                attrs,
                children: [],
            });
            continue;
        }

        stack.push({ tag, attrs, children: [] });
    }

    if (lastIndex < html.length) {
        pushText(html.slice(lastIndex));
    }

    // Unclosed elements: flush them into their parent in reverse order.
    while (stack.length > 1) {
        const el = stack.pop()!;
        stack[stack.length - 1].children.push({
            kind: "element",
            tag: el.tag,
            attrs: el.attrs,
            children: el.children,
        });
    }

    return root;
}

export interface ArticleHeading {
    /** Stable anchor id: `h-<index>` in document order. */
    id: string;
    text: string;
    level: 2 | 3;
}

const BLOCK_TAGS = new Set([
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "li",
    "blockquote",
    "pre",
    "div",
    "br",
    "tr",
    "figure",
    "figcaption",
]);

function elementText(node: HtmlNode): string {
    if (node.kind === "text") return node.text;
    const inner = node.children.map(elementText).join("");
    // Block boundaries read as whitespace so flattened text keeps word gaps.
    return BLOCK_TAGS.has(node.tag) ? ` ${inner} ` : inner;
}

/**
 * Extract h2/h3 headings (in document order) for the table of contents.
 * The ids match what `renderArticleTree` stamps onto the elements.
 */
export function extractHeadings(nodes: HtmlNode[]): ArticleHeading[] {
    const headings: ArticleHeading[] = [];
    const walk = (list: HtmlNode[]) => {
        for (const node of list) {
            if (node.kind !== "element") continue;
            if (node.tag === "h2" || node.tag === "h3") {
                const text = elementText(node).trim();
                if (text) {
                    headings.push({
                        id: `h-${headings.length}`,
                        text,
                        level: node.tag === "h2" ? 2 : 3,
                    });
                }
            }
            walk(node.children);
        }
    };
    walk(nodes);
    return headings;
}

/** Flatten a node tree to plain text (used for excerpts/word counts). */
export function nodesToText(nodes: HtmlNode[]): string {
    return elementText({ kind: "element", tag: "#root", attrs: {}, children: nodes })
        .replace(/\s+/g, " ")
        .trim();
}
