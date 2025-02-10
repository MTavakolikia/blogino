"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface Article {
    id: string; // تغییر از number به string (چون Prisma از cuid استفاده می‌کند)
    title: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        name: string | null;
        email: string | null;
    };
}

export default function Posts() {
    const [articles, setArticles] = useState<Article[]>([]);

    const fetchArticles = async () => {
        try {
            const response = await fetch("/api/articles");
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <div className="mt-8 space-y-4">
            {articles.map((article) => (
                <div key={article.id} className="p-4 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold">{article.title}</h2>
                    <p className="mt-2 text-gray-700">{article.content}</p>
                    <p className="mt-2 text-sm text-gray-500">
                        تاریخ ایجاد: {new Date(article.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        نویسنده: {article.author.name} ({article.author.email})
                    </p>
                    <Button>Click me</Button>
                </div>
            ))}
        </div>
    );
}