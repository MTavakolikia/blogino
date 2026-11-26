/**
 * Plain-text excerpt for cards. Card content is decorative — rendering a full
 * rich-text editor per card is expensive and breaks multi-line clamping, so we
 * strip the HTML and let the parent handle truncation.
 */
export default function PostExcerpt({ content }: { content: string }) {
    const text = content
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#0?39;/gi, "'")
        .replace(/&#x27;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();

    return <>{text}</>;
}
