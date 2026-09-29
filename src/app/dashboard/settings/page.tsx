import { getDashboardUser } from "@/utils/dashboardAuth";
import SettingsForm from "@/components/dashboard/SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
    const user = await getDashboardUser();

    return (
        <SettingsForm
            user={{
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }}
        />
    );
}
