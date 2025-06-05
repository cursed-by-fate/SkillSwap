// src/hooks/useChats.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as chatApi from "@/api/chat";

// 🔹 Хук для получения всех чатов
export function useChats() {
        return useQuery({
                queryKey: ["chats"],
                queryFn: chatApi.getChats,
        });
}

// 🔹 Хук для получения сообщений по chatId
export function useMessages(chatId) {
        return useQuery({
                queryKey: ["messages", chatId],
                queryFn: () => chatApi.getMessages(chatId),
                enabled: !!chatId,
        });
}

// 🔹 Хук для отправки сообщений
export function useSendMessage() {
        const queryClient = useQueryClient();

        return useMutation({
                mutationFn: chatApi.sendMessage,
                onSuccess: (_, { chat }) => {
                        queryClient.invalidateQueries({ queryKey: ["messages", chat] });
                        queryClient.invalidateQueries({ queryKey: ["chats"] });
                },
        });
}
