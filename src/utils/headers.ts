export function convertHeaders(headers: Headers): Record<string, string> {
    const convertedHeaders: Record<string, string> = {};

    headers.forEach((value, key) => {
        convertedHeaders[key] = value;
    });

    return convertedHeaders;
}