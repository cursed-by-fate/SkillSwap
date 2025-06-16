// ✅ Актуализированная главная страница SkillSwap с анимациями (Framer Motion)
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
        Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
        const { user, isLoading } = useAuth();
        const { unreadCount } = useNotifications();
        const { data: sessions = [] } = useSessions();

        if (isLoading) return <div className="p-6">Загрузка...</div>;

        const displayName =
                user?.first_name?.trim() ||
                user?.username?.trim() ||
                user?.email?.split("@")[0] ||
                "Пользователь";

        const completedCount = sessions.filter((s) => s.status === "completed").length;
        const reviewCount = user?.reviews?.length || 0;

        return (
                <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-6 md:p-10 transition-colors">
                        <div className="max-w-6xl mx-auto space-y-16">

                                {/* Преимущества в карточках */}
                                <FadeInSection>
                                        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                                                <AdvantageCard icon={<GraduationCap />} title="Обучай и обучайся" text="Каждый может быть наставником и учеником одновременно." />
                                                <AdvantageCard icon={<Users />} title="Сообщество" text="Тысячи участников по всему миру." />
                                                <AdvantageCard icon={<Calendar />} title="Гибкость" text="Планируйте сессии, как вам удобно." />
                                                <AdvantageCard icon={<MessageCircle />} title="Общение" text="Мгновенные чаты и уведомления." />
                                        </section>
                                </FadeInSection>

                                {/* Таймлайн */}
                                <FadeInSection>
                                        <section className="space-y-6">
                                                <h2 className="text-2xl font-semibold text-center">Как это работает</h2>
                                                <div className="relative border-l-2 border-blue-500 dark:border-blue-400 pl-6 space-y-8">
                                                        <Step title="Создайте профиль" description="Укажите свои навыки" icon={<Users size={16} />} />
                                                        <Step title="Найдите партнёра" description="Используйте фильтры поиска" icon={<Search size={16} />} />
                                                        <Step title="Общайтесь" description="Обсудите формат и цели" icon={<MessageCircle size={16} />} />
                                                        <Step title="Проводите встречи" description="Онлайн или офлайн" icon={<Calendar size={16} />} />
                                                        <Step title="Оставьте отзыв" description="Помогите другим найти лучших" icon={<Star size={16} />} />
                                                </div>
                                        </section>
                                </FadeInSection>

                                {/* Почему SkillSwap */}
                                <FadeInSection>
                                        <section className="bg-white dark:bg-gray-900/50 rounded-2xl p-8 shadow-md">
                                                <div className="flex items-center space-x-4 mb-4">
                                                        <Sparkles className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                                                        <h2 className="text-2xl font-semibold">Почему выбрать SkillSwap?</h2>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="space-y-4">
                                                                <FeatureItem text="Без оплаты — знания за знания" />
                                                                <FeatureItem text="Прямое общение без посредников" />
                                                                <FeatureItem text="Развитие как ученик и как наставник" />
                                                        </div>
                                                        <div className="space-y-4 text-gray-400 text-sm italic">
                                                                <FeatureItem text="❌ Дорогие онлайн-курсы" />
                                                                <FeatureItem text="❌ Платные репетиторы без отзывов" />
                                                                <FeatureItem text="❌ Жёсткие программы без гибкости" />
                                                        </div>
                                                </div>
                                        </section>
                                </FadeInSection>

                                {/* CTA */}
                                {!user && (
                                        <FadeInSection>
                                                <section className="rounded-2xl p-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white text-center space-y-5 shadow-xl">
                                                        <motion.h2
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 1 }}
                                                                className="text-3xl font-bold"
                                                        >
                                                                Начни делиться знаниями уже сегодня
                                                        </motion.h2>
                                                        <p className="text-lg">Присоединяйся к сообществу взаимного роста</p>
                                                        <div className="flex justify-center gap-4 flex-wrap items-center">
                                                                <motion.div
                                                                        animate={{ scale: [1, 1.05, 1] }}
                                                                        transition={{ repeat: Infinity, duration: 3 }}
                                                                >
                                                                        <Link
                                                                                to="/register"
                                                                                className="inline-flex items-center justify-center px-8 py-3 min-h-[48px] bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition"
                                                                        >
                                                                                Зарегистрироваться
                                                                        </Link>
                                                                </motion.div>
                                                                <Link
                                                                        to="/search"
                                                                        className="inline-flex items-center justify-center px-8 py-3 min-h-[48px] border border-white text-white font-semibold rounded-xl hover:bg-white/10 transition"
                                                                >
                                                                        Посмотреть наставников
                                                                </Link>
                                                        </div>
                                                </section>
                                        </FadeInSection>
                                )}

                        </div>
                </div>
        );
}

// Компоненты
function AdvantageCard({ icon, title, text }) {
        return (
                <motion.div
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 120, damping: 12 }}
                        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow space-y-3"
                >
                        <div className="text-4xl text-blue-600 dark:text-blue-400 mx-auto">{icon}</div>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{text}</p>
                </motion.div>
        );
}

function Step({ title, description, icon }) {
        return (
                <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex items-start space-x-4"
                >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                {icon}
                        </div>
                        <div>
                                <h3 className="text-lg font-semibold">{title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{description}</p>
                        </div>
                </motion.div>
        );
}

function FeatureItem({ text }) {
        return (
                <div className="flex items-center space-x-2">
                        <span className="text-blue-500">✔</span>
                        <span>{text}</span>
                </div>
        );
}

function FadeInSection({ children, delay = 0 }) {
        return (
                <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay }}
                        viewport={{ once: true }}
                >
                        {children}
                </motion.div>
        );
}