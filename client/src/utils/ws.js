export const getWebSocketUrl = (path) => {
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const hostname = window.location.hostname;

        const host =
                hostname === "localhost" || hostname === "127.0.0.1"
                        ? "localhost:8000"
                        : "backend:8000"; // можно заменить на переменную окружения

        const token = localStorage.getItem("access");
        if (!token) {
                console.warn("⚠️ WebSocket: access token отсутствует");
                return null;
        }

        return `${protocol}://${host}${path}?token=${token}`;
};
