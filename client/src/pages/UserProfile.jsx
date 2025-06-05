import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserProfile() {
        const { id } = useParams();
        const [user, setUser] = useState(null);
        const [status, setStatus] = useState("loading"); // loading | success | error

        useEffect(() => {
                // 🔧 Эмуляция получения пользователя по ID
                const mockUsers = [
                        {
                                id: "1",
                                username: "mentor123",
                                email: "mentor@example.com",
                                avatar: "",
                                teachSkills: ["Python", "Git"],
                                learnSkills: ["React", "English"],
                                reviews: [
                                        { id: 1, text: "Очень крутой преподаватель!", author: "userX" },
                                        { id: 2, text: "Понравилось учиться", author: "userY" },
                                ],
                        },
                        {
                                id: "2",
                                username: "learner456",
                                email: "learner@example.com",
                                avatar: "",
                                teachSkills: ["JavaScript", "CSS"],
                                learnSkills: ["Docker", "PostgreSQL"],
                                reviews: [],
                        },
                ];

                setTimeout(() => {
                        const found = mockUsers.find((u) => u.id === id);
                        if (found) {
                                setUser(found);
                                setStatus("success");
                        } else {
                                setStatus("error");
                        }
                }, 800);
        }, [id]);

        if (status === "loading") return <div className="p-4">Загрузка...</div>;
        if (status === "error" || !user) return <div className="p-4 text-red-500">Пользователь не найден</div>;

        return (
                <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
                        <div className="max-w-3xl mx-auto p-6 pt-12 space-y-6">
                                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col sm:flex-row items-center gap-6">
                                        <img
                                                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                                                alt="avatar"
                                                className="w-24 h-24 rounded-full border"
                                        />
                                        <div>
                                                <h2 className="text-2xl font-bold">{user.username}</h2>
                                                <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
                                        </div>
                                </div>

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
