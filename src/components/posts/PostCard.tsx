import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import PostExcerpt from "@/components/posts/PostExcerpt";

export type postType = {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    published: boolean;
    images: string[];
};

interface PostProps {
    postDetail: postType
};

export default function PostCard({ postDetail }: PostProps) {
    return (
        <Card className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <Link href={`/dashboard/posts/${postDetail.id}`}>
                <Image
                    className="rounded-t-lg w-full h-52 object-cover"
                    src={"/images/default-image.png"}
                    // src={postDetail?.images?.length > 0 ? postDetail?.images[0] : "/images/default-image.png"}
                    alt={postDetail.title}
                    width={400}
                    height={250}
                />
            </Link>
            <CardContent className="p-5">
                <Link href={`/dashboard/posts/${postDetail.id}`}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {postDetail.title}
                    </h5>
                </Link>
                <div className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
                    <PostExcerpt content={postDetail.content} />
                </div>
                <Link href={`/dashboard/posts/${postDetail.id}`}>
                    <Button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Read more
                        <svg
                            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}