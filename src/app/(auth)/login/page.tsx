"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Rss } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import useUserStore from "@/store/userStore";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const { setUser } = useUserStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const res = await axios.post("/api/auth/login", data);
            setUser(res.data);
            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.error || "Login failed. Please try again.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="mb-6 flex flex-col items-center text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Rss className="h-6 w-6" />
                </span>
                <h1 className="mt-3 text-xl font-semibold tracking-tight">
                    Welcome back
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Log in to your Blogino account
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                    {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/forget-password"
                            className="text-xs font-medium text-primary hover:underline underline-offset-4"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            {...register("password")}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-destructive">{errors.password.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="animate-spin" />}
                    {loading ? "Logging in…" : "Log in"}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    className="font-medium text-primary hover:underline underline-offset-4"
                >
                    Sign up
                </Link>
            </div>

            <div className="mt-4 text-center">
                <Link
                    href="/"
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                    ← Back to Blogino
                </Link>
            </div>
        </motion.div>
    );
}
