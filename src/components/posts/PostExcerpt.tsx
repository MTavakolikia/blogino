"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

interface PostExcerptProps {
    content: string;
}

export default function PostExcerpt({ content }: PostExcerptProps) {
    const [mounted, setMounted] = useState(false);
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

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="rtl text-sm">{content}</div>;
    }

    return (
        <div className="prose-none">
            <EditorContent editor={editor} />
        </div>
    );
} 