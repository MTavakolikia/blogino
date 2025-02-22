"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { RegisterFormData, registerSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner"
import { motion } from "framer-motion";
import { House } from "lucide-react";
import { useRouter } from "next/navigation";


export default function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("/api/auth/register", data);
            toast(response.data.message || "Registration successful!");
            router.push("/login");

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast(err.response?.data?.error || "error occurred.");
            } else {
                toast("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="max-w-md mx-auto  bg-transparent  border-none text-white">

                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Enter your information to register to Blogino
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" {...register("firstName")} />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register("lastName")} />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }}>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </Button>
                        </motion.div>

                    </form>
                    <div className="mt-8 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Login
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