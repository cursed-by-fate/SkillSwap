import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/api/notifications";

export const useNotifications = () => {
        const {
                data: notifications = [],
                isLoading,
                isError,
                refetch,
        } = useQuery({
                queryKey: ["notifications"],
                queryFn: fetchNotifications,
                refetchInterval: 10000,
        });

        const unreadCount = notifications.filter((n) => !n.is_read).length;
        const recentNotifications = notifications.slice(0, 3); // показываем 3

        return { notifications, recentNotifications, unreadCount, isLoading, isError, refetch };
};
