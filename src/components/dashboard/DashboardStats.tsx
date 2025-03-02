"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FaRegThumbsUp, FaRegComment, FaNewspaper } from "react-icons/fa";


type DashboardStatsProps = {
    stats: {
        activePosts: number,
        inactivePosts: number,
        categories: number,
        likes: number,
        comments: number
    }


}

export default function DashboardStats({ stats }: DashboardStatsProps) {


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="shadow-lg">
                    <CardHeader className="flex justify-between items-center">
                        <span className="text-lg font-bold">Published Posts</span>
                        <FaNewspaper size={24} className="text-blue-500" />
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-gray-800 dark:text-white">
                        {stats?.activePosts}
                    </CardContent>
                </Card>
            </motion.div>            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="shadow-lg">
                    <CardHeader className="flex justify-between items-center">
                        <span className="text-lg font-bold">Unpublished Post</span>
                        <FaNewspaper size={24} className="text-blue-500" />
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-gray-800 dark:text-white">
                        {stats?.inactivePosts}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <Card className="shadow-lg">
                    <CardHeader className="flex justify-between items-center">
                        <span className="text-lg font-bold">Likes</span>
                        <FaRegThumbsUp size={24} className="text-yellow-500" />
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-gray-800 dark:text-white">
                        {stats?.likes}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
                <Card className="shadow-lg">
                    <CardHeader className="flex justify-between items-center">
                        <span className="text-lg font-bold">Comments</span>
                        <FaRegComment size={24} className="text-purple-500" />
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-gray-800 dark:text-white">
                        {stats?.comments}
                    </CardContent>
                </Card>
            </motion.div>


        </div>
    );
}
