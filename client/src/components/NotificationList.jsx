// components/NotificationList.jsx
import { Link } from "react-router-dom";

export default function NotificationList({ notifications }) {
        if (!notifications.length) {
                return <p className="text-gray-500 dark:text-gray-400">Нет уведомлений</p>;
        }

        return (
                <div className="space-y-4">
                        {notifications.map((n) => (
                                <div
                                        key={n.id}
                                        className="border dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 shadow flex justify-between items-center"
                                >
                                        <div>{n.message}</div>

                                        {n.type === "incoming_call" && n.metadata?.chat_id && (
                                                <Link
                                                        to={`/video-call/${n.metadata.chat_id}`}
                                                        className="ml-4 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                        Присоединиться
                                                </Link>
                                        )}
                                </div>
                        ))}
                </div>
        );
}
