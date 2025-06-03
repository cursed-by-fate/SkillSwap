import { useState } from "react";
import useTheme from "@/hooks/useTheme";

export default function Search() {
        const { theme } = useTheme();
        const [query, setQuery] = useState("");

        const [users] = useState([
                {
                        id: 1,
                        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Alice",
                        username: "alice_dev",
                        teach: ["JavaScript", "React"],
                        learn: ["Python", "Docker"],
                },
                {
                        id: 2,
                        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bob",
                        username: "bob42",
                        teach: ["Python", "FastAPI"],
                        learn: ["Vue", "Tailwind"],
                },
        ]);

        const filtered = users.filter((u) =>
                u.username.toLowerCase().includes(query.toLowerCase())
        );

        return (
                <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
                        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
                                <h1 className="text-2xl font-bold mb-4">Поиск пользователей</h1>

                                <input
                                        type="text"
                                        placeholder="Поиск по нику, email, навыкам..."
                                        className="w-full p-3 mb-6 rounded bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filtered.map((user) => (
                                                <div
                                                        key={user.id}
                                                        className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition"
                                                >
                                                        <div className="flex items-center gap-4 mb-4">
                                                                <img
                                                                        src={user.avatar}
                                                                        alt={user.username}
                                                                        className="w-14 h-14 rounded-full border"
                                                                />
                                                                <div>
                                                                        <h2 className="text-lg font-semibold">{user.username}</h2>
                                                                </div>
                                                        </div>

                                                        <div className="mb-2">
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Обучает:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                        {user.teach.map((s) => (
                                                                                <span
                                                                                        key={s}
                                                                                        className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs"
                                                                                >
                                                                                        {s}
                                                                                </span>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        <div className="mb-4">
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Хочет изучить:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                        {user.learn.map((s) => (
                                                                                <span
                                                                                        key={s}
                                                                                        className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs"
                                                                                >
                                                                                        {s}
                                                                                </span>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
                                                                Написать
                                                        </button>
                                                </div>
                                        ))}
                                </div>
                        </div>
                </div>
        );
}
