import api from "@/lib/axios";

export const fetchSkills = async () => {
        const res = await api.get("/skills/");
        return res.data;
};

export const fetchUserSkills = async (userId) => {
        const res = await api.get(`/skills/user/${userId}/`);
        return res.data;
};
