import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex w-full h-screen items-center justify-center">
            <div className="text-center">
                <ShieldX className="mx-auto h-16 w-16 text-red-500" />
                <h1 className="mt-4 text-3xl font-bold">Unauthorized Access</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    You don&lsquo;t have permission to access this page.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="outline">Go to Dashboard</Button>
                    </Link>
                    <Link href="/">
                        <Button>Go Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}