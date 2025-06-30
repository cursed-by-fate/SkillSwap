import api from "@/lib/axios";

// Сохранение токенов
function saveTokens({ access, refresh }) {
        if (access) localStorage.setItem("access", access);
        if (refresh) localStorage.setItem("refresh", refresh);
}

// Удаление токенов
function clearTokens() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
}

// ✅ Регистрация
export async function register({ email, username, password, re_password }) {
        clearTokens();

        const response = await api.post("/auth/users/", {
                email,
                password,
                re_password,
                first_name: username,
        });

        const tokens = response.data.tokens;
        if (tokens) saveTokens(tokens);

        return fetchCurrentUser();
}

// ✅ Получение текущего пользователя
export async function fetchCurrentUser() {
        const response = await api.get("/users/me/");
        return response.data;
}

// ✅ Логин
export async function login({ email, password }) {
        const response = await api.post("/auth/jwt/create/", { email, password });
        saveTokens(response.data);
        return fetchCurrentUser();
}

// ✅ Логаут
export async function logout() {
        const refreshToken = localStorage.getItem("refresh");

        try {
                if (refreshToken) {
                        await api.post("/auth/jwt/logout/", { refresh: refreshToken });
                }
        } catch (e) {
                console.warn("Ошибка при logout:", e);
        }

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
}

// ✅ Обновление профиля
export async function updateProfile(formData) {
        const response = await api.patch("/users/me/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
}

// ✅ Обновление access токена
export async function refreshAccessToken() {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("Нет refresh токена");

        const response = await api.post("/auth/jwt/refresh/", { refresh });
        const { access } = response.data;
        localStorage.setItem("access", access);
        return access;
}
