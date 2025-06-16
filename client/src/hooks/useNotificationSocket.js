import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useNotificationSocket = () => {
        const queryClient = useQueryClient();

        useEffect(() => {
                const token = localStorage.getItem("accessToken");
                if (!token) return;
                const protocol = window.location.protocol === "https:" ? "wss" : "ws";
                const host = window.location.host;
                const socket = new WebSocket(`${protocol}://${host}/ws/notifications/?token=${token}`);



                socket.onmessage = (event) => {
                        const data = JSON.parse(event.data);

                        // Обновление кэша
                        queryClient.setQueryData(["notifications"], (old = []) => [
                                data,
                                ...old,
                        ]);

                        // Всплывающее уведомление
                        toast(data.title || "Новое уведомление", {
                                type: "info",
                                position: "top-center",
                                autoClose: 3000,
                        });
                };

                socket.onerror = (error) => {
                        console.error("WebSocket Error:", error);
                };

                return () => {
                        socket.close();
                };
        }, [queryClient]);
};
