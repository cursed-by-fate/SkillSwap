import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { refreshAccessToken } from "@/api/auth";

export const useNotificationSocket = () => {
        const queryClient = useQueryClient();
        const socketRef = useRef(null);

        useEffect(() => {
                const connectSocket = async () => {
                        let access = localStorage.getItem("access");

                        if (!access) return;

                        const backendHost = "localhost:8000"; // или IP, если в Docker
                        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
                        const token = localStorage.getItem("access");

                        socketRef.current = new WebSocket(
                                `${protocol}://${backendHost}/ws/notifications/?token=${token}`
                        );

                        socketRef.current.onmessage = (event) => {
                                const data = JSON.parse(event.data);
                                queryClient.setQueryData(["notifications"], (old = []) => [data, ...old]);

                                toast(data.title || "Новое уведомление", {
                                        type: "info",
                                        position: "top-center",
                                        autoClose: 3000,
                                });
                        };

                        socketRef.current.onclose = async (e) => {
                                if (e.code === 1006 || e.code === 1000) {
                                        console.log("🔄 Попытка переподключения WebSocket...");
                                        try {
                                                const newAccess = await refreshAccessToken();
                                                localStorage.setItem("access", newAccess);
                                                connectSocket(); // рекурсивное переподключение
                                        } catch (err) {
                                                console.warn("⛔ Не удалось обновить токен WebSocket");
                                        }
                                }
                        };

                        socketRef.current.onerror = (error) => {
                                console.error("WebSocket Error:", error);
                        };
                };

                connectSocket();

                return () => {
                        socketRef.current?.close();
                };
        }, [queryClient]);
};
