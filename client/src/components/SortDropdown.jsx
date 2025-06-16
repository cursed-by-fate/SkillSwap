import { useState } from "react";

const options = [
        { value: "reviews", label: "По количеству отзывов" },
        { value: "name", label: "По имени (А-Я)" },
        { value: "city", label: "По городу" },
];

export default function SortDropdown({ sortBy, setSortBy }) {
        const [open, setOpen] = useState(false);

        return (
                <div className="relative inline-block text-left mb-6">
                        <button
                                onClick={() => setOpen(!open)}
                                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                                Сортировка: {options.find((o) => o.value === sortBy)?.label || "Не выбрано"}
                        </button>

                        {open && (
                                <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                        <div className="py-1">
                                                {options.map((opt) => (
                                                        <button
                                                                key={opt.value}
                                                                onClick={() => {
                                                                        setSortBy(opt.value);
                                                                        setOpen(false);
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        >
                                                                {opt.label}
                                                        </button>
                                                ))}
                                        </div>
                                </div>
                        )}
                </div>
        );
}
