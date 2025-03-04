"use client";

import { useTheme } from "next-themes";
import Editor from '@monaco-editor/react';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function MonacoEditor({ value, onChange }: EditorProps) {
    const { theme } = useTheme();
    const editorTheme = theme === "dark" ? "vs-dark" : "light";

    return (
        <div className="border rounded-lg overflow-hidden">

            <Editor
                height="300px"
                defaultLanguage="markdown"
                theme={editorTheme}
                value={value}
                onChange={(newValue) => onChange(newValue || "")}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                }}
            />

        </div>
    );
}
