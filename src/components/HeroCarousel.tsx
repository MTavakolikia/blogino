"use client";

import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { format } from "date-fns";
import PostExcerpt from "@/components/posts/PostExcerpt";

interface Post {
    id: string;
    title: string;
    content: string;
    images: string[];
    createdAt: string;
    category: { name: string };
}

export default function HeroCarousel() {
    const [posts, setPosts] = useState<Post[]>([]);
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true, stopOnFocusIn: true })
    );

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("/api/posts");
                console.log(response.data);

                setPosts(response.data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching featured posts:", error);
            }
        };

        fetchPosts();
    }, []);

    if (posts.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>;
    }

    return (
        <div className="relative w-full max-w-5xl mx-auto">
            <Carousel
                plugins={[plugin.current]}
                className="w-full"

            // onMouseEnter={plugin.current.stop}
            // onMouseLeave={plugin.current.play}
            >
                <CarouselContent>
                    {posts.map((post) => (
                        <CarouselItem key={post.id} className="w-full basis-1/2">
                            <Card className="relative w-full overflow-hidden rounded-xl shadow-lg dark:bg-gray-900">
                                <Link href={`/dashboard/posts/${post.id}`}>
                                    <Image
                                        className="w-full h-[400px] object-cover"
                                        src={post.images.length > 0 ? post.images[0] : "/images/default-image.png"}
                                        alt={post.title}
                                        width={800}
                                        height={450}
                                        priority
                                    />
                                </Link>
                                <CardContent className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                                    <span className="text-sm font-semibold bg-blue-500 px-3 py-1 rounded-full">
                                        {post.category?.name}
                                    </span>

                                    <Link href={`/dashboard/posts/${post.id}`}>
                                        <h2 className="mt-2 text-2xl font-bold hover:underline">{post.title}</h2>
                                    </Link>

                                    <div className="mt-1 text-sm line-clamp-2 text-white">
                                        <PostExcerpt content={post.content} />
                                    </div>
                                    <span className="block mt-2 text-sm text-gray-300">
                                        {format(new Date(post.createdAt), "dd MMM yyyy")}
                                    </span>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
