import bcrypt from "bcrypt";

/**
 * هش کردن پسورد
 * @param password - پسوردی که باید هش شود
 * @returns پسورد هش شده
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

/**
 * بررسی درستی رمز عبور
 * @param password - پسورد ورودی کاربر
 * @param hashedPassword - پسورد ذخیره‌شده در دیتابیس
 * @returns مقدار بولی (درست یا غلط بودن پسورد)
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}
