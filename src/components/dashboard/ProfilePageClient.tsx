"use client";

import * as React from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    BarChart3,
    Camera,
    Calendar,
    Heart,
    Loader2,
    Mail,
    MessageSquare,
    PenLine,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";

interface ProfileUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profilePic?: string | null;
    joinedAt: string;
}

interface RecentPost {
    id: string;
    title: string;
    category: string | null;
    likes: number;
    comments: number;
    createdAt: string;
}

export default function ProfilePageClient({
    user: initialUser,
    stats,
    recentPosts,
    id,
}: {
    user?: ProfileUser;
    stats?: { published: number; likesReceived: number; comments: number };
    recentPosts?: RecentPost[];
    id?: string;
}) {
    const router = useRouter();
    const [user, setUser] = React.useState<ProfileUser | null>(initialUser ?? null);
    const [loading, setLoading] = React.useState(!initialUser);
    const [uploading, setUploading] = React.useState(false);
    const [recent, setRecent] = React.useState<RecentPost[]>(recentPosts ?? []);

    const isSelf = initialUser ? true : false;

    // Fetch when only an id is provided (the /profile/[id] route).
    React.useEffect(() => {
        if (initialUser || !id) return;
        (async () => {
            try {
                const res = await axios.get(`/api/users/${id}`);
                const d = res.data;
                setUser({
                    id: d.id,
                    firstName: d.firstName,
                    lastName: d.lastName,
                    email: d.email,
                    role: d.role,
                    profilePic: d.profilePic,
                    joinedAt: d.createdAt,
                });
            } catch {
                toast.error("Couldn't load this profile");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, initialUser]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        try {
            const path = `profiles/${user.id}/${Date.now()}-${file.name}`;
            const { error } = await supabase.storage.from("user-profiles").upload(path, file);
            if (error) throw error;

            const { data } = supabase.storage.from("user-profiles").getPublicUrl(path);
            if (!data?.publicUrl) throw new Error("No public URL");

            await axios.patch(`/api/users/${user.id}`, { profilePic: data.publicUrl });
            setUser({ ...user, profilePic: data.publicUrl });
            toast.success("Profile picture updated");
            router.refresh();
        } catch (err) {
            console.error("Profile image upload failed:", err);
            toast.error("Couldn't upload the image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) return null;

    const name = `${user.firstName} ${user.lastName}`;
    const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

    return (
        <div className="space-y-6">
            {/* Identity card */}
            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <BorderBeam duration={12} borderWidth={1.25} />
                <CardHeader className="p-6">
                    <div className="flex flex-wrap items-center gap-5">
                        <div className="relative">
                            <Avatar className="h-20 w-20 rounded-2xl">
                                <AvatarImage src={user.profilePic ?? undefined} alt={name} />
                                <AvatarFallback className="rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {isSelf && (
                                <label className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground">
                                    {uploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Camera className="h-4 w-4" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate text-2xl font-semibold tracking-tight">{name}</h1>
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    <ShieldCheck className="h-3 w-3" />
                                    {user.role}
                                </span>
                            </div>
                            <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5" /> {user.email}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Joined{" "}
                                    {new Date(user.joinedAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>
                </CardHeader>

                {stats && (
                    <CardContent className="grid grid-cols-3 gap-4 border-t border-border/60 p-6 pt-5">
                        <Stat label="Published" value={stats.published} icon={PenLine} />
                        <Stat label="Likes received" value={stats.likesReceived} icon={Heart} />
                        <Stat label="Comments" value={stats.comments} icon={MessageSquare} />
                    </CardContent>
                )}
            </div>

            {/* Recent posts */}
            {recentPosts && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between p-6 pb-3">
                        <div>
                            <CardTitle>Recent posts</CardTitle>
                            <CardDescription>Your latest published articles.</CardDescription>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/dashboard/posts">View all</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-2">
                        {recent.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                                Nothing published yet.
                            </p>
                        ) : (
                            <div className="space-y-1">
                                {recent.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/post/${p.id}`}
                                        className="group flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate font-medium group-hover:text-primary">
                                                {p.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {p.category ?? "Uncategorized"} ·{" "}
                                                {new Date(p.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </span>
                                        <span className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1">
                                                <Heart className="h-3 w-3" /> {p.likes}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <MessageSquare className="h-3 w-3" /> {p.comments}
                                            </span>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function Stat({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
}) {
    return (
        <div className="flex flex-col items-center gap-1 text-center">
            <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            <NumberTicker value={value} className="text-xl font-semibold tabular-nums" />
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
    );
}
