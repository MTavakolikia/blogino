// types.ts
export interface Post {
    title: string;
    content: string;
}

export interface PostFormProps {
    onSubmit: (post: Post) => void;
}