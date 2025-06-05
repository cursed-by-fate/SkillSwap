import { useState } from "react";
import useTheme from "@/hooks/useTheme";
import { useUsers } from "@/hooks/useUsers";
import { Link } from "react-router-dom";

export default function Search() {
        const { theme } = useTheme();
        const { data: users = [], isLoading, isError } = useUsers();
        const [query, setQuery] = useState("");

        const filtered = users.filter((u) => {
                const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
                const email = u.email?.toLowerCase() || "";
                const teachNames = u.teachSkills?.map((s) => s.skill?.name.toLowerCase()) || [];
                const learnNames = u.learnSkills?.map((s) => s.skill?.name.toLowerCase()) || [];

                return (
                        fullName.includes(query.toLowerCase()) ||
                        email.includes(query.toLowerCase()) ||
                        teachNames.some((s) => s.includes(query.toLowerCase())) ||
                        learnNames.some((s) => s.includes(query.toLowerCase()))
                );
        });

        return (
                <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
                        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
                                <h1 className="text-2xl font-bold mb-4">Поиск пользователей</h1>

                                <input
                                        type="text"
                                        placeholder="Поиск по имени, email, навыкам..."
                                        className="w-full p-3 mb-6 rounded bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                />

                                {isLoading && <p>Загрузка пользователей...</p>}
                                {isError && <p className="text-red-500">Ошибка загрузки</p>}
                                {!isLoading && filtered.length === 0 && (
                                        <p className="text-gray-500">Пользователи не найдены</p>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filtered.map((user) => (
                                                <div
                                                        key={user.id}
                                                        className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition"
                                                >
                                                        <div className="flex items-center gap-4 mb-4">
                                                                <img
                                                                        src={
                                                                                user.profile_image_url ||
                                                                                `https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name || user.email}`
                                                                        }
                                                                        alt={user.first_name || "avatar"}
                                                                        className="w-14 h-14 rounded-full border"
                                                                />
                                                                <div>
                                                                        <h2 className="text-lg font-semibold">
                                                                                {user.first_name} {user.last_name}
                                                                        </h2>
                                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                                                </div>
                                                        </div>

                                                        <div className="mb-2">
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Обучает:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                        {user.teachSkills?.map((s) => (
                                                                                <span
                                                                                        key={s.id}
                                                                                        className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs"
                                                                                >
                                                                                        {s.skill?.name}
                                                                                </span>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        <div className="mb-4">
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Хочет изучить:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                        {user.learnSkills?.map((s) => (
                                                                                <span
                                                                                        key={s.id}
                                                                                        className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs"
                                                                                >
                                                                                        {s.skill?.name}
                                                                                </span>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                                <Link
                                                                        to={`/profile/${user.id}`}
                                                                        className="w-full text-center bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white py-2 rounded"
                                                                >
                                                                        Профиль
                                                                </Link>
                                                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
                                                                        Написать
                                                                </button>
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        </div>
                </div>
        );
}
