"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post("/api/forgot-password", data);
            setSuccess(response.data.message || "Password reset link sent!");
        } catch (err: any) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || "An error occurred.");
            } else {
                setError("An error occurred, please try again.");
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
            <Card className="max-w-md mx-auto p-8">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
