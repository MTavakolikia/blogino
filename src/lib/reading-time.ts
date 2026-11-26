/** Estimated reading time in minutes for an HTML/markdown-ish string. */
export function readingTime(content: string): number {
    const words = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}
