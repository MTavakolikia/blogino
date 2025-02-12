"use client"
import axios from "axios";

export default function LogoutButton() {
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");

            alert("خروج با موفقیت انجام شد!");

            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
            alert("خطایی رخ داد، لطفاً دوباره امتحان کنید.");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
        >
            خروج
        </button>
    );
}