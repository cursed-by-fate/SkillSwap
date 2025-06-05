import api from "@/lib/axios";

// ✅ Функция регистрации
export async function register({ email, username, password, re_password }) {
        const response = await api.post("/auth/users/", {
                email,
                password,
                re_password,
                first_name: username, // если ты используешь это поле как имя
        });

        const tokens = response.data.tokens;
        if (tokens?.access) {
                localStorage.setItem("accessToken", tokens.access);
                localStorage.setItem("refreshToken", tokens.refresh);
        }

        return response.data;
}

// ✅ Получение текущего пользователя
export async function fetchCurrentUser() {
        const response = await api.get("/auth/users/me/");
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

export async function updateProfile(data) {
        // временная заглушка
        console.log("updateProfile called with", data);
        return { success: true };
}