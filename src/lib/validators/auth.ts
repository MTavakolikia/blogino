import * as z from "zod";

export const registerSchema = z.object({
    firstName: z.string().min(1, "نام الزامی است"),
    lastName: z.string().min(1, "نام خانوادگی الزامی است"),
    email: z.string().email("ایمیل معتبر نیست"),
    password: z.string().min(6, "رمز عبور حداقل 6 کاراکتر باید باشد"),
});
export type RegisterFormData = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
    email: z.string().email("ایمیل معتبر نیست"),
    password: z.string().min(6, "رمز عبور حداقل 6 کاراکتر باید باشد"),
});
export type LoginFormData = z.infer<typeof loginSchema>;
