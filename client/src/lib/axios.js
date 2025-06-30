// src/lib/axios.js
import axios from "axios";

const api = axios.create({
        baseURL: "http://localhost:8000/api",
        withCredentials: true,
});

// Добавляем токен в каждый запрос
api.interceptors.request.use((config) => {
        const token = localStorage.getItem("access");
        if (token) {
                config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
});

// Автообновление токена при ошибке 401
api.interceptors.response.use(
        (response) => response,
        async (error) => {
                const originalRequest = error.config;

                // Предотвратить бесконечный цикл
                if (error.response?.status === 401 && !originalRequest._retry) {
                        originalRequest._retry = true;

                        const refreshToken = localStorage.getItem("refresh");
                        if (refreshToken) {
                                try {
                                        const response = await axios.post(
                                                "http://localhost:8000/api/token/refresh/",
                                                { refresh: refreshToken }
                                        );
                                        const newAccessToken = response.data.access;
                                        localStorage.setItem("access", newAccessToken);

                                        // Повторить оригинальный запрос с новым токеном
                                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                                        return api(originalRequest);
                                } catch (err) {
                                        console.warn("⛔ Не удалось обновить токен", err);
                                        // Очистить хранилище, можно редирект на логин
                                        localStorage.removeItem("access");
                                        localStorage.removeItem("refresh");
                                }
                        }
                }

                return Promise.reject(error);
        }
);

export default api;
