import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения из `.env`, `.env.development`, и т.д.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5173,
      host: "localhost", // 👈 или true, если нужен доступ с других устройств
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/ws": {
          target: env.VITE_WS_BASE_URL || "ws://localhost:8000",
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    envPrefix: "VITE_", // 👈 гарантирует, что только переменные VITE_ попадут в клиент
  };
});
