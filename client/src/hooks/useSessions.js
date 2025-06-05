import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMySessions, updateSessionStatus } from "@/api/sessions";

export const useSessions = () => {
        const queryClient = useQueryClient();

        const sessionsQuery = useQuery({
                queryKey: ["sessions"],
                queryFn: fetchMySessions,
        });

        const updateStatus = useMutation({
                mutationFn: updateSessionStatus,
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["sessions"] });
                },
        });

        return {
                ...sessionsQuery,
                updateSessionStatus: updateStatus.mutate,
        };
};
