"use client";

import { cn } from "@/lib/utils";

interface Avatar {
    imageUrl: string;
    profileUrl?: string;
}

interface AvatarCirclesProps {
    className?: string;
    numPeople?: number;
    numPeopleHref?: string;
    avatarUrls: Avatar[];
}

function AvatarImage({
    src,
    label,
}: {
    src: string;
    label: string;
}) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
        <img
            className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
            src={src}
            width={40}
            height={40}
            alt={label}
        />
    );
}

export const AvatarCircles = ({
    numPeople,
    numPeopleHref,
    className,
    avatarUrls,
}: AvatarCirclesProps) => {
    return (
        <div
            className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}
        >
            {avatarUrls.map((url, index) => (
                <a
                    key={`${url.profileUrl ?? "avatar"}-${index}`}
                    href={url.profileUrl}
                    target={url.profileUrl ? "_blank" : undefined}
                    rel={url.profileUrl ? "noopener noreferrer" : undefined}
                >
                    <AvatarImage src={url.imageUrl} label={`Avatar ${index + 1}`} />
                </a>
            ))}
            {(numPeople ?? 0) > 0 && (
                <a
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
                    href={numPeopleHref}
                >
                    +{numPeople}
                </a>
            )}
        </div>
    );
};
