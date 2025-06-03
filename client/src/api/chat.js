import api from "@/lib/axios";

export const fetchChats = async () => {
        const res = await api.get("/chat/");
        return res.data;
};

export const fetchMessages = async (chatId) => {
        const res = await api.get(`/chat/${chatId}/messages/`);
        return res.data;
};

export const sendMessage = async (chatId, data) => {
        const res = await api.post(`/chat/${chatId}/messages/`, data);
        return res.data;
};
