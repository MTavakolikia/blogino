"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editCategory, setEditCategory] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    // دریافت لیست دسته‌بندی‌ها از API
    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/posts/category");
            setCategories(res.data);
        } catch (error) {
            console.error("خطا در دریافت دسته‌بندی‌ها:", error);
        }
    };

    // ارسال دسته‌بندی جدید به سرور
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory) return;

        try {
            await axios.post("/api/posts/category", { name: newCategory });
            setNewCategory("");
            fetchCategories(); // بروزرسانی لیست دسته‌بندی‌ها
        } catch (error) {
            console.error("خطا در افزودن دسته‌بندی:", error);
        }
    };

    // ارسال تغییرات به سرور برای ویرایش دسته‌بندی
    const handleEditCategory = async () => {
        if (!editCategory?.name) return;

        try {
            await axios.put(`/api/posts/category/${editCategory.id}`, { name: editCategory.name });
            setEditCategory(null); // بستن فرم ویرایش
            fetchCategories();
        } catch (error) {
            console.error("خطا در ویرایش دسته‌بندی:", error);
        }
    };

    // حذف دسته‌بندی
    const handleDeleteCategory = async (id: string) => {
        if (confirm("آیا مطمئن هستید؟ این عملیات غیرقابل برگشت است.")) {
            try {
                await axios.delete(`/api/posts/category/${id}`);
                fetchCategories(); // بروزرسانی لیست دسته‌بندی‌ها
            } catch (error) {
                console.error("خطا در حذف دسته‌بندی:", error);
            }
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">مدیریت دسته‌بندی‌ها</h1>



            {/* فرم افزودن دسته‌بندی جدید */}
            <form onSubmit={handleAddCategory} className="mb-6">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="دسته‌بندی جدید"
                    className="border p-2 rounded-md w-64 mr-4"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">افزودن</button>
            </form>

            {/* لیست دسته‌بندی‌ها */}
            <table className="min-w-full bg-white shadow-md rounded-md">
                <thead>
                    <tr>
                        <th className="py-3 px-6 border-b text-left">نام دسته‌بندی</th>
                        <th className="py-3 px-6 border-b text-center">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan={2} className="text-center py-4 text-gray-500">هیچ دسته‌بندی‌ای وجود ندارد</td>
                        </tr>
                    ) : (
                        categories.map((category) => (
                            <tr key={category.id}>
                                <td className="py-3 px-6 border-b">{category.name}</td>
                                <td className="py-3 px-6 border-b text-center">
                                    <button
                                        onClick={() => setEditCategory({ id: category.id, name: category.name })}
                                        className="text-yellow-500 hover:text-yellow-700 mr-2"
                                    >
                                        ویرایش
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* فرم ویرایش دسته‌بندی */}
            {editCategory && (
                <div className="mt-6 p-4 bg-gray-100 rounded-md">
                    <h2 className="text-xl font-semibold mb-4">ویرایش دسته‌بندی</h2>
                    <input
                        type="text"
                        value={editCategory.name}
                        onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                        className="border p-2 rounded-md w-64"
                    />
                    <button
                        onClick={handleEditCategory}
                        className="bg-green-500 text-white p-2 rounded-md ml-4"
                    >
                        ذخیره تغییرات
                    </button>
                    <button
                        onClick={() => setEditCategory(null)}
                        className="bg-gray-500 text-white p-2 rounded-md ml-4"
                    >
                        انصراف
                    </button>
                </div>
            )}
        </div>
    );
}
