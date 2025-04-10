"use client";
import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Link from "next/link";
import { House } from "lucide-react";

const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordInner() {
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const [token, setToken] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams) {
            const urlToken = searchParams.get("token");
            if (urlToken) setToken(urlToken);
        }
    }, [searchParams]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            toast.error("Invalid token. Please check the reset link.");
            return;
        }

        try {
            await axios.post("/api/auth/reset-password", { ...data, token });
            toast.success("Password has been successfully changed!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "An error occurred while resetting the password.");
            } else {
                toast.error("An unknown error occurred.");
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="max-w-md mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" placeholder="New password" {...register("newPassword")} />
                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Button type="submit" className="w-full">Change Password</Button>
                    </motion.div>
                </form>

                <div className="mt-8 text-center text-sm">
                    Remember your password?{" "}
                    <Link href="/login" className="underline">Login</Link>
                    <div className="mt-4 text-center text-sm">
                        <Link href="/" className="flex items-center justify-center gap-2 text-cyan-100">
                            <House size={16} /> Back To Blogino
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div>Loading reset form...</div>}>
            <ResetPasswordInner />
        </Suspense>
    );
}
