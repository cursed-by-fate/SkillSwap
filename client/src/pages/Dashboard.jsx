import {
        GraduationCap,
        Star,
        MessageCircle,
        Bell,
        Search,
        Plus,
        Edit,
} from "lucide-react";

export default function Dashboard() {
        return (
                <div className="p-4 md:p-8 space-y-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors">
                        <h1 className="text-3xl font-bold">Добро пожаловать, Пользователь!</h1>
                        <p className="text-gray-600 dark:text-gray-400">Ваша активность и предстоящие события</p>

                        {/* Статистика */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard icon={<GraduationCap />} label="Всего сессий" value="0" />
                                <StatCard icon={<Star />} label="Рейтинг" value="4.8" />
                                <StatCard icon={<MessageCircle />} label="Активные чаты" value="7" />
                                <StatCard icon={<Bell />} label="Уведомления" value="0" />
                        </div>

                        {/* Быстрые действия и события */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                                        <h2 className="text-lg font-semibold mb-2">Быстрые действия</h2>
                                        <ActionItem icon={<Search />} text="Найти нового партнёра" />
                                        <ActionItem icon={<Plus />} text="Создать новую сессию" />
                                        <ActionItem icon={<Edit />} text="Обновить навыки" />
                                </div>

                                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex flex-col justify-between">
                                        <h2 className="text-lg font-semibold mb-2">Предстоящие события</h2>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">Нет предстоящих событий</p>
                                        <button className="self-start text-blue-600 dark:text-blue-400 hover:underline">
                                                Найти партнёра
                                        </button>
                                </div>
                        </div>

                        {/* Последняя активность */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center text-gray-600 dark:text-gray-400">
                                <GraduationCap className="mx-auto mb-2" />
                                <p>Нет активности</p>
                        </div>
                </div>
        );
}

// Компоненты
function StatCard({ icon, label, value }) {
        return (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-center space-x-4">
                        <div className="text-2xl text-gray-800 dark:text-white">{icon}</div>
                        <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
                                <div className="text-lg font-semibold">{value}</div>
                        </div>
                </div>
        );
}

function ActionItem({ icon, text }) {
        return (
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 cursor-pointer py-1">
                        <div className="text-xl">{icon}</div>
                        <span>{text}</span>
                </div>
        );
}
