import api from "@/lib/axios";  // <-- добавь эту строку

export const fetchEvents = async () => {
        const res = await api.get("/calendar-events/");
        return res.data;
};

export const createEvent = async (event) => {
        const res = await api.post("/calendar-events/", event);
        return res.data;
};
