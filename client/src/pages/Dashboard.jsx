// ✅ Обновлённая страница Dashboard с улучшенным UI и анимациями
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
import { useSessions } from "@/hooks/useSessions";
import { useNotifications } from "@/hooks/useNotifications";
import { useChats } from "@/hooks/useChat";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard() {
        const { user, isLoading } = useAuth();
        const { data: sessions = [] } = useSessions();
        const { unreadCount } = useNotifications();
        const { chats = [] } = useChats();

        if (isLoading || !user) {
                return <div className="p-6">Загрузка...</div>;
        }

        const displayName =
                user.first_name?.trim() ||
                user.username?.trim() ||
                user.email?.split("@")[0] ||
                "Пользователь";

        const totalSessions = sessions.length;
        const upcomingSessions = sessions
                .filter((s) => s.status === "confirmed" && new Date(s.scheduled_at) > new Date())
                .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
                .slice(0, 3);

        const reviewCount = user.reviews?.length || 0;
        const sessionGoal = 10;
        const progress = Math.min(Math.round((totalSessions / sessionGoal) * 100), 100);

        return (
                <div className="p-6 md:p-10 space-y-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors">

                        {/* Приветствие */}
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                        >
                                <h1 className="text-4xl font-extrabold tracking-tight">
                                        Добро пожаловать, {displayName} 👋
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mt-2">
                                        Здесь вы найдёте ваши встречи, уведомления, быстрые действия и рекомендации.
                                </p>
                        </motion.div>

                        {/* Статистика */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                <StatCard icon={<GraduationCap />} label="Всего сессий" value={totalSessions} />
                                <StatCard icon={<Star />} label="Отзывы" value={`${reviewCount} отзывов`} />
                                <StatCard icon={<MessageCircle />} label="Чатов активно" value={chats.length} />
                                <StatCard icon={<Bell />} label="Уведомлений" value={unreadCount > 0 ? `${unreadCount} новых` : "Нет новых"} />
                        </section>

                        {/* Прогресс-бейдж */}
                        <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 px-6 py-4 rounded-xl shadow flex items-center justify-between"
                        >
                                <p className="font-medium">Прогресс: {totalSessions}/{sessionGoal} сессий</p>
                                <div className="w-full max-w-sm bg-blue-200 dark:bg-blue-800 h-2 rounded overflow-hidden ml-6">
                                        <div className="bg-blue-600 h-full" style={{ width: `${progress}%` }}></div>
                                </div>
                        </motion.div>

                        {/* Быстрые действия и события */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.section
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4"
                                >
                                        <h2 className="text-xl font-semibold mb-2">Быстрые действия</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <ActionCard icon={<Search />} text="Найти партнёра" to="/search" />
                                                <ActionCard icon={<Plus />} text="Создать сессию" to="/calendar" />
                                                <ActionCard icon={<Edit />} text="Обновить профиль" to="/profile" />
                                        </div>
                                </motion.section>

                                <motion.section
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4"
                                >
                                        <h2 className="text-xl font-semibold">Предстоящие события</h2>
                                        {upcomingSessions.length === 0 ? (
                                                <p className="text-gray-600 dark:text-gray-400">
                                                        Пока нет запланированных встреч.
                                                </p>
                                        ) : (
                                                <ul className="space-y-3">
                                                        {upcomingSessions.map((session) => (
                                                                <li key={session.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                                                                        <strong className="text-base">{session.title}</strong>
                                                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                                                                {format(new Date(session.scheduled_at), "dd.MM.yyyy HH:mm")}
                                                                        </div>
                                                                </li>
                                                        ))}
                                                </ul>
                                        )}
                                        <Link
                                                to="/calendar"
                                                className="inline-block text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                        >
                                                Перейти в календарь
                                        </Link>
                                </motion.section>
                        </div>

                        {/* Последняя активность */}
                        <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-600 dark:text-gray-400 shadow space-y-2"
                        >
                                <Star className="mx-auto text-3xl text-blue-400" />
                                <p className="italic">Вы пока не начали активность — всё впереди!</p>
                        </motion.div>
                </div>
        );
}

// Компоненты
function StatCard({ icon, label, value }) {
        return (
                <motion.div
                        whileHover={{ scale: 1.03 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center space-x-4 shadow"
                >
                        <div className="text-3xl text-blue-600 dark:text-blue-400">{icon}</div>
                        <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
                                <div className="text-xl font-semibold">{value}</div>
                        </div>
                </motion.div>
        );
}

function ActionCard({ icon, text, to }) {
        return (
                <Link
                        to={to}
                        className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-gray-700 rounded-xl shadow hover:shadow-md transition hover:bg-blue-100 dark:hover:bg-gray-600 space-y-2 text-center"
                >
                        <div className="text-3xl text-blue-600 dark:text-blue-400">{icon}</div>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">{text}</span>
                </Link>
        );
}
