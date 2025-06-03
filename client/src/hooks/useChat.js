import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as chatApi from "@/api/chat";

export const useChat = (chatId) => {
        const queryClient = useQueryClient();

        const { data: messages, isLoading } = useQuery(
                ["messages", chatId],
                () => chatApi.fetchMessages(chatId),
                { enabled: !!chatId }
        );

        const send = useMutation((data) => chatApi.sendMessage(chatId, data), {
                onSuccess: () => queryClient.invalidateQueries(["messages", chatId]),
        });

        return {
                messages,
                isLoading,
                sendMessage: send.mutate,
        };
};
