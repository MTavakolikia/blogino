
"use client"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/userStore";

const loginSchema = z.object({
    email: z.string().email("ایمیل معتبر نیست"),
    password: z.string().min(6, "رمز عبور حداقل 6 کاراکتر باید باشد"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });
    const { setUser } = useUserStore();
    const router = useRouter();
    const onSubmit = async (data: LoginFormData) => {
        try {
            const res = await axios.post("/api/login", data);
            setUser(res.data)
            alert("ورود با موفقیت انجام شد!");
            // window.location.href = "/dashboard";
            router.push("/dashboard"); // Use router.push for redirection

        } catch (err: any) {
            alert(err.response?.data?.error || "خطایی رخ داد.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">ایمیل:</label>
                <input
                    {...register("email")}
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">رمز عبور:</label>
                <input
                    {...register("password")}
                    type="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                ورود
            </button>
        </form>
    );
}