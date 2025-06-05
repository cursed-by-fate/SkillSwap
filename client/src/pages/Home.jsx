import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useSessions } from "@/hooks/useSessions";

import {
        GraduationCap,
        Star,
        MessageCircle,
        Bell,
        Search,
        Calendar,
        Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
        const { user, isLoading } = useAuth();
        const { unreadCount } = useNotifications();
        const { data: sessions = [] } = useSessions();

        if (isLoading) {
                return <div className="p-6">Загрузка...</div>;
        }

        const displayName =
                user?.first_name?.trim() ||
                user?.username?.trim() ||
                user?.email?.split("@")[0] ||
                "Пользователь";

        const completedSessions = sessions.filter((s) => s.status === "completed");
        const completedCount = completedSessions.length;

        const reviews = user?.reviews || [];
        const reviewCount = reviews.length;

        return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 md:p-10 transition-colors">
                        <div className="max-w-6xl mx-auto space-y-10">
                                {/* Приветствие */}
                                <div className="text-center space-y-2">
                                        <h1 className="text-4xl font-bold">
                                                {user
                                                        ? `Добро пожаловать, ${displayName}!`
                                                        : "Добро пожаловать в SkillSwap"}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                                                Платформа обмена знаниями и навыками без посредников.
                                        </p>
                                </div>

                                {/* Быстрые действия */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <ActionItem icon={<Search />} text="Поиск" to="/search" />
                                        <ActionItem icon={<Users />} text="Профиль" to="/profile" />
                                        <ActionItem icon={<MessageCircle />} text="Чат" to="/chat" />
                                        <ActionItem icon={<Calendar />} text="Календарь" to="/calendar" />
                                </div>

                                {/* Статистика */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <StatCard
                                                icon={<Star />}
                                                label="Отзывы"
                                                value={`${reviewCount} отзывов`}
                                        />
                                        <StatCard
                                                icon={<Bell />}
                                                label="Уведомления"
                                                value={
                                                        unreadCount > 0
                                                                ? `${unreadCount} новых`
                                                                : "Нет новых"
                                                }
                                        />
                                        <StatCard
                                                icon={<GraduationCap />}
                                                label="Сессии"
                                                value={`${completedCount} завершено`}
                                        />
                                </div>

                                {/* Описание */}
                                <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
                                        <h2 className="text-2xl font-semibold">Как это работает?</h2>
                                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                                                <li>
                                                        Создайте профиль с навыками, которые вы хотите преподавать и
                                                        изучать
                                                </li>
                                                <li>Найдите партнёров по интересам</li>
                                                <li>Назначайте встречи и общайтесь в чате</li>
                                                <li>Проводите сессии и получайте отзывы</li>
                                        </ul>
                                </section>

                                {/* Призыв к действию */}
                                {!user && (
                                        <div className="text-center">
                                                <p className="text-lg mb-4">Готовы присоединиться?</p>
                                                <Link
                                                        to="/register"
                                                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                >
                                                        Зарегистрироваться
                                                </Link>
                                        </div>
                                )}
                        </div>
                </div>
        );
}

// Компоненты
function StatCard({ icon, label, value }) {
        return (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 flex items-center space-x-4 transition-colors">
                        <div className="text-3xl">{icon}</div>
                        <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
                                <div className="text-lg font-semibold">{value}</div>
                        </div>
                </div>
        );
}

function ActionItem({ icon, text, to }) {
        return (
                <Link
                        to={to}
                        className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition hover:bg-blue-50 dark:hover:bg-gray-700"
                >
                        <div className="flex flex-col items-center text-blue-600 dark:text-blue-400">
                                <div className="text-3xl mb-1">{icon}</div>
                                <span className="text-sm font-medium">{text}</span>
                        </div>
                </Link>
        );
}
