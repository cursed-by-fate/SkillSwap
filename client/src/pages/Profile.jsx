import { useState } from "react";
import useTheme from "@/hooks/useTheme";

export default function Profile() {
        const { theme } = useTheme(); // подключаем тему
        const [user, setUser] = useState({
                avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SkillSwap",
                username: "skillswapper",
                email: "user@example.com",
                teachSkills: ["Python", "Docker", "Git"],
                learnSkills: ["Vue", "English"],
                reviews: [
                        { id: 1, author: "mentor123", text: "Отличный учитель!" },
                        { id: 2, author: "learner456", text: "Объясняет понятно и чётко" },
                ],
        });

        const [isEditing, setIsEditing] = useState(false);
        const [form, setForm] = useState({
                username: user.username,
                email: user.email,
                teach: user.teachSkills.join(", "),
                learn: user.learnSkills.join(", "),
        });

        const handleSave = () => {
                setUser({
                        ...user,
                        username: form.username,
                        email: form.email,
                        teachSkills: form.teach.split(",").map((s) => s.trim()),
                        learnSkills: form.learn.split(",").map((s) => s.trim()),
                });
                setIsEditing(false);
        };

        return (
                <div className="min-h-screen transition-colors bg-white text-black dark:bg-gray-900 dark:text-white">
                        <div className="max-w-3xl mx-auto pt-10 p-4 space-y-6">
                                {/* Модалка */}
                                {isEditing && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-full max-w-md">
                                                        <h2 className="text-xl font-semibold mb-4">Редактировать профиль</h2>

                                                        <input
                                                                className="w-full p-2 mb-3 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                                                                placeholder="Никнейм"
                                                                value={form.username}
                                                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                                        />
                                                        <input
                                                                className="w-full p-2 mb-3 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                                                                placeholder="Email"
                                                                value={form.email}
                                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                        />
                                                        <input
                                                                className="w-full p-2 mb-3 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                                                                placeholder="Навыки (обучаю)"
                                                                value={form.teach}
                                                                onChange={(e) => setForm({ ...form, teach: e.target.value })}
                                                        />
                                                        <input
                                                                className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                                                                placeholder="Навыки (изучаю)"
                                                                value={form.learn}
                                                                onChange={(e) => setForm({ ...form, learn: e.target.value })}
                                                        />

                                                        <div className="flex justify-end gap-2">
                                                                <button
                                                                        onClick={() => setIsEditing(false)}
                                                                        className="px-4 py-2 border rounded dark:border-gray-500"
                                                                >
                                                                        Отмена
                                                                </button>
                                                                <button
                                                                        onClick={handleSave}
                                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                                >
                                                                        Сохранить
                                                                </button>
                                                        </div>
                                                </div>
                                        </div>
                                )}

                                {/* Профиль */}
                                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col sm:flex-row items-center gap-6">
                                        <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full border" />
                                        <div>
                                                <h2 className="text-2xl font-bold">{user.username}</h2>
                                                <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
                                                <button
                                                        onClick={() => setIsEditing(true)}
                                                        className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                        Редактировать профиль
                                                </button>
                                        </div>
                                </div>

                                {/* Навыки */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Могу обучать:</h3>
                                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-200">
                                                        {user.teachSkills.map((skill) => (
                                                                <li key={skill}>{skill}</li>
                                                        ))}
                                                </ul>
                                        </div>
                                        <div>
                                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Хочу изучить:</h3>
                                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-200">
                                                        {user.learnSkills.map((skill) => (
                                                                <li key={skill}>{skill}</li>
                                                        ))}
                                                </ul>
                                        </div>
                                </div>

                                {/* Отзывы */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Отзывы:</h3>
                                        {user.reviews.length === 0 ? (
                                                <p className="text-gray-500">Пока нет отзывов</p>
                                        ) : (
                                                user.reviews.map((r) => (
                                                        <div key={r.id} className="mb-2 border-b border-gray-200 dark:border-gray-600 pb-2">
                                                                <p className="text-gray-800 dark:text-gray-100">{r.text}</p>
                                                                <p className="text-sm text-gray-500">— {r.author}</p>
                                                        </div>
                                                ))
                                        )}
                                </div>
                        </div>
                </div>
        );
}
