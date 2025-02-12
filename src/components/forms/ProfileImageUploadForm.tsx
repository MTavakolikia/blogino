"use client"
import { useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabase";

interface ProfileImageUploadProps {
    userId: string;
}

export default function ProfileImageUploadForm({ userId }: ProfileImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = `profiles/${userId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("user-profiles")
                .upload(filePath, file);

            if (uploadError) {
                throw new Error(uploadError.message);
            }

            const { data, error: publicUrlError } = supabase.storage
                .from("user-profiles")
                .getPublicUrl(filePath);

            if (publicUrlError || !data?.publicUrl) {
                throw new Error("Failed to generate public URL for the image.");
            }

            const publicURL = data.publicUrl;

            await axios.patch(`/api/users/${userId}`, { profilePic: publicURL });

            alert("تصویر پروفایل با موفقیت آپلود شد!");
        } catch (err: any) {
            setError(err.message || "خطایی رخ داد.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">آپلود تصویر پروفایل</h1>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={loading}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            {loading && <p>در حال آپلود...</p>}
        </div>
    );
}