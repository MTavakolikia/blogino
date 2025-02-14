export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "AUTHOR" | "USER";
    profilePic?: string;
}