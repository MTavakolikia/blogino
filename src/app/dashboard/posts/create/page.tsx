import { getDashboardUser } from "@/utils/dashboardAuth";
import PostFormPage from "@/components/dashboard/posts/PostFormPage";

export const metadata = { title: "New post" };

export default async function CreatePostPage() {
    await getDashboardUser(["ADMIN", "AUTHOR"]);

    return <PostFormPage mode="create" />;
}
