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

import { registerSchema, type RegisterFormData } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            await axios.post("/api/auth/register", data);
            toast.success("Account created — you can log in now.");
            router.push("/login");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.error || "Registration failed. Please try again.");
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
                    Create your account
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Join Blogino — read, write and take part in the discussion
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                            id="firstName"
                            placeholder="Ada"
                            autoComplete="given-name"
                            {...register("firstName")}
                        />
                        {errors.firstName && (
                            <p className="text-xs text-destructive">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                            id="lastName"
                            placeholder="Lovelace"
                            autoComplete="family-name"
                            {...register("lastName")}
                        />
                        {errors.lastName && (
                            <p className="text-xs text-destructive">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="At least 6 characters"
                            className="pr-10"
                            {...register("password")}
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
                    {loading ? "Creating account…" : "Create account"}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-primary hover:underline underline-offset-4"
                >
                    Log in
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
