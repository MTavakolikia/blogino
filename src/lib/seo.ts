import type { Metadata } from "next";

/**
 * Blogino's automated SEO layer.
 *
 * Everything in here is deterministic and pure so it can run in server
 * components, route handlers, API routes (dashboard tooling) and the
 * sitemap/robots/feed generators alike.
 */

export const SEO = {
    /** Recommended max length for <title> in search results. */
    TITLE_MAX: 60,
    /** Recommended max length for meta descriptions. */
    DESCRIPTION_MAX: 160,
    /** Below this a description is too thin to be useful. */
    DESCRIPTION_MIN: 60,
    EXCERPT_MAX: 220,
} as const;

/** Strip an HTML string down to its text content. */
export function stripHtml(html: string): string {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

/** Convert a title into a URL-friendly slug. */
export function slugify(title: string): string {
    const slug = title
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "") // drop accents
        .replace(/[^a-z0-9\s-]/g, "") // keep letters, numbers, spaces, dashes
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    return slug || "post";
}

/** Trim text to `limit` characters on a word boundary, with an ellipsis. */
export function truncateText(text: string, limit: number): string {
    const clean = text.trim();
    if (clean.length <= limit) return clean;
    const cut = clean.slice(0, limit + 1);
    const lastSpace = cut.lastIndexOf(" ");
    const end = lastSpace > limit * 0.6 ? lastSpace : limit;
    return `${clean.slice(0, end).trimEnd()}…`;
}

/**
 * Derive a search-friendly description from a post:
 * excerpt first, otherwise the first meaningful sentence of the content.
 */
export function describePost(input: {
    title?: string | null;
    excerpt?: string | null;
    content?: string | null;
}): string {
    const excerpt = input.excerpt?.trim();
    if (excerpt) return truncateText(excerpt, SEO.DESCRIPTION_MAX);

    const text = stripHtml(input.content ?? "");
    const sentences = text.match(/[^.!?\n]+[.!?]?/g);
    const first = sentences?.[0]?.trim() ?? text;
    return truncateText(first, SEO.DESCRIPTION_MAX);
}

/** The public path for a post — slug-based when available, id-based otherwise. */
export function postPath(post: { id: string; slug?: string | null }): string {
    return post.slug ? `/post/${post.slug}` : `/post/${post.id}`;
}

/**
 * The absolute base URL of the site. Honors `NEXT_PUBLIC_SITE_URL` when set
 * (production deployments); falls back to localhost for local development.
 */
export function getSiteUrl(requestHost?: string | null): string {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envUrl) return envUrl.replace(/\/$/, "");
    if (requestHost) return `http://${requestHost}`;
    return "http://localhost:3000";
}

export interface AuditPost {
    id: string;
    title: string;
    content: string;
    slug?: string | null;
    excerpt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    images: string[];
    published: boolean;
    categoryId?: string | null;
}

export interface SeoIssue {
    id: string;
    severity: "error" | "warning" | "info";
    message: string;
    fixable: boolean;
}

export interface PostAudit {
    postId: string;
    title: string;
    published: boolean;
    score: number;
    issues: SeoIssue[];
}

const PENALTIES: Record<SeoIssue["severity"], number> = {
    error: 25,
    warning: 10,
    info: 4,
};

/**
 * Audit one post for on-page SEO problems.
 * `fixable` issues can be resolved by `optimizePostFields`.
 */
export function auditPost(post: AuditPost): PostAudit {
    const issues: SeoIssue[] = [];

    if (!post.published) {
        issues.push({
            id: "not-published",
            severity: "info",
            message: "Draft — SEO only matters once the post is published.",
            fixable: false,
        });
    }

    if (!post.slug) {
        issues.push({
            id: "missing-slug",
            severity: "error",
            message: "No readable URL slug — the post lives at a long random id URL.",
            fixable: true,
        });
    }

    if (!post.metaDescription) {
        issues.push({
            id: "missing-description",
            severity: "error",
            message: "No meta description — search engines will guess it from the content.",
            fixable: true,
        });
    } else {
        if (post.metaDescription.length > SEO.DESCRIPTION_MAX) {
            issues.push({
                id: "description-too-long",
                severity: "warning",
                message: `Meta description is ${post.metaDescription.length} chars (Google truncates ~${SEO.DESCRIPTION_MAX}).`,
                fixable: true,
            });
        } else if (post.metaDescription.length < SEO.DESCRIPTION_MIN) {
            issues.push({
                id: "description-too-short",
                severity: "warning",
                message: `Meta description is only ${post.metaDescription.length} chars — under ${SEO.DESCRIPTION_MIN} hurts click-through rate.`,
                fixable: true,
            });
        }
    }

    const effectiveTitle = post.metaTitle ?? post.title;
    if (effectiveTitle.length > SEO.TITLE_MAX) {
        issues.push({
            id: "title-too-long",
            severity: "warning",
            message: `Title is ${effectiveTitle.length} chars — keep it under ${SEO.TITLE_MAX} so it isn't cut off in results.`,
            fixable: false,
        });
    }

    if (!post.images.length) {
        issues.push({
            id: "no-image",
            severity: "warning",
            message: "No cover image — posts without one miss out on rich results and image search.",
            fixable: false,
        });
    }

    if (!post.categoryId) {
        issues.push({
            id: "no-category",
            severity: "info",
            message: "No category — harder for readers to discover the post via filters.",
            fixable: false,
        });
    }

    if (!post.excerpt) {
        issues.push({
            id: "no-excerpt",
            severity: "info",
            message: "No custom excerpt — the card preview falls back to the first line of content.",
            fixable: true,
        });
    }

    const score = Math.max(
        0,
        100 - issues.reduce((sum, issue) => sum + PENALTIES[issue.severity], 0),
    );

    return {
        postId: post.id,
        title: post.title,
        published: post.published,
        score,
        issues,
    };
}

