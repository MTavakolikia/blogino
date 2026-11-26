"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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
                // The `prose` / `dark:prose-invert` styling lives on the single
                // wrapper in the post page. Adding another `prose` here would
                // reset the inverted colour variables and render dark text on
                // a dark background.
                class: "focus:outline-none",
            },
        },
    });

    return (
        <div className="w-full max-w-none">
            <EditorContent editor={editor} />
        </div>
    );
}
