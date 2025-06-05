import { useEffect, useState } from "react";
import useTheme from "@/hooks/useTheme";

// 🔧 Моки
const mockChats = [
        {
                id: "chat-1",
                participant2: { username: "mentor123" },
                lastMessageAt: "2024-01-01T12:00:00",
        },
        {
                id: "chat-2",
                participant2: { username: "learner456" },
                lastMessageAt: null,
        },
];

const mockMessagesMap = {
        "chat-1": [
                { id: 1, content: "Привет! Готов учиться?", sender: { isMe: false } },
                { id: 2, content: "Да! Начнём?", sender: { isMe: true } },
        ],
        "chat-2": [],
};

export default function Chat() {
        const { theme } = useTheme();
        const [selectedChatId, setSelectedChatId] = useState(mockChats[0].id);
        const [newMessage, setNewMessage] = useState("");
        const [messages, setMessages] = useState(mockMessagesMap[mockChats[0].id]);

        // Меняем чат — подгружаем сообщения
        useEffect(() => {
                setMessages(mockMessagesMap[selectedChatId] || []);
        }, [selectedChatId]);

        const handleSend = () => {
                if (!newMessage.trim()) return;

                const newMsg = {
                        id: Date.now(),
                        content: newMessage,
                        sender: { isMe: true },
                };

                setMessages((prev) => [...prev, newMsg]);
                setNewMessage("");
        };

        return (
                <div className="flex h-[calc(100vh-64px)] transition-colors bg-white text-black dark:bg-gray-900 dark:text-white">
                        {/* Левая панель */}
                        <aside className="w-1/3 border-r border-gray-300 dark:border-gray-700 hidden md:block">
                                <div className="p-4 font-bold text-lg">Чаты</div>
                                <div className="overflow-y-auto h-full">
                                        {mockChats.map((chat) => (
                                                <div
                                                        key={chat.id}
                                                        onClick={() => setSelectedChatId(chat.id)}
                                                        className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${selectedChatId === chat.id
                                                                        ? "bg-gray-200 dark:bg-gray-800"
                                                                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                }`}
                                                >
                                                        <img
                                                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${chat.participant2?.username || "U"}`}
                                                                alt="avatar"
                                                                className="w-10 h-10 rounded-full"
                                                        />
                                                        <div>
                                                                <div className="font-semibold">{chat.participant2?.username}</div>
                                                                <div className="text-sm text-gray-600 dark:text-gray-400 truncate w-40">
                                                                        {chat.lastMessageAt ? "Новое сообщение" : "Нет сообщений"}
                                                                </div>
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        </aside>

                        {/* Окно чата */}
                        <main className="flex-1 flex flex-col">
                                <div className="border-b border-gray-300 dark:border-gray-700 p-4 font-semibold">
                                        Чат с {mockChats.find((c) => c.id === selectedChatId)?.participant2?.username || "..."}
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                        {messages.map((msg, index) => (
                                                <div
                                                        key={msg.id || index}
                                                        className={`max-w-md p-2 rounded break-words ${msg.sender?.isMe
                                                                        ? "bg-blue-600 text-white self-end ml-auto text-right"
                                                                        : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white self-start mr-auto"
                                                                }`}
                                                >
                                                        <div>{msg.content}</div>
                                                </div>
                                        ))}
                                </div>

                                <div className="border-t border-gray-300 dark:border-gray-700 p-4 flex gap-2">
                                        <input
                                                className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
                                                placeholder={"Введите сообщение..."}
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        />
                                        <button
                                                onClick={handleSend}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                        >
                                                Отправить
                                        </button>
                                </div>
                        </main>
                </div>
        );
}
