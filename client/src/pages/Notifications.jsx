import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/lib/axios";
import { Bell, CheckCircle } from "lucide-react";

export default function NotificationsPage() {
        const queryClient = useQueryClient();

        const { data: notifications = [] } = useQuery({
                queryKey: ["notifications"],
                queryFn: async () => {
                        const res = await api.get("/notifications/");
                        return res.data;
                },
        });

        const markAsRead = useMutation({
                mutationFn: async (id) => {
                        await api.patch(`/notifications/${id}/`, { is_read: true });
                },
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["notifications"] });
                },
        });

        return (
                <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6 md:p-10">
                        <div className="max-w-4xl mx-auto space-y-6">
                                <h1 className="text-3xl font-bold">Уведомления</h1>

                                {notifications.length === 0 ? (
                                        <p className="text-gray-500 dark:text-gray-400">Нет новых уведомлений</p>
                                ) : (
                                        <ul className="space-y-4">
                                                {notifications.map((n) => (
                                                        <li
                                                                key={n.id}
                                                                className={`p-4 rounded-xl shadow transition ${n.is_read
                                                                                ? "bg-gray-100 dark:bg-gray-800 text-gray-500"
                                                                                : "bg-blue-100 dark:bg-blue-900"
                                                                        }`}
                                                        >
                                                                <div className="flex justify-between items-center">
                                                                        <div className="flex items-center gap-2">
                                                                                <Bell />
                                                                                <div>
                                                                                        <p className="font-medium">{n.text || n.title || "Уведомление"}</p>
                                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{n.created_at?.slice(0, 10)}</p>
                                                                                </div>
                                                                        </div>
                                                                        {!n.is_read && (
                                                                                <button
                                                                                        onClick={() => markAsRead.mutate(n.id)}
                                                                                        className="text-sm text-blue-600 hover:underline"
                                                                                >
                                                                                        Отметить как прочитано
                                                                                </button>
                                                                        )}
                                                                </div>
                                                        </li>
                                                ))}
                                        </ul>
                                )}
                        </div>
                </div>
        );
}
