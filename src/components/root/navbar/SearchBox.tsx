"use client"
import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";

const categories = ["Technology", "Coding", "Design", "Crypto"];

export default function SearchBox() {
    const { register, handleSubmit } = useForm<FieldValues>();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All categories");

    const onSubmit = (data: FieldValues) => {
        console.log("Search Data:", { ...data, category: selectedCategory });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto">
            <div className="flex relative">
                <div className="relative">
                    <Button
                        type="button"
                        className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600  rounded-r-none"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {selectedCategory} <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44 dark:bg-gray-700 mt-2"
                            >
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    {categories.map((category) => (
                                        <li key={category}>
                                            <button
                                                type="button"
                                                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                {category}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="flex w-full items-center">
                    <Input
                        type="search"
                        {...register("search", { required: true })}
                        className="block w-full z-20 text-sm text-gray-900 bg-gray-50 border-s-gray-50  border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-cyan-500 border-x-0 rounded-none"
                        placeholder="Search Keywords..."
                    />
                    <Button
                        type="submit"
                        className=" text-sm font-medium h-full text-white bg-cyan-700 rounded-e-lg border border-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800 rounded-l-none"
                    >
                        <Search className="w-4 h-4" />
                        <span className="sr-only">Search</span>
                    </Button>
                </div>
            </div>
        </form>
    );
}
