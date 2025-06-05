import api from "@/lib/axios";

// 📥 Получить все мои сессии
export const fetchMySessions = async () => {
        const res = await api.get("/sessions/");
        return res.data;
};

// 🔄 Обновить статус сессии (например: "completed", "cancelled", "pending")
export const updateSessionStatus = async ({ id, status }) => {
        const res = await api.patch(`/sessions/${id}/`, { status });
        return res.data;
};

// 🆕 Создать новую сессию (используется в модалке)
export const createSession = async (sessionData) => {
        const res = await api.post("/sessions/", sessionData);
        return res.data;
};
