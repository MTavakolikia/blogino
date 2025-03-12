"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface PostExcerptProps {
    content: string;
}

export default function PostExcerpt({ content }: PostExcerptProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: 'rtl text-sm',
            },
        },
    });

    return (
        <div className="prose-none">
            <EditorContent editor={editor} />
        </div>
    );
} 