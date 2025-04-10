import ProfilePageClient from "@/components/dashboard/ProfilePageClient";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return <ProfilePageClient id={id} />;
}
