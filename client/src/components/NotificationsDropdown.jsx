import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export default function NotificationsDropdown({ notifications, onClose }) {
        return (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
                        <div className="p-2 max-h-64 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                                {notifications.length === 0 ? (
                                        <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                                Нет новых уведомлений
                                        </div>
                                ) : (
                                        notifications.map((notif) => (
                                                <div key={notif.id} className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                                        <p>{notif.message}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ru })}
                                                        </p>
                                                </div>
                                        ))
                                )}
                        </div>
                        <div className="border-t border-gray-300 dark:border-gray-700 text-center p-2">
                                <Link
                                        to="/notifications"
                                        onClick={onClose}
                                        className="text-blue-500 hover:underline text-sm"
                                >
                                        Посмотреть все
                                </Link>
                        </div>
                </div>
        );
}
