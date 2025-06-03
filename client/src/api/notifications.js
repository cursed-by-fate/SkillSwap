import api from "@/lib/axios";

export const fetchNotifications = async () => {
        const res = await api.get("/notifications/");
        return res.data;
};
