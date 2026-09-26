import { redirect } from "next/navigation";

// This route was merged into /dashboard/manage-categories.
export default function CategoriesPage() {
    redirect("/dashboard/manage-categories");
}
