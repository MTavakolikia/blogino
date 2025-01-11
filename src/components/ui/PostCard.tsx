import { Post } from '@/types/post';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <div className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="mt-2">{post.content}</p>
            <p className="text-sm text-gray-600 mt-2">نویسنده: {post.author}</p>
        </div>
    );
};

export default PostCard;