"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/utils/supabase";
import { ImageIcon, Loader2 } from "lucide-react";

interface UserFormDialogProps {
    mode: "create" | "edit" | "view";
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        profilePic: string | null;
        bio?: string;
        createdAt: Date;
        active: boolean;
    };
}

export default function UserFormDialog({ mode, user }: UserFormDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profilePic || null);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const userFormSchema = z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        role: z.enum(["ADMIN", "AUTHOR", "USER"]),
        bio: z.string().optional(),
        profilePic: z.string().optional(),
        active: z.boolean().default(true),
        password: z.string().min(6, "Password must be at least 6 characters").optional(),
        confirmPassword: z.string().optional(),
    }).refine((data) => {
        if (mode === "create") {
            return data.password === data.confirmPassword;
        }
        return true;
    }, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

    type UserFormValues = z.infer<typeof userFormSchema>;

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            role: (user?.role as "ADMIN" | "AUTHOR" | "USER") || "USER",
            bio: user?.bio || "",
            profilePic: user?.profilePic || "",
            active: user?.active ?? true,
            password: "",
            confirmPassword: "",
        },
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const path = `profile-pics/${Date.now()}-${file.name}`;
            const url = await uploadImage(file, 'avatars', path);
            form.setValue('profilePic', url);
            setPreviewUrl(url);
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data: UserFormValues) => {
        setIsLoading(true);
        try {
            if (mode === "create") {
                await axios.post("/api/users", data);
                toast.success("User created successfully");
            } else if (mode === "edit" && user) {
                await axios.patch(`/api/users/${user.id}`, data);
                toast.success("User updated successfully");
            }
            router.refresh();
            setOpen(false);
        } catch (error) {
            console.error("Error saving user:", error);
            if (axios.isAxiosError(error) && error.response?.data?.code === "EMAIL_EXISTS") {
                form.setError("email", {
                    type: "manual",
                    message: "This email is already registered"
                });
            } else {
                toast.error("Failed to save user");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        form.reset();
        setOpen(false);
    };

    const isViewMode = mode === "view";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    {mode === "create" ? "Create New User" :
                        mode === "edit" ? "Edit User" : "User Details"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Create New User" :
                            mode === "edit" ? "Edit User" : "User Details"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={previewUrl || undefined} />
                                <AvatarFallback>
                                    {form.watch("firstName")?.[0]}
                                    {form.watch("lastName")?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            {!isViewMode && (
                                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer hover:bg-primary/90">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />
                                    {isUploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ImageIcon className="h-4 w-4" />
                                    )}
                                </label>
                            )}
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isViewMode} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isViewMode} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" disabled={isViewMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            disabled={isViewMode}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="AUTHOR">Author</SelectItem>
                                                <SelectItem value="USER">User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {mode === "create" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="password" disabled={isViewMode} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="password" disabled={isViewMode} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                disabled={isViewMode}
                                                placeholder="User biography"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {!isViewMode && (
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Saving..." : "Save"}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
} 