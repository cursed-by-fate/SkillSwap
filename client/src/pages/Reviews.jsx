import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/axios";
import { Star, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ReviewsPage() {
        const { user } = useAuth();
        const queryClient = useQueryClient();
        const [newReview, setNewReview] = useState({ to_user: "", text: "" });

        const reviewsQuery = useQuery({
                queryKey: ["reviews"],
                queryFn: async () => {
                        const res = await api.get("/reviews/");
                        return res.data;
                },
        });

        const createReview = useMutation({
                mutationFn: async (data) => {
                        const res = await api.post("/reviews/", data);
                        return res.data;
                },
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["reviews"] });
                        setNewReview({ to_user: "", text: "" });
                },
        });

        const handleSubmit = () => {
                if (!newReview.to_user || !newReview.text) return;
                createReview.mutate({
                        to_user: newReview.to_user,
                        text: newReview.text,
                });
        };

        return (
                <div className="min-h-screen p-6 md:p-10 bg-white dark:bg-gray-900 text-black dark:text-white">
                        <div className="max-w-4xl mx-auto space-y-6">
                                <h1 className="text-3xl font-bold">Отзывы</h1>

                                {/* Новый отзыв */}
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl space-y-4">
                                        <h2 className="text-xl font-semibold">Оставить отзыв</h2>
                                        <input
                                                type="text"
                                                placeholder="ID пользователя (to_user)"
                                                className="w-full p-2 rounded bg-white dark:bg-gray-700"
                                                value={newReview.to_user}
                                                onChange={(e) =>
                                                        setNewReview({ ...newReview, to_user: e.target.value })
                                                }
                                        />
                                        <textarea
                                                placeholder="Ваш отзыв"
                                                className="w-full p-2 rounded bg-white dark:bg-gray-700"
                                                value={newReview.text}
                                                onChange={(e) =>
                                                        setNewReview({ ...newReview, text: e.target.value })
                                                }
                                        />
                                        <button
                                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                onClick={handleSubmit}
                                        >
                                                Отправить отзыв
                                        </button>
                                </div>

                                {/* Список отзывов */}
                                <div className="space-y-4">
                                        <h2 className="text-xl font-semibold">Полученные отзывы</h2>
                                        {reviewsQuery.data?.length ? (
                                                reviewsQuery.data.map((review) => (
                                                        <div key={review.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                                                <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                                От: {review.author?.username || review.author}
                                                                        </span>
                                                                        <Star className="text-yellow-500" />
                                                                </div>
                                                                <p>{review.text}</p>
                                                        </div>
                                                ))
                                        ) : (
                                                <p className="text-gray-600 dark:text-gray-400">Пока нет отзывов</p>
                                        )}
                                </div>
                        </div>
                </div>
        );
}
