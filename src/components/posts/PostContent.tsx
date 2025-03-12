"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface PostContentProps {
    content: string;
}

export default function PostContent({ content }: PostContentProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl rtl prose-headings:font-bold prose-p:text-justify prose-img:rounded-xl prose-img:mx-auto',
            },
        },
    });

    return (
        <div className="max-w-none w-full">
            <EditorContent editor={editor} />
        </div>
    );
} 