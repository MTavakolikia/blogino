import { prisma } from "@/utils/prisma";
import { getDashboardUser } from "@/utils/dashboardAuth";
import UserActions from "./UserActions";
import UserFormDialog from "@/components/dashboard/user-management/UserFormDialog";

export const dynamic = "force-dynamic";

export const metadata = { title: "Users" };

async function getUsers() {
    return prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            profilePic: true,
            createdAt: true,
            active: true,
            _count: { select: { posts: true } },
        },
    });
}

export default async function UserManagementPage() {
    await getDashboardUser(["ADMIN"]);
    const users = await getUsers();

    const authors = users.filter((u) => u.role === "AUTHOR").length;
    const inactive = users.filter((u) => !u.active).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                        Administration
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        User management
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {users.length} members · {authors} authors
                        {inactive > 0 && ` · ${inactive} deactivated`}
                    </p>
                </div>
                <UserFormDialog mode="create" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {users.map((user) => (
                    <UserManagementCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}

function UserManagementCard({
    user,
}: {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        profilePic: string | null;
        createdAt: Date;
        active: boolean;
        _count: { posts: number };
    };
}) {
    const roleStyles: Record<string, string> = {
        ADMIN: "bg-primary/10 text-primary",
        AUTHOR: "bg-chart-2/10 text-chart-2",
        USER: "bg-muted/60 text-muted-foreground",
    };

    return (
        <div className="flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {user.profilePic ? (
                        <img
                            src={user.profilePic}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-12 w-12 rounded-xl border border-border/60 object-cover"
                        />
                    ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                            {user.firstName[0]}
                            {user.lastName[0]}
                        </span>
                    )}
                    <span
                        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-card ${
                            user.active ? "bg-green-500" : "bg-red-500"
                        }`}
                        title={user.active ? "Active" : "Deactivated"}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold tracking-tight">
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        roleStyles[user.role] ?? roleStyles.USER
                    }`}
                >
                    {user.role}
                </span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
                <span>{user._count.posts} posts</span>
            </div>

            <div className="mt-4 border-t border-border/60 pt-4">
                <UserActions
                    user={{
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role,
                        profilePic: user.profilePic,
                        createdAt: user.createdAt.toISOString(),
                        active: user.active,
                        _count: user._count,
                    }}
                />
            </div>
        </div>
    );
}
