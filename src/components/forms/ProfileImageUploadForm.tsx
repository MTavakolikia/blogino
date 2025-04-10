"use client";

import { useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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

            const { data } = supabase.storage
                .from("user-profiles")
                .getPublicUrl(filePath);

            if (!data?.publicUrl) {
                throw new Error("Failed to generate public URL for the image.");
            }

            const publicURL = data.publicUrl;

            await axios.patch(`/api/users/${userId}`, { profilePic: publicURL });

            toast.success("Profile image uploaded successfully!");
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Upload Profile Image</h1>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={loading}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {loading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
        </div>
    );
}
