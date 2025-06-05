import { useEffect, useState } from "react";
import useTheme from "@/hooks/useTheme";
import { useChats, useMessages, useSendMessage } from "../hooks/useChat";

export default function Chat() {
        const { theme } = useTheme();
        const [selectedChatId, setSelectedChatId] = useState(null);
        const [newMessage, setNewMessage] = useState("");

        const chatsQuery = useChats();
        const sendMessageMutation = useSendMessage();
        const messagesQuery = useMessages(selectedChatId);

        const chats = chatsQuery.data || [];
        const messages = messagesQuery.data || [];

        useEffect(() => {
                if (!selectedChatId && chats.length > 0) {
                        setSelectedChatId(chats[0].id);
                }
        }, [chats, selectedChatId]);

        const handleSend = () => {
                if (!newMessage.trim() || !selectedChatId) return;

                sendMessageMutation.mutate({
                        chat: selectedChatId,
                        content: newMessage,
                });

                setNewMessage("");
        };

        return (
                <div className="flex h-[calc(100vh-64px)] transition-colors bg-white text-black dark:bg-gray-900 dark:text-white">
                        {/* Левая панель */}
                        <aside className="w-1/3 border-r border-gray-300 dark:border-gray-700 hidden md:block">
                                <div className="p-4 font-bold text-lg">Чаты</div>
                                <div className="overflow-y-auto h-full">
                                        {chats.map((chat) => {
                                                const other = chat.participant1?.username === undefined
                                                        ? chat.participant2
                                                        : chat.participant1;
                                                return (
                                                        <div
                                                                key={chat.id}
                                                                onClick={() => setSelectedChatId(chat.id)}
                                                                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${selectedChatId === chat.id
                                                                        ? "bg-gray-200 dark:bg-gray-800"
                                                                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                        }`}
                                                        >
                                                                <img
                                                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${other.username}`}
                                                                        alt="avatar"
                                                                        className="w-10 h-10 rounded-full"
                                                                />
                                                                <div>
                                                                        <div className="font-semibold">{other.username}</div>
                                                                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate w-40">
                                                                                {chat.last_message_at ? "Новое сообщение" : "Нет сообщений"}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                );
                                        })}
                                </div>
                        </aside>

                        {/* Окно чата */}
                        <main className="flex-1 flex flex-col">
                                <div className="border-b border-gray-300 dark:border-gray-700 p-4 font-semibold">
                                        Чат с {(() => {
                                                const chat = chats.find((c) => c.id === selectedChatId);
                                                if (!chat) return "...";
                                                return chat.participant1?.username === undefined
                                                        ? chat.participant2?.username
                                                        : chat.participant1?.username;
                                        })()}
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                        {messages.map((msg, index) => (
                                                <div
                                                        key={msg.id || index}
                                                        className={`max-w-md p-2 rounded break-words ${msg.sender?.id === chatParticipantId(chats, selectedChatId)
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

// Вспомогательная функция для определения участника текущего пользователя
function chatParticipantId(chats, chatId) {
        const chat = chats.find((c) => c.id === chatId);
        if (!chat) return null;

        // Находим текущего пользователя — это не тот, кто participant2
        return chat.participant1?.id;
}
