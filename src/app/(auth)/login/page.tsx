"use client"

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/userStore";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { House } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });
    const { setUser } = useUserStore();
    const router = useRouter();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const res = await axios.post("/api/auth/login", data);
            setUser(res.data);
            toast("Successful Login!");
            router.push("/dashboard");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast(err.response?.data?.error || "error occurred.");
            } else {
                toast("An unexpected error occurred.");
            }
        }
    };

    return (

        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >

            <Card className="bg-transparent border-none text-white">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input {...register("email")} id="email" type="email" placeholder="m@example.com" />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forget-password" className="text-sm text-cyan-400 hover:underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input {...register("password")} id="password" type="password" />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Button type="submit" className="w-full">Login</Button>
                        </motion.div>

                    </form>
                    <div className="mt-8 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="underline">
                            Sign up
                        </Link>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        <Link href="/" className="flex items-center justify-center gap-2 text-cyan-100" >
                            <House size={16} /> Back To Blogino
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

    );
}
