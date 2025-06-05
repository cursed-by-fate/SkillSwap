import api from "@/lib/axios";

// ✅ Регистрация
export async function register({ email, username, password, re_password }) {
        const response = await api.post("/auth/users/", {
                email,
                password,
                re_password,
                first_name: username,
        });

        const tokens = response.data.tokens;
        if (tokens?.access) {
                localStorage.setItem("accessToken", tokens.access);
                localStorage.setItem("refreshToken", tokens.refresh);
        }

        return response.data;
}

// ✅ Получение текущего пользователя (из кастомного ViewSet!)
export async function fetchCurrentUser() {
        const response = await api.get("/users/me/", {
                headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
        });
        return response.data;
}

// ✅ Логин
export async function login({ email, password }) {
        const response = await api.post("/auth/jwt/create/", { email, password });
        const { access, refresh } = response.data;

        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        return fetchCurrentUser();
}

// ✅ Логаут
export async function logout() {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
                await api.post("/auth/logout/", { refresh: refreshToken });
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
}

// ✅ Обновление профиля с навыками
export async function updateProfile(data) {
        const res = await fetch("/api/users/me/", {
                method: "PATCH",
                headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Ошибка при обновлении профиля");
        return res.json();
}
