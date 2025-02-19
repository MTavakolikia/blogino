"use client"

import { User } from "@/types/user";
import { create } from "zustand";



interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user") || "null") : null,
    setUser: (user) => {
        set({ user });
        if (typeof window !== "undefined") {
            sessionStorage.setItem("user", JSON.stringify(user));
        }
    },
    clearUser: () => {
        set({ user: null });
        if (typeof window !== "undefined") {
            sessionStorage.removeItem("user");
        }
    },
}));


export default useUserStore;
