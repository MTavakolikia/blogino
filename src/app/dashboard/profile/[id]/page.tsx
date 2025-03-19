"use client"
import UserProfile from "@/components/UserProfile";
import axios from "axios";
import { useEffect, useState } from "react";

interface ProfilePageProps {
    params: { id: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
    const [user, setUser] = useState<{ firstName: string; lastName: string; profilePic?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/users/${params.id}`);
                setUser(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [params.id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>
            {user && <UserProfile user={user} />}
        </div>
    );
}