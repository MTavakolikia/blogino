"use client";

import { User } from "@/types/user";
import { create } from "zustand";
import Cookies from "js-cookie";

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user") || Cookies.get("user") || "null") : null,

    setUser: (user) => {
        set({ user });

        if (typeof window !== "undefined") {
            sessionStorage.setItem("user", JSON.stringify(user));
            Cookies.set("user", JSON.stringify(user), { expires: 7 }); // Store in cookies for 7 days
        }
    },

    clearUser: () => {
        set({ user: null });

        if (typeof window !== "undefined") {
            sessionStorage.removeItem("user");
            Cookies.remove("user");
        }
    },
}));

export default useUserStore;
