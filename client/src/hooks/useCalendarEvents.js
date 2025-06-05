import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// Получение личных событий
const fetchCalendarEvents = async () => {
        const res = await api.get("/calendar-events/");
        return res.data;
};

// Получение сессий текущего пользователя
const fetchSessions = async () => {
        const res = await api.get("/sessions/");
        return res.data;
};

// Создание нового события
const createEvent = async (newEvent) => {
        const res = await api.post("/calendar-events/", newEvent);
        return res.data;
};

export function useCalendarEvents() {
        const queryClient = useQueryClient();

        // Загрузка личных событий
        const calendarQuery = useQuery({
                queryKey: ["calendar-events"],
                queryFn: fetchCalendarEvents,
        });

        // Загрузка сессий
        const sessionsQuery = useQuery({
                queryKey: ["sessions"],
                queryFn: fetchSessions,
        });

        // Объединение: календарь + сессии
        const combinedEvents = [
                ...(calendarQuery.data || []),
                ...(sessionsQuery.data || []).map((session) => ({
                        id: session.id,
                        title: `Сессия: ${session.title}`,
                        start_time: session.scheduled_at,
                        end_time: session.scheduled_at, // или вычислять по duration
                        event_type: "session",
                })),
        ];

        // Создание события
        const createEventMutation = useMutation({
                mutationFn: createEvent,
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
                },
        });

        return {
                eventsQuery: { ...calendarQuery, data: combinedEvents },
                createEvent: createEventMutation.mutate,
        };
}
