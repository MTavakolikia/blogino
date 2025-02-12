import ProfileImageUploadForm from "./forms/ProfileImageUploadForm";

interface UserProfileProps {
    user: { firstName: string; lastName: string; profilePic?: string };
}

export default function UserProfile({ user }: UserProfileProps) {
    return (
        <div className="flex items-center space-x-4">
            {user.profilePic ? (
                <img
                    src={user.profilePic}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300" />
            )}
            <div>
                <p>{user.firstName} {user.lastName}</p>
                <ProfileImageUploadForm userId="" />
            </div>
        </div>
    );
}