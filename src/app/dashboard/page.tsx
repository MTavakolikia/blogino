"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stringifiedUser = sessionStorage.getItem("user");
        if (stringifiedUser) {
            setUser(JSON.parse(stringifiedUser));
        }
    }, []);

    if (!user) {
        return <p>لطفاً وارد شوید.</p>;
    }

    return (
        <div>
            <h1>داشبورد</h1>
            <p>سلام، {user.firstName} {user.lastName}! نقش شما: {user.role}</p>
        </div>
    );
}
