import {
        GraduationCap,
        Star,
        MessageCircle,
        Bell,
        Search,
        Plus,
        Edit,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
        const { user, isLoading } = useAuth();

        if (isLoading || !user) {
                return <div className="p-6">Загрузка...</div>;
        }

        const displayName =
                user.first_name?.trim() ||
                user.username?.trim() ||
                user.email?.split("@")[0] ||
                "Пользователь";

        return (
                <div className="p-6 md:p-10 space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors">
                        {/* Приветствие */}
                        <div>
                                <h1 className="text-3xl font-bold">Добро пожаловать, {displayName}!</h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                        Ваша активность, напоминания и рекомендации.
                                </p>
                        </div>

                        {/* Статистика */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                <StatCard icon={<GraduationCap />} label="Всего сессий" value="12" />
                                <StatCard icon={<Star />} label="Рейтинг" value="★ 4.8" />
                                <StatCard icon={<MessageCircle />} label="Чатов активно" value="3" />
                                <StatCard icon={<Bell />} label="Уведомлений" value="5" />
                        </div>

                        {/* Быстрые действия и события */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-2">
                                        <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
                                        <ActionItem icon={<Search />} text="Найти партнёра" to="/search" />
                                        <ActionItem icon={<Plus />} text="Создать сессию" to="/calendar" />
                                        <ActionItem icon={<Edit />} text="Обновить профиль" to="/profile" />
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col justify-between">
                                        <div>
                                                <h2 className="text-xl font-semibold mb-4">Предстоящие события</h2>
                                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                        Пока нет запланированных встреч.
                                                </p>
                                        </div>
                                        <Link
                                                to="/calendar"
                                                className="self-start text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                                Перейти в календарь
                                        </Link>
                                </div>
                        </div>

                        {/* Последняя активность */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-600 dark:text-gray-400 shadow">
                                <GraduationCap className="mx-auto mb-2 text-3xl" />
                                <p>Нет недавней активности</p>
                        </div>
                </div>
        );
}

// Компоненты
function StatCard({ icon, label, value }) {
        return (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center space-x-4 shadow">
                        <div className="text-3xl text-blue-600 dark:text-blue-400">{icon}</div>
                        <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
                                <div className="text-xl font-semibold">{value}</div>
                        </div>
                </div>
        );
}

function ActionItem({ icon, text, to }) {
        return (
                <Link
                        to={to}
                        className="flex items-center space-x-3 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                >
                        <div className="text-2xl">{icon}</div>
                        <span className="text-base font-medium">{text}</span>
                </Link>
        );
}
