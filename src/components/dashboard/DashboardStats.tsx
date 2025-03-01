"use client"


import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { FaRegThumbsUp, FaRegComment, FaLayerGroup, FaNewspaper } from "react-icons/fa";

export default function DashboardStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get("/api/dashboard/stats");
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <Skeleton className="w-full h-64" />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {/* Statistics Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="shadow-lg">
                    <CardHeader className="flex justify-between items-center">
                        <span className="text-lg font-bold">پست‌های فعال</span>
                        <FaNewspaper size={24} className="text-blue-500" />
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-gray-800 dark:text-white">
                        {stats?.activePosts}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="shadow-lg">
                    <CardHeader className="flex justify-between items-center">
                        <span className="text-lg font-bold">پست‌های غیرفعال</span>
                        <FaNewspaper size={24} className="text-red-500" />
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-gray-800 dark:text-white">
                        {stats.inactivePosts}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <Card className="shadow-lg">
                    <CardHeader className="flex justify-between items-center">
                        <span className="text-lg font-bold">دسته‌بندی‌ها</span>
                        <FaLayerGroup size={24} className="text-green-500" />
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-gray-800 dark:text-white">
                        {stats.categories}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Card className="shadow-lg">
                    <CardHeader className="flex justify-between items-center">
                        <span className="text-lg font-bold">تعداد لایک</span>
                        <FaRegThumbsUp size={24} className="text-yellow-500" />
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-gray-800 dark:text-white">
                        {stats.likes}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
                <Card className="shadow-lg">
                    <CardHeader className="flex justify-between items-center">
                        <span className="text-lg font-bold">تعداد کامنت</span>
                        <FaRegComment size={24} className="text-purple-500" />
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-gray-800 dark:text-white">
                        {stats.comments}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts */}
            <div className="col-span-2 mt-6">
                <Card className="shadow-lg p-4">
                    <h2 className="text-xl font-bold text-center">نمودار پست‌های منتشر شده</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.postsByMonth}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3182CE" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div className="col-span-2 mt-6">
                <Card className="shadow-lg p-4">
                    <h2 className="text-xl font-bold text-center">تعامل کاربران</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.engagementByMonth}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="likes" stroke="#F59E0B" />
                            <Line type="monotone" dataKey="comments" stroke="#A855F7" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}
