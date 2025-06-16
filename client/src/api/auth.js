import api from "@/lib/axios";

// ✅ Регистрация
export async function register({ email, username, password, re_password }) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        const response = await api.post("/auth/users/", {
                email,
                password,
                re_password,
                first_name: username,
        });

        const { tokens } = response.data;

        if (tokens) {
                const { access, refresh } = tokens;
                if (access && refresh) {
                        localStorage.setItem("access", access);
                        localStorage.setItem("refresh", refresh);
                }
        }

        return response;
}

// ✅ Получение текущего пользователя
export async function fetchCurrentUser() {
        const response = await api.get("/users/me/");
        return response.data;
}

// ✅ Логин
export async function login({ email, password }) {
        const response = await api.post("/auth/jwt/create/", { email, password });
        const { access, refresh } = response.data;

        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);

        return fetchCurrentUser();
}

// ✅ Логаут
export async function logout() {
        const refreshToken = localStorage.getItem("refresh");

        if (refreshToken) {
                await api.post("/auth/jwt/logout/", { refresh: refreshToken });
        }

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
}

// ✅ Обновление профиля
export async function updateProfile(formData) {
        const response = await api.patch("/users/me/", formData, {
                headers: {
                        "Content-Type": "multipart/form-data",
                },
        });
        return response.data;
}

