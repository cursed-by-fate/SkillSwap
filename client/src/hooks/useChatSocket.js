import { useEffect, useRef, useState } from "react";

export function useChatSocket(chatId) {
        const [messages, setMessages] = useState([]);
        const [isConnected, setIsConnected] = useState(false);
        const socketRef = useRef(null);

        useEffect(() => {
                if (!chatId) return;

                const token = localStorage.getItem("accessToken");
                const ws = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/?token=${token}`);
                socketRef.current = ws;

                ws.onopen = () => setIsConnected(true);

                ws.onmessage = (e) => {
                        const data = JSON.parse(e.data);
                        if (data.type === "chat.message") {
                                setMessages((prev) => [...prev, data.message]);
                        }
                };

                ws.onclose = () => setIsConnected(false);

                return () => {
                        ws.close();
                };
        }, [chatId]);

        const sendMessage = (content) => {
                if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
                socketRef.current.send(JSON.stringify({ type: "chat.message", content }));
        };

        return {
                messages,
                sendMessage,
                isConnected,
        };
}
