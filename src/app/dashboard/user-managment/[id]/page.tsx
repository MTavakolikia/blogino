"use client";
import { useState } from "react";
import { toast } from "sonner"

export default function EditProfileForm({ user }: { user: any }) {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [contactInfo, setContactInfo] = useState(user.contactInfo || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, contactInfo }),
            });

            if (response.ok) {
                toast("پروفایل با موفقیت به‌روزرسانی شد!");
            } else {
                const errorData = await response.json();
                toast(`خطا در به‌روزرسانی پروفایل: ${errorData.details || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast("خطا در ارسال درخواست!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    نام
                </label>

                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    نام خانوادگی
                </label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div>
                <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
                    راه ارتباطی
                </label>
                <input
                    type="text"
                    id="contactInfo"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                به‌روزرسانی پروفایل
            </button>
        </form>
    );
}