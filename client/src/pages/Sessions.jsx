import { useState } from "react";
import { useSessions } from "@/hooks/useSessions";
import { Link, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";
import LeaveReviewModal from "@/components/LeaveReviewModal";
import { getOrCreateChat } from "@/api/chat"; // 👈 добавлен импорт

const STATUS_LABELS = {
        proposed: "Предложена",
        waiting: "Ожидание",
        confirmed: "Подтверждена",
        cancelled: "Отменена",
        completed: "Завершена",
};

const STATUS_COLORS = {
        proposed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        waiting: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200",
        confirmed: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
        cancelled: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
        completed: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
};

const STATUS_OPTIONS = {
        proposed: ["waiting", "cancelled"],
        waiting: ["confirmed", "cancelled"],
        confirmed: ["completed", "cancelled"],
};

export default function SessionsPage() {
        const { data: sessions = [], isLoading, updateSessionStatus } = useSessions();
        const { user } = useAuth();
        const navigate = useNavigate(); // 👈 для перехода по chatId

        const [selectedSession, setSelectedSession] = useState(null);
        const [isModalOpen, setModalOpen] = useState(false);
        const [statusFilter, setStatusFilter] = useState("all");

        const hasLeftReview = (session) => {
                return session.reviews?.some((r) => r.reviewer.id === user.id);
        };

        const filteredSessions =
                statusFilter === "all"
                        ? sessions
                        : sessions.filter((s) => s.status === statusFilter);

        const handleGoToChat = async (partnerId) => {
                try {
                        const chat = await getOrCreateChat(partnerId);
                        navigate(`/chat/${chat.id}`);
                } catch (error) {
                        console.error("Ошибка при переходе в чат:", error);
                }
        };

        return (
                <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6 md:p-10">
                        <div className="max-w-5xl mx-auto space-y-6">
                                <h1 className="text-3xl font-bold">Мои сессии</h1>

                                {/* Фильтр по статусу */}
                                <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Фильтр по статусу:</label>
                                        <select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                className="text-sm px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                                        >
                                                <option value="all">Все</option>
                                                <option value="proposed">Предложена</option>
                                                <option value="waiting">Ожидание</option>
                                                <option value="confirmed">Подтверждена</option>
                                                <option value="cancelled">Отменена</option>
                                                <option value="completed">Завершена</option>
                                        </select>
                                </div>

                                {isLoading ? (
                                        <p>Загрузка...</p>
                                ) : filteredSessions.length === 0 ? (
                                        <p className="text-gray-500 dark:text-gray-400">Нет сессий по выбранному фильтру</p>
                                ) : (
                                        <ul className="space-y-4">
                                                {filteredSessions.map((session) => {
                                                        const date = session.scheduled_at
                                                                ? format(new Date(session.scheduled_at), "dd.MM.yyyy HH:mm")
                                                                : "Без даты";

                                                        const isMentor = session.mentor.id === user.id;
                                                        const partner = isMentor ? session.student : session.mentor;

                                                        const canChangeStatus =
                                                                (isMentor || session.student.id === user.id) &&
                                                                STATUS_OPTIONS[session.status];

                                                        const canLeaveReview =
                                                                session.status === "completed" && !hasLeftReview(session);

                                                        return (
                                                                <li
                                                                        key={session.id}
                                                                        className={clsx(
                                                                                "p-4 rounded-xl shadow flex justify-between items-start",
                                                                                "bg-white dark:bg-gray-800"
                                                                        )}
                                                                >
                                                                        <div className="space-y-2">
                                                                                <p className="font-semibold text-lg">{session.title}</p>
                                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                                        Навык: {session.skill.name}
                                                                                </p>
                                                                                <p className="text-sm flex items-center gap-1">
                                                                                        <Calendar size={14} />
                                                                                        {date}
                                                                                </p>
                                                                                <p className="text-sm flex items-center gap-2">
                                                                                        Статус:
                                                                                        <span
                                                                                                className={clsx(
                                                                                                        "px-2 py-0.5 rounded-full font-semibold text-xs",
                                                                                                        STATUS_COLORS[session.status]
                                                                                                )}
                                                                                        >
                                                                                                {STATUS_LABELS[session.status] || session.status}
                                                                                        </span>
                                                                                </p>
                                                                                <p className="text-sm">
                                                                                        {isMentor ? "Ученик" : "Ментор"}:{" "}
                                                                                        <span className="font-medium">
                                                                                                {partner.first_name} {partner.last_name}
                                                                                        </span>
                                                                                </p>

                                                                                {/* Изменение статуса */}
                                                                                {canChangeStatus && (
                                                                                        <div>
                                                                                                <select
                                                                                                        value=""
                                                                                                        onChange={(e) => {
                                                                                                                const newStatus = e.target.value;
                                                                                                                if (newStatus) {
                                                                                                                        updateSessionStatus({
                                                                                                                                id: session.id,
                                                                                                                                status: newStatus,
                                                                                                                        });
                                                                                                                }
                                                                                                        }}
                                                                                                        className="text-sm px-3 py-1 rounded border dark:bg-gray-700 dark:border-gray-600 mt-2"
                                                                                                >
                                                                                                        <option value="" disabled>
                                                                                                                Изменить статус
                                                                                                        </option>
                                                                                                        {STATUS_OPTIONS[session.status].map((option) => (
                                                                                                                <option key={option} value={option}>
                                                                                                                        {STATUS_LABELS[option]}
                                                                                                                </option>
                                                                                                        ))}
                                                                                                </select>
                                                                                        </div>
                                                                                )}

                                                                                {/* Оставить отзыв */}
                                                                                {canLeaveReview && (
                                                                                        <button
                                                                                                onClick={() => {
                                                                                                        setSelectedSession(session);
                                                                                                        setModalOpen(true);
                                                                                                }}
                                                                                                className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-1 rounded transition"
                                                                                        >
                                                                                                Оставить отзыв
                                                                                        </button>
                                                                                )}
                                                                        </div>

                                                                        <div className="flex flex-col gap-2 items-end">
                                                                                <button
                                                                                        onClick={() => handleGoToChat(partner.id)}
                                                                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded transition"
                                                                                >
                                                                                        Перейти в чат
                                                                                </button>
                                                                        </div>
                                                                </li>
                                                        );
                                                })}
                                        </ul>
                                )}
                        </div>

                        {/* Модалка отзыва */}
                        <LeaveReviewModal
                                isOpen={isModalOpen}
                                onClose={() => setModalOpen(false)}
                                session={selectedSession}
                        />
                </div>
        );
}
