// components/LeaveReviewModal.jsx
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/api/reviews";
import { toast } from "react-toastify";

export default function LeaveReviewModal({ isOpen, onClose, session }) {
        const queryClient = useQueryClient();
        const [rating, setRating] = useState(5);
        const [comment, setComment] = useState("");

        const mutation = useMutation({
                mutationFn: createReview,
                onSuccess: () => {
                        toast.success("Отзыв успешно отправлен");
                        queryClient.invalidateQueries(["sessions"]);
                        onClose();
                },
                onError: (error) => {
                        toast.error(error?.response?.data?.detail || "Ошибка при отправке");
                },
        });

        const handleSubmit = (e) => {
                e.preventDefault();
                mutation.mutate({
                        session: session.id,
                        rating,
                        comment,
                });
        };

        return (
                <Dialog open={isOpen} onClose={onClose} className="relative z-50">
                        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                                <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
                                        <Dialog.Title className="text-xl font-bold mb-4">Оставить отзыв</Dialog.Title>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                                <div>
                                                        <label className="block text-sm font-medium">Оценка (1–5):</label>
                                                        <input
                                                                type="number"
                                                                min="1"
                                                                max="5"
                                                                value={rating}
                                                                onChange={(e) => setRating(Number(e.target.value))}
                                                                className="w-full mt-1 p-2 border rounded dark:bg-gray-700"
                                                                required
                                                        />
                                                </div>
                                                <div>
                                                        <label className="block text-sm font-medium">Комментарий:</label>
                                                        <textarea
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                                className="w-full mt-1 p-2 border rounded dark:bg-gray-700"
                                                        />
                                                </div>
                                                <button
                                                        type="submit"
                                                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                                                >
                                                        Отправить
                                                </button>
                                        </form>
                                </Dialog.Panel>
                        </div>
                </Dialog>
        );
}
