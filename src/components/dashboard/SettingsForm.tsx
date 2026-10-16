"use client";

import * as React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Mail,
    User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email"),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Enter your current password"),
        newPassword: z.string().min(6, "At least 6 characters"),
        confirmPassword: z.string().min(1, "Confirm your new password"),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
type PasswordValues = z.infer<typeof passwordSchema>;

export default function SettingsForm({
    user: initialUser,
}: {
    user: { id: string; firstName: string; lastName: string; email: string };
}) {
    const router = useRouter();
    const [profile, setProfile] = React.useState(initialUser);
    const [savingProfile, setSavingProfile] = React.useState(false);
    const [savingPassword, setSavingPassword] = React.useState(false);
    const [showNew, setShowNew] = React.useState(false);

    const profileForm = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: initialUser.firstName,
            lastName: initialUser.lastName,
            email: initialUser.email,
        },
    });

    const passwordForm = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onProfileSubmit = profileForm.handleSubmit(async (values) => {
        setSavingProfile(true);
        try {
            await axios.patch(`/api/users/${profile.id}`, values);
            setProfile({ ...profile, ...values });
            toast.success("Profile updated");
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to update profile");
            } else {
                toast.error("Failed to update profile");
            }
        } finally {
            setSavingProfile(false);
        }
    });

    const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
        setSavingPassword(true);
        try {
            await axios.post("/api/auth/change-password", {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            toast.success("Password changed");
            passwordForm.reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to change password");
            } else {
                toast.error("Failed to change password");
            }
        } finally {
            setSavingPassword(false);
        }
    });

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Account
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage how you appear on the blog and keep your account secure.
                </p>
            </div>

            {/* Profile */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-primary" /> Profile
                    </CardTitle>
                    <CardDescription>
                        Your name is shown on every article you publish.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={onProfileSubmit}
                        className="space-y-4"
                        noValidate
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    id="firstName"
                                    {...profileForm.register("firstName")}
                                />
                                {profileForm.formState.errors.firstName && (
                                    <p className="text-xs text-destructive">
                                        {profileForm.formState.errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    id="lastName"
                                    {...profileForm.register("lastName")}
                                />
                                {profileForm.formState.errors.lastName && (
                                    <p className="text-xs text-destructive">
                                        {profileForm.formState.errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    className="pl-8"
                                    {...profileForm.register("email")}
                                />
                            </div>
                            {profileForm.formState.errors.email && (
                                <p className="text-xs text-destructive">
                                    {profileForm.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={savingProfile}>
                                {savingProfile && <Loader2 className="animate-spin" />}
                                Save profile
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Password */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-primary" /> Password
                    </CardTitle>
                    <CardDescription>
                        Choose a strong password you don't use anywhere else.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={onPasswordSubmit}
                        className="space-y-4"
                        noValidate
                    >
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                autoComplete="current-password"
                                {...passwordForm.register("currentPassword")}
                            />
                            {passwordForm.formState.errors.currentPassword && (
                                <p className="text-xs text-destructive">
                                    {passwordForm.formState.errors.currentPassword.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showNew ? "text" : "password"}
                                        autoComplete="new-password"
                                        className="pr-10"
                                        {...passwordForm.register("newPassword")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew((v) => !v)}
                                        aria-label={showNew ? "Hide password" : "Show password"}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {showNew ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {passwordForm.formState.errors.newPassword && (
                                    <p className="text-xs text-destructive">
                                        {passwordForm.formState.errors.newPassword.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm new password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showNew ? "text" : "password"}
                                    autoComplete="new-password"
                                    {...passwordForm.register("confirmPassword")}
                                />
                                {passwordForm.formState.errors.confirmPassword && (
                                    <p className="text-xs text-destructive">
                                        {passwordForm.formState.errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={savingPassword}>
                                {savingPassword && <Loader2 className="animate-spin" />}
                                Update password
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
