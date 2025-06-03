import { useState } from "react";
import useTheme from "@/hooks/useTheme";

export default function Chat() {
        const { theme } = useTheme();
        const [selectedChatId, setSelectedChatId] = useState(1);

        const chats = [
                {
                        id: 1,
                        user: "alice_dev",
                        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Alice",
                        lastMessage: "Спасибо за сессию!",
                },
                {
                        id: 2,
                        user: "bob42",
                        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bob",
                        lastMessage: "Когда будет следующая встреча?",
                },
        ];

        const messages = {
                1: [
                        { sender: "me", text: "Привет, когда тебе удобно?", id: 1 },
                        { sender: "alice_dev", text: "Завтра в 16:00", id: 2 },
                ],
                2: [
                        { sender: "me", text: "Привет!", id: 1 },
                        { sender: "bob42", text: "Привет, давай в пятницу", id: 2 },
                ],
        };

        const [newMessage, setNewMessage] = useState("");
        const currentMessages = messages[selectedChatId] || [];

        const handleSend = () => {
                if (!newMessage.trim()) return;
                messages[selectedChatId].push({
                        sender: "me",
                        text: newMessage,
                        id: Date.now(),
                });
                setNewMessage("");
        };

        return (
                <div className="flex h-[calc(100vh-64px)] transition-colors bg-white text-black dark:bg-gray-900 dark:text-white">
                        {/* Левая панель */}
                        <aside className="w-1/3 border-r border-gray-300 dark:border-gray-700 hidden md:block">
                                <div className="p-4 font-bold text-lg">Чаты</div>
                                <div className="overflow-y-auto h-full">
                                        {chats.map((chat) => (
                                                <div
                                                        key={chat.id}
                                                        onClick={() => setSelectedChatId(chat.id)}
                                                        className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${selectedChatId === chat.id
                                                                        ? "bg-gray-200 dark:bg-gray-800"
                                                                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                }`}
                                                >
                                                        <img
                                                                src={chat.avatar}
                                                                alt={chat.user}
                                                                className="w-10 h-10 rounded-full"
                                                        />
                                                        <div>
                                                                <div className="font-semibold">{chat.user}</div>
                                                                <div className="text-sm text-gray-600 dark:text-gray-400 truncate w-40">
                                                                        {chat.lastMessage}
                                                                </div>
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        </aside>

                        {/* Окно чата */}
                        <main className="flex-1 flex flex-col">
                                <div className="border-b border-gray-300 dark:border-gray-700 p-4 font-semibold">
                                        Чат с {chats.find((c) => c.id === selectedChatId)?.user}
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                        {currentMessages.map((msg) => (
                                                <div
                                                        key={msg.id}
                                                        className={`max-w-md p-2 rounded break-words ${msg.sender === "me"
                                                                        ? "bg-blue-600 text-white self-end ml-auto text-right"
                                                                        : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white self-start mr-auto"
                                                                }`}
                                                >
                                                        <div>{msg.text}</div>
                                                </div>
                                        ))}
                                </div>

                                <div className="border-t border-gray-300 dark:border-gray-700 p-4 flex gap-2">
                                        <input
                                                className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
                                                placeholder="Введите сообщение..."
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
