"use client";
import { useState } from "react";

export default function PostForm() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const authorId = "someAuthorId"; // Replace with actual authorId (e.g., from session)
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, authorId }), // Include authorId
      });

      if (response.ok) {
        setTitle("");
        setContent("");
        alert("پست با موفقیت ایجاد شد!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`خطا در ایجاد پست: ${errorData.details || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در ارسال درخواست!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          عنوان
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          محتوا
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        ارسال
      </button>
    </form>
  );
}