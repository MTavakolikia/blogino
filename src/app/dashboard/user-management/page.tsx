import { prisma } from "@/utils/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, User, Calendar, Shield, UserCog } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserActions from "./UserActions";
import UserFormDialog from "@/components/dashboard/user-management/UserFormDialog";

async function getUsers() {
    try {
        return await prisma.user.findMany({
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
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
}


export default async function UserManagement() {
    const users = await getUsers();
    return (
        <ProtectedRoute requiredRoles={["ADMIN"]}>
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <UserCog className="w-8 h-8 text-primary" />
                        User Management
                    </h1>
                    {/* <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                    </Button> */}
                    <UserFormDialog mode="create" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <Card key={user.id} className="shadow-md hover:shadow-lg transition">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar className={`w-16 h-16 ${user.active ? "border-4 border-green-300" : "border-4 border-red-500"}`}>
                                    <AvatarImage
                                        src={user.profilePic || "/profile.png"}
                                        alt={`${user.firstName} ${user.lastName}`}
                                    />
                                    <AvatarFallback>
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">
                                        {user.firstName} {user.lastName}
                                    </CardTitle>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Shield className="w-4 h-4" />
                                        {user.role}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="my-2">
                                    <p className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        Joined: {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4" />
                                        Posts: {user._count.posts}
                                    </p>
                                    <div className="mt-6">
                                        <UserActions user={user} />

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}