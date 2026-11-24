"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_EMAIL = "hello@blogino.dev";

const schema = z.object({
    name: z.string().min(2, "Tell us your name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    topic: z.string().min(1, "Pick a topic"),
    message: z
        .string()
        .min(20, "Give us at least 20 characters to work with")
        .max(3000, "Keep it under 3,000 characters"),
});

type FormValues = z.infer<typeof schema>;

const TOPICS = [
    { value: "feedback", label: "Feedback on an article" },
    { value: "writing", label: "Writing for Blogino" },
    { value: "collaboration", label: "Collaboration / sponsorship" },
    { value: "bug", label: "Bug report" },
    { value: "general", label: "Something else" },
];

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-destructive">{message}</p>;
}

export default function ContactForm() {
    const [submitting, setSubmitting] = React.useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", topic: "general", message: "" },
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const onSubmit = handleSubmit((values) => {
        const subject = encodeURIComponent(
            `[Blogino · ${
                TOPICS.find((t) => t.value === values.topic)?.label ??
                values.topic
            }] — ${values.name}`,
        );
        const body = encodeURIComponent(
            `${values.message}\n\n— ${values.name} <${values.email}>`,
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        toast.success("Opening your email app — the message is pre-filled");
        setSubmitting(false);
    });

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        placeholder="Ada Lovelace"
                        autoComplete="name"
                        {...register("name")}
                    />
                    <FieldError message={errors.name?.message} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="ada@example.com"
                        autoComplete="email"
                        {...register("email")}
                    />
                    <FieldError message={errors.email?.message} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select
                    value={watch("topic")}
                    onValueChange={(value) =>
                        setValue("topic", value, { shouldValidate: true })
                    }
                >
                    <SelectTrigger id="topic" className="w-full">
                        <SelectValue placeholder="What's this about?" />
                    </SelectTrigger>
                    <SelectContent>
                        {TOPICS.map((topic) => (
                            <SelectItem key={topic.value} value={topic.value}>
                                {topic.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FieldError message={errors.topic?.message} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    rows={6}
                    placeholder="What's on your mind? Link the article, point at the problem, or pitch the idea…"
                    {...register("message")}
                />
                <div className="flex items-center justify-between gap-4">
                    <FieldError message={errors.message?.message} />
                    <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                        {watch("message").length}/3000
                    </span>
                </div>
            </div>

            <div className="space-y-2 pt-1">
                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin" /> : <Send />}
                    Send message
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                    This opens your email app with everything pre-filled —
                    nothing is stored on this site.
                </p>
            </div>
        </form>
    );
}
