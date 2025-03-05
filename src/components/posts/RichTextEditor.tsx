"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Strikethrough, List, ListOrdered, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg p-2">
      {/* نوار ابزار */}
      <div className="flex gap-2 mb-2">
        <Button variant="outline" size="icon" onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code size={16} />
        </Button>
      </div>

      {/* ویرایشگر */}
      <div className="border p-2 rounded-lg min-h-[150px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
