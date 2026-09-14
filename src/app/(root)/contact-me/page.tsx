import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "@/components/root/ContactForm";
import { CopyEmailButton } from "@/components/root/CopyEmailButton";
import { FaqList, type FaqItem } from "@/components/root/FaqList";
import { SectionHeading } from "@/components/root/SectionHeading";
import { BentoCard } from "@/components/magicui/bento-grid";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Spotlight } from "@/components/magicui/spotlight";
import { TextReveal } from "@/components/magicui/text-reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Feedback on an article, a pitch, a bug report or a collaboration idea — get in touch with the Blogino team.",
};

const CONTACT_EMAIL = "hello@blogino.dev";

const FAQ_ITEMS: FaqItem[] = [
    {
        question: "Do you take guest posts?",
        answer:
            "Yes. If you can write deeply about something you've actually shipped, debugged or built, we want to read it. Pitch a 200-word outline first — if it fits, we'll work out an outline and a deadline together.",
    },
    {
        question: "Can I request a topic?",
        answer:
            "Absolutely, use the form and pick “Feedback on an article” or “Something else”. A large part of our editorial roadmap comes directly from reader requests.",
    },
    {
        question: "I found an error in an article.",
        answer:
            "Please tell us — we link the article, point at the problem and fix what we can. Corrections are published openly at the bottom of the piece.",
    },
    {
        question: "Do you do consulting or sponsored content?",
        answer:
            "We don't do consulting. For sponsorships we only work with products our authors actually use, and every sponsored piece is clearly labeled.",
    },
];

function Glow({ className }: { className?: string }) {
    return (
        <div
            className={
                "absolute h-48 w-48 rounded-full bg-primary/10 blur-3xl " +
                (className ?? "")
            }
        />
    );
}

export default function ContactPage() {
    return (
        <div className="relative">
            {/* Hero */}
            <Spotlight className="border-b border-border/60">
                <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
                    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Contact
                    </p>

                    <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
                        <TextReveal text="Tell us what you're thinking." />
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                        Article feedback, corrections, pitches,
                        collaboration ideas — we read everything that comes
                        in, and reply to most of it.
                    </p>
                </div>
            </Spotlight>

            {/* Contact form + info */}
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
                <div className="flex flex-col gap-4">
                    <BentoCard
                        icon="Mail"
                        title="Email"
                        description="The fastest way to reach us. No ticket numbers, no bots — a person answers."
                        background={<Glow className="-right-16 -top-16" />}
                        header={
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="text-sm font-medium text-foreground">
                                    {CONTACT_EMAIL}
                                </span>
                                <CopyEmailButton email={CONTACT_EMAIL} />
                            </div>
                        }
                    />
                    <BentoCard
                        icon="Clock3"
                        title="We reply fast"
                        description="Most messages get an answer within 48 hours. If it's a bug, attach what you can — the slower it is, the more it helps."
                        background={<Glow className="-left-16 -bottom-16" />}
                    />
                    <BentoCard
                        icon="PenLine"
                        title="Writers wanted"
                        description="We publish work from readers all the time. If you write the way you wish you could read, pitch us."
                        background={<Glow className="-right-16 -bottom-16" />}
                        header={
                            <Button asChild size="sm" variant="outline">
                                <Link href="/register">Apply as an author</Link>
                            </Button>
                        }
                    />
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
                    <BorderBeam duration={10} borderWidth={1.25} />
                    <div className="relative">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Send a message
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Three fields and a message — that's all we need.
                        </p>
                        <div className="mt-6">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="border-t border-border/60 bg-muted/20">
                <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
                    <SectionHeading
                        eyebrow="Before you write"
                        title="Frequently asked"
                        description="The answers to the questions we get most."
                    />
                    <div className="mt-8 max-w-3xl">
                        <FaqList items={FAQ_ITEMS} />
                    </div>
                </div>
            </div>
        </div>
    );
}
