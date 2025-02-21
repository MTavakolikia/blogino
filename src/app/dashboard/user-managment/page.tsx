import { prisma } from "@/utils/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, User, Calendar, Shield } from "lucide-react";

export default async function UserManagement() {
    try {
        // دریافت لیست کاربران از پایگاه داده
        const users = await prisma.user.findMany();

        return (
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                    <User className="w-8 h-8 text-blue-600" />
                    User Management
                </h1>

                {users.length === 0 ? (
                    <p className="text-gray-500 text-center">No users found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <Card key={user.id} className="shadow-md hover:shadow-lg transition border border-gray-200 dark:border-gray-700">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    {/* آواتار کاربر */}
                                    <Avatar className="w-14 h-14">
                                        <AvatarImage src={user.profilePic || "/profile.png"} alt={user.firstName} />
                                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">{user.firstName} {user.lastName}</CardTitle>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-blue-500" />
                                            {user.role}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* ایمیل کاربر */}
                                    <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <Mail className="w-5 h-5 text-blue-500" />
                                        {user.email}
                                    </p>
                                    {/* تاریخ عضویت */}
                                    <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-2">
                                        <Calendar className="w-5 h-5 text-green-500" />
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        );
    } catch (error) {
        return <p className="text-red-500 text-center">Error fetching users!</p>;
    }
}
