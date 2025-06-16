// src/utils/ws.js

export const getWebSocketUrl = (path) => {
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const hostname = window.location.hostname;

        const host =
                hostname === "localhost" || hostname === "127.0.0.1"
                        ? "localhost:8000" // для локальной разработки без Docker
                        : "backend:8000";   // если фронт работает внутри Docker

        const token = localStorage.getItem("accessToken");
        return `${protocol}://${host}${path}?token=${token}`;
};
