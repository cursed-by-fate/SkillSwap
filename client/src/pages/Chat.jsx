import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import useTheme from "@/hooks/useTheme";
import { useChats, useMessages, useSendMessage } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import ScheduleSessionModal from "@/components/ScheduleSessionModal";

export default function ChatPage() {
        const inputRef = useRef(null);
        const messagesEndRef = useRef(null);

        const { chatId } = useParams();
        const { theme } = useTheme();
        const { user } = useAuth();

        const [selectedChatId, setSelectedChatId] = useState(null);
        const [wasChatSelected, setWasChatSelected] = useState(false); // ✅ контроль выбора
        const [newMessage, setNewMessage] = useState("");
        const [isModalOpen, setIsModalOpen] = useState(false);

        const chatsQuery = useChats();
        const sendMessageMutation = useSendMessage();
        const messagesQuery = useMessages(selectedChatId);

        // ✅ Сортировка чатов по последнему сообщению
        const chats = (chatsQuery.data || []).slice().sort((a, b) => {
                const aTime = new Date(a.last_message_at || a.created_at || 0);
                const bTime = new Date(b.last_message_at || b.created_at || 0);
                return bTime - aTime;
        });

        const messages = messagesQuery.data || [];

        // ✅ Устанавливаем выбранный чат один раз
        useEffect(() => {
                if (chatId) {
                        setSelectedChatId(parseInt(chatId));
                        setWasChatSelected(true);
                } else if (chats.length > 0 && !wasChatSelected) {
                        setSelectedChatId(chats[0].id);
                        setWasChatSelected(true);
                }
        }, [chatId, chats, wasChatSelected]);

        // ✅ Скролл вниз
        useEffect(() => {
                if (messagesEndRef.current) {
                        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
                }
        }, [messages]);

        // ✅ Автофокус на input
        useEffect(() => {
                if (inputRef.current) {
                        inputRef.current.focus();
                }
        }, [selectedChatId]);

        const handleSend = () => {
                if (!newMessage.trim() || !selectedChatId) return;

                sendMessageMutation.mutate({
                        chat: selectedChatId,
                        content: newMessage,
                });

                setNewMessage("");
        };

        const getPartner = (chat) =>
                chat.participant1.id === user.id ? chat.participant2 : chat.participant1;

        const selectedChat = chats.find((c) => c.id === selectedChatId);
        const partner = selectedChat ? getPartner(selectedChat) : null;

        return (
                <div className="flex h-[calc(100vh-64px)] transition-colors bg-white text-black dark:bg-gray-900 dark:text-white">
                        {/* Левая панель */}
                        <aside className="w-1/3 border-r border-gray-300 dark:border-gray-700 hidden md:block">
                                <div className="p-4 font-bold text-lg">Чаты</div>
                                <div className="overflow-y-auto h-full">
                                        {chats.map((chat) => {
                                                const partner = getPartner(chat);
                                                const lastMessage = chat.last_message?.content || "Нет сообщений";

                                                return (
                                                        <div
                                                                key={chat.id}
                                                                onClick={() => {
                                                                        setSelectedChatId(chat.id);
                                                                        setWasChatSelected(true);
                                                                }}
                                                                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${selectedChatId === chat.id
                                                                                ? "bg-gray-200 dark:bg-gray-800"
                                                                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                        }`}
                                                        >
                                                                <img
                                                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${partner.first_name} ${partner.last_name}`}
                                                                        alt="avatar"
                                                                        className="w-10 h-10 rounded-full"
                                                                />
                                                                <div className="overflow-hidden">
                                                                        <div className="font-semibold truncate">
                                                                                {partner.first_name} {partner.last_name}
                                                                        </div>
                                                                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate w-40">
                                                                                {lastMessage}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                );
                                        })}
                                </div>
                        </aside>

                        {/* Окно чата */}
                        <main className="flex-1 flex flex-col">
                                <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 p-4 font-semibold">
                                        <div>
                                                Чат с {partner ? `${partner.first_name} ${partner.last_name}` : "..."}
                                        </div>

                                        {selectedChat && (
                                                <button
                                                        onClick={() => setIsModalOpen(true)}
                                                        className="text-sm text-blue-600 hover:underline"
                                                >
                                                        + Запланировать сессию
                                                </button>
                                        )}
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                        {messages.map((msg, index) => (
                                                <div
                                                        key={msg.id || index}
                                                        className={`max-w-md p-2 rounded break-words ${msg.sender?.id === user.id
                                                                        ? "bg-blue-600 text-white self-end ml-auto text-right"
                                                                        : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white self-start mr-auto"
                                                                }`}
                                                >
                                                        <div>{msg.content}</div>
                                                </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                </div>

                                <div className="border-t border-gray-300 dark:border-gray-700 p-4 flex gap-2">
                                        <input
                                                ref={inputRef}
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

                        {/* Модалка создания сессии */}
                        {isModalOpen && selectedChat && (
                                <ScheduleSessionModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        chat={selectedChat}
                                        currentUser={user}
                                />
                        )}
                </div>
        );
}
