import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { GraduationCap, MessageCircle, Clock } from "lucide-react";

export default function SessionsPage() {
        const { data: sessions = [] } = useQuery({
                queryKey: ["sessions"],
                queryFn: async () => {
                        const res = await api.get("/sessions/");
                        return res.data;
                },
        });

        const grouped = {
                teach: sessions.filter((s) => s.teacher?.id === s.current_user_id),
                learn: sessions.filter((s) => s.student?.id === s.current_user_id),
        };

        const renderSessionCard = (session) => (
                <div key={session.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow">
                        <h3 className="font-semibold">{session.topic || "Навык"}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                {session.start_time?.slice(0, 16).replace("T", " ")} — {session.status}
                        </p>
                        <p className="mt-1 text-sm">
                                С {session.teacher?.username === session.current_user_username
                                        ? `учеником ${session.student?.username}`
                                        : `учителем ${session.teacher?.username}`}
                        </p>
                </div>
        );

        return (
                <div className="min-h-screen p-6 md:p-10 bg-white dark:bg-gray-900 text-black dark:text-white">
                        <div className="max-w-5xl mx-auto space-y-6">
                                <h1 className="text-3xl font-bold">Мои сессии</h1>

                                <section>
                                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                                <GraduationCap /> Я обучаю
                                        </h2>
                                        {grouped.teach.length ? (
                                                <div className="grid md:grid-cols-2 gap-4">
                                                        {grouped.teach.map(renderSessionCard)}
                                                </div>
                                        ) : (
                                                <p className="text-gray-500 dark:text-gray-400">Нет активных сессий</p>
                                        )}
                                </section>

                                <section>
                                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                                <Clock /> Я обучаюсь
                                        </h2>
                                        {grouped.learn.length ? (
                                                <div className="grid md:grid-cols-2 gap-4">
                                                        {grouped.learn.map(renderSessionCard)}
                                                </div>
                                        ) : (
                                                <p className="text-gray-500 dark:text-gray-400">Нет активных сессий</p>
                                        )}
                                </section>
                        </div>
                </div>
        );
}
