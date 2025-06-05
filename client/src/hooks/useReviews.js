// hooks/useReviews.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export const useDeleteReview = () => {
        const queryClient = useQueryClient();

        return useMutation({
                mutationFn: (id) => api.delete(`/reviews/${id}/`),
                onSuccess: () => {
                        toast.success("Отзыв удалён");
                        queryClient.invalidateQueries(["reviews"]);
                },
        });
};
