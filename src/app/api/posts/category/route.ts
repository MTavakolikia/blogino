import { prisma } from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const categories = await prisma.category.findMany({
                include: { posts: true },
            });
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ error: "خطا در دریافت دسته‌بندی‌ها" });
        }
    }

    if (req.method === "POST") {
        try {
            const { name } = req.body;
            if (!name) return res.status(400).json({ error: "نام دسته‌بندی الزامی است" });

            const category = await prisma.category.create({
                data: { name },
            });
            return res.status(201).json(category);
        } catch (error) {
            return res.status(500).json({ error: "خطا در ایجاد دسته‌بندی" });
        }
    }

    return res.status(405).json({ error: "متد نامعتبر است" });
}
