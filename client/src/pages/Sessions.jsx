import { useSessions } from "@/hooks/useSessions";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function SessionsPage() {
        const { data: sessions = [], isLoading, updateSessionStatus } = useSessions();
        const { user } = useAuth();

        return (
                <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6 md:p-10">
                        <div className="max-w-5xl mx-auto space-y-6">
                                <h1 className="text-3xl font-bold">Мои сессии</h1>

                                {isLoading ? (
                                        <p>Загрузка...</p>
                                ) : sessions.length === 0 ? (
                                        <p className="text-gray-500 dark:text-gray-400">У вас пока нет сессий</p>
                                ) : (
                                        <ul className="space-y-4">
                                                {sessions.map((session) => {
                                                        const date = session.scheduled_at
                                                                ? format(new Date(session.scheduled_at), "dd.MM.yyyy HH:mm")
                                                                : "Без даты";

                                                        const isMentor = session.mentor.id === user.id;
                                                        const partner = isMentor ? session.student : session.mentor;

                                                        const showActions = session.status === "proposed" && !isMentor;

                                                        return (
                                                                <li
                                                                        key={session.id}
                                                                        className="p-4 rounded-xl shadow bg-white dark:bg-gray-800"
                                                                >
                                                                        <div className="flex justify-between items-start">
                                                                                <div className="space-y-2">
                                                                                        <p className="font-semibold text-lg">{session.title}</p>
                                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                                                Навык: {session.skill.name}
                                                                                        </p>
                                                                                        <p className="text-sm flex items-center gap-1">
                                                                                                <Calendar size={14} />
                                                                                                {date}
                                                                                        </p>
                                                                                        <p className="text-sm">
                                                                                                Статус:{" "}
                                                                                                <span className="font-medium">{session.status}</span>
                                                                                        </p>
                                                                                        <p className="text-sm">
                                                                                                {isMentor ? "Ученик" : "Ментор"}:{" "}
                                                                                                <span className="font-medium">
                                                                                                        {partner.first_name} {partner.last_name}
                                                                                                </span>
                                                                                        </p>

                                                                                        {/* Действия (если пользователь — студент и статус предложен) */}
                                                                                        {showActions && (
                                                                                                <div className="flex gap-2 pt-2">
                                                                                                        <button
                                                                                                                onClick={() =>
                                                                                                                        updateSessionStatus({
                                                                                                                                id: session.id,
                                                                                                                                status: "confirmed",
                                                                                                                        })
                                                                                                                }
                                                                                                                className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                                                                                                        >
                                                                                                                Подтвердить
                                                                                                        </button>
                                                                                                        <button
                                                                                                                onClick={() =>
                                                                                                                        updateSessionStatus({
                                                                                                                                id: session.id,
                                                                                                                                status: "cancelled",
                                                                                                                        })
                                                                                                                }
                                                                                                                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                                                                                                        >
                                                                                                                Отменить
                                                                                                        </button>
                                                                                                </div>
                                                                                        )}
                                                                                </div>

                                                                                <div className="flex flex-col gap-2 items-end">
                                                                                        <Link
                                                                                                to="/chat"
                                                                                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                                                                                        >
                                                                                                Перейти в чат
                                                                                        </Link>
                                                                                </div>
                                                                        </div>
                                                                </li>
                                                        );
                                                })}
                                        </ul>
                                )}
                        </div>
                </div>
        );
}
