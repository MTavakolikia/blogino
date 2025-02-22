import { prisma } from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const category = await prisma.category.findUnique({
                where: { id: String(id) },
                include: { posts: true },
            });

            if (!category) return res.status(404).json({ error: "دسته‌بندی یافت نشد" });
            return res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({ error: "خطا در دریافت اطلاعات دسته‌بندی" });
        }
    }

    if (req.method === "PUT") {
        try {
            const { name } = req.body;
            const updatedCategory = await prisma.category.update({
                where: { id: String(id) },
                data: { name },
            });

            return res.status(200).json(updatedCategory);
        } catch (error) {
            return res.status(500).json({ error: "خطا در به‌روزرسانی دسته‌بندی" });
        }
    }

    if (req.method === "DELETE") {
        try {
            await prisma.category.delete({ where: { id: String(id) } });
            return res.status(200).json({ message: "دسته‌بندی حذف شد" });
        } catch (error) {
            return res.status(500).json({ error: "خطا در حذف دسته‌بندی" });
        }
    }

    return res.status(405).json({ error: "متد نامعتبر است" });
}
