import api from "@/lib/axios";

// 🔍 Получить всех пользователей
export const fetchUsers = async () => {
        const res = await api.get("/core/users/");
        return res.data;
};

// 👤 Получить одного пользователя по ID
export const getUserById = async (id) => {
        const res = await api.get(`/core/users/${id}/`);
        return res.data;
};

// ✏️ Обновить текущего пользователя
export const updateUserProfile = async (data) => {
        const res = await api.patch("/auth/users/me/", data);
        return res.data;
};

// 🛑 Удалить пользователя (только для админов или тестов)
export const deleteUser = async (id) => {
        const res = await api.delete(`/core/users/${id}/`);
        return res.data;
};
