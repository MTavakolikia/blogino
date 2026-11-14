import { cn } from "@/lib/utils";

interface AuthorCardProps {
    name: string;
    position?: string;
    profilePic?: string | null;
    className?: string;
}

function initials(name: string) {
    return name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function AuthorCard({
    name,
    position = "Author",
    profilePic,
    className,
}: AuthorCardProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-primary/10 text-sm font-semibold text-primary">
                {profilePic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={profilePic}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    initials(name)
                )}
            </span>
            <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
                    {name}
                </h3>
                <p className="truncate text-xs text-muted-foreground">{position}</p>
            </div>
        </div>
    );
}
