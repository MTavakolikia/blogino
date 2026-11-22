import { cn } from "@/lib/utils";

export function SectionHeading({
    eyebrow,
    title,
    description,
    className,
    align = "left",
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    className?: string;
    align?: "left" | "center";
}) {
    return (
        <div
            className={cn(
                "max-w-2xl",
                align === "center" && "mx-auto text-center",
                className,
            )}
        >
            {eyebrow && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    {eyebrow}
                </p>
            )}
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {title}
            </h2>
            {description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {description}
                </p>
            )}
        </div>
    );
}
