import Link from "next/link";
import { Home, LayoutDashboard, ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { TextReveal } from "@/components/magicui/text-reveal";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-dvh items-center justify-center px-4 py-16">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/70 bg-card px-8 py-12 text-center shadow-sm">
                <BorderBeam duration={12} borderWidth={1.25} />

                <div className="relative">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <ShieldX className="h-7 w-7" />
                    </span>

                    <h1 className="mt-5 text-2xl font-semibold tracking-tighter">
                        <TextReveal text="Access denied" />
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        This area is reserved for editors and authors. If you
                        believe you should be here, sign in with an account
                        that has the right role.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                        <Button asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="h-4 w-4" />
                                Go to dashboard
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/">
                                <Home className="h-4 w-4" /> Back home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
