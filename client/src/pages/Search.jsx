import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { getOrCreateChat } from "@/api/chat";

export default function Search() {
        const { data: users = [], isLoading, isError } = useUsers();
        const { user: currentUser } = useAuth();
        const navigate = useNavigate();
        const [query, setQuery] = useState("");

        const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

        const matchesToken = (text = "") =>
                tokens.some((token) => text.toLowerCase().includes(token));

        const filtered = users.filter((u) => {
                if (!tokens.length) return true;

                const fullName = `${u.first_name || ""} ${u.last_name || ""}`;
                const email = u.email || "";
                const teach = u.teachSkills?.map((s) => s.skill?.name || "") || [];
                const learn = u.learnSkills?.map((s) => s.skill?.name || "") || [];

                return (
                        matchesToken(fullName) ||
                        matchesToken(email) ||
                        teach.some(matchesToken) ||
                        learn.some(matchesToken)
                );
        });

        const handleStartChat = async (partnerId) => {
                try {
                        const chat = await getOrCreateChat(partnerId);
                        navigate(`/chat/${chat.id}`);
                } catch (err) {
                        console.error("Ошибка при открытии чата", err);
                }
        };

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
                                {!isLoading && !filtered.length && (
                                        <p className="text-gray-500">Пользователи не найдены</p>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filtered.map((u) => (
                                                <div
                                                        key={u.id}
                                                        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
                                                >
                                                        <div className="flex items-center gap-4 mb-4">
                                                                <img
                                                                        src={
                                                                                u.profile_image_url ||
                                                                                `https://api.dicebear.com/7.x/initials/svg?seed=${u.first_name || u.email}`
                                                                        }
                                                                        alt="avatar"
                                                                        className="w-16 h-16 rounded-full border"
                                                                />
                                                                <div>
                                                                        <h2 className="text-lg font-semibold">
                                                                                {u.first_name} {u.last_name}
                                                                        </h2>
                                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                                {u.email}
                                                                        </p>
                                                                </div>
                                                        </div>

                                                        <div className="mb-3">
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Обучает:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                        {u.teachSkills?.length > 0 ? (
                                                                                u.teachSkills.map((s) => (
                                                                                        <span key={s.id} className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">
                                                                                                {s.skill?.name}
                                                                                        </span>
                                                                                ))
                                                                        ) : (
                                                                                <span className="text-xs text-gray-400">не указано</span>
                                                                        )}
                                                                </div>
                                                        </div>

                                                        <div className="mb-4">
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Хочет изучить:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                        {u.learnSkills?.length > 0 ? (
                                                                                u.learnSkills.map((s) => (
                                                                                        <span key={s.id} className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs">
                                                                                                {s.skill?.name}
                                                                                        </span>
                                                                                ))
                                                                        ) : (
                                                                                <span className="text-xs text-gray-400">не указано</span>
                                                                        )}
                                                                </div>
                                                        </div>

                                                        <div className="flex flex-col gap-2 mt-auto">
                                                                <Link
                                                                        to={`/profile/${u.id}`}
                                                                        className="w-full text-center bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white py-2 rounded"
                                                                >
                                                                        Профиль
                                                                </Link>
                                                                {u.id !== currentUser?.id && (
                                                                        <button
                                                                                onClick={() => handleStartChat(u.id)}
                                                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                                                                        >
                                                                                Написать
                                                                        </button>
                                                                )}
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        </div>
                </div>
        );
}
