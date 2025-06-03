import {
        GraduationCap,
        Star,
        MessageCircle,
        Bell,
        Search,
        Plus,
        Edit,
} from "lucide-react";

export default function Home() {
        return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 md:p-12 transition-colors">
                        <div className="max-w-4xl mx-auto space-y-8">
                                <h1 className="text-4xl font-bold text-center">Добро пожаловать в SkillSwap</h1>
                                <p className="text-lg text-center text-gray-600 dark:text-gray-400">
                                        SkillSwap — это платформа, где люди обмениваются навыками напрямую: без учителей, курсов или оплаты.
                                </p>

                                {/* О платформе */}
                                <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
                                        <h2 className="text-2xl font-semibold mb-2">Как это работает?</h2>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                                <li>Создайте профиль и укажите, чем вы хотите делиться и чему хотите научиться</li>
                                                <li>Ищите партнёров по интересующим навыкам</li>
                                                <li>Назначайте встречи через встроенный календарь</li>
                                                <li>Общайтесь в чате, делитесь материалами и создавайте сессии</li>
                                        </ul>
                                </section>

                                {/* Возможности */}
                                <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
                                        <h2 className="text-2xl font-semibold mb-2">Возможности платформы</h2>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                                <li>Поиск по навыкам, интересам и географии</li>
                                                <li>Встроенный чат и система уведомлений</li>
                                                <li>Календарь с напоминаниями</li>
                                                <li>Оценки и отзывы от пользователей</li>
                                                <li>Встроенные видеозвонки (WebRTC)</li>
                                        </ul>
                                </section>

                                {/* Призыв к действию */}
                                <div className="text-center mt-10">
                                        <p className="text-lg mb-4">Готовы начать?</p>
                                        <a
                                                href="/register"
                                                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                                Зарегистрироваться
                                        </a>
                                </div>
                        </div>
                </div>
        );
}

// Компоненты
function StatCard({ icon, label, value }) {
        return (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-center space-x-4 transition-colors">
                        <div className="text-2xl">{icon}</div>
                        <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
                                <div className="text-lg font-semibold">{value}</div>
                        </div>
                </div>
        );
}

function ActionItem({ icon, text }) {
        return (
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer py-1 transition-colors">
                        <div className="text-xl">{icon}</div>
                        <span>{text}</span>
                </div>
        );
}