export interface OptimizedFields {
    slug?: string;
    excerpt?: string;
    metaTitle?: string;
    metaDescription?: string;
}

/**
 * Compute the fields `optimize` should write for a post.
 * Never overwrites a field that already exists, and only fixes issues
 * that `auditPost` marks as fixable.
 */
export function optimizePostFields(
    post: AuditPost,
    takenSlugs: string[] = [],
): OptimizedFields {
    const issues = auditPost(post).issues;
    const wants = new Set(issues.filter((i) => i.fixable).map((i) => i.id));

    const out: OptimizedFields = {};

    if (wants.has("missing-slug")) {
        let candidate = slugify(post.title);
        let suffix = 2;
        while (takenSlugs.includes(candidate) || candidate === post.slug) {
            candidate = `${slugify(post.title)}-${suffix++}`;
        }
        out.slug = candidate;
    }

    if (wants.has("no-excerpt") || wants.has("missing-description")) {
        const text = stripHtml(post.content);
        out.excerpt =
            post.excerpt ??
            truncateText(text.slice(0, SEO.EXCERPT_MAX * 2), SEO.EXCERPT_MAX);
    }

    if (wants.has("missing-description") || wants.has("description-too-long")) {
        out.metaDescription = describePost({
            title: post.title,
            excerpt: out.excerpt ?? post.excerpt,
            content: post.content,
        });
    }

    // A metaTitle mirroring the blog title is always a safe default when unset.
    if (wants.has("missing-description") && !post.metaTitle) {
        out.metaTitle = truncateText(post.title, SEO.TITLE_MAX);
    }

    return out;
}

/* ---------------------------- JSON-LD builders ---------------------------- */

export interface JsonLdPost extends AuditPost {
    createdAt: Date | string;
    authorName: string;
}

export function articleJsonLd(
    post: JsonLdPost,
    baseUrl: string,
): Record<string, unknown> {
    const path = postPath(post);
    const url = `${baseUrl}${path}`;
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.metaTitle ?? post.title,
        description:
            post.metaDescription ??
            describePost({ title: post.title, excerpt: post.excerpt, content: post.content }),
        image: post.images[0] ? `${baseUrl}${post.images[0]}` : undefined,
        author: { "@type": "Person", name: post.authorName },
        publisher: {
            "@type": "Organization",
            name: "Blogino",
            logo: { "@type": "ImageObject", url: `${baseUrl}/icon.svg` },
        },
        datePublished: new Date(post.createdAt).toISOString(),
        dateModified: new Date(post.createdAt).toISOString(),
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
    };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${getSiteUrl()}${item.path}`,
        })),
    };
}

export function blogJsonLd(baseUrl: string) {
    return {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Blogino",
        url: baseUrl,
        description:
            "Modern articles on technology, programming, design, business and more.",
    };
}

/* ------------------------------- metadata --------------------------------- */

/**
 * Full metadata for a single post: title, description, Open Graph,
 * Twitter card, canonical link and JSON-LD script.
 */
export function buildPostMetadata(
    post: AuditPost & {
        authorName?: string;
        createdAt?: Date | string;
        authorUrl?: string;
    },
    baseUrl: string,
): Metadata {
    const path = postPath(post);
    const url = `${baseUrl}${path}`;
    const title = post.metaTitle ?? post.title;
    const description =
        post.metaDescription ??
        describePost({ title: post.title, excerpt: post.excerpt, content: post.content });
    const image = post.images[0] ? `${baseUrl}${post.images[0]}` : undefined;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type: "article",
            title,
            description,
            url,
            siteName: "Blogino",
            ...(image ? { images: [{ url: image, alt: title }] } : {}),
            ...(post.createdAt
                ? {
                      article: {
                          publishedTime: new Date(post.createdAt).toISOString(),
                          ...(post.authorName
                              ? {
                                      authors: [
                                          post.authorUrl
                                              ? post.authorUrl
                                              : post.authorName,
                                      ],
                                  }
                              : {}),
                      },
                  }
                : {}),
        },
        twitter: {
            card: image ? "summary_large_image" : "summary",
            title,
            description,
            ...(image ? { images: [image] } : {}),
        },
    };
}
