// src/api/chat.js
import axios from "@/lib/axios";

// ✅ Получение всех чатов текущего пользователя
export async function getChats() {
        const response = await axios.get("/chats/");
        return response.data;
}

// ✅ Получение всех сообщений в чате по ID
export async function getMessages(chatId) {
        const response = await axios.get(`/chats/${chatId}/messages/`);
        return response.data;
}

// ✅ Отправка нового сообщения
export async function sendMessage({ chat, content, message_type = "text" }) {
        const response = await axios.post("/messages/", {
                chat,
                content,
                message_type,
        });
        return response.data;
}

// ✅ Получение или создание чата с другим пользователем
export async function getOrCreateChat(partnerId) {
        const response = await axios.post("/chats/", { partner_id: partnerId });
        return response.data;
}
