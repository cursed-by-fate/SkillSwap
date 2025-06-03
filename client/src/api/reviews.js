import api from "@/lib/axios";

export const fetchReviews = async () => {
        const res = await api.get("/reviews/");
        return res.data;
};

export const createReview = async (review) => {
        const res = await api.post("/reviews/", review);
        return res.data;
};
