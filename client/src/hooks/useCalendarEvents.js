import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios"; // ⚠️ Импортируй именно твой настроенный экземпляр

const fetchEvents = async () => {
        const res = await api.get("/calendar-events/"); // ✅ Без лишнего /api
        return res.data;
};

const createEvent = async (newEvent) => {
        const res = await api.post("/calendar-events/", newEvent); // ✅ Без лишнего /api
        return res.data;
};

export function useCalendarEvents() {
        const queryClient = useQueryClient();

        const eventsQuery = useQuery({
                queryKey: ["calendar-events"],
                queryFn: fetchEvents,
        });

        const createEventMutation = useMutation({
                mutationFn: createEvent,
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
                },
        });

        return {
                eventsQuery,
                createEvent: createEventMutation.mutate,
        };
}
