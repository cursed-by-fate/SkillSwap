import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/axios";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export default function ReviewsPage() {
        const { user, isLoading: isAuthLoading } = useAuth();
        const queryClient = useQueryClient();

        const [newReview, setNewReview] = useState({
                to_user: "",
                session: "",
                text: "",
                rating: 0,
        });

        const [editingReviewId, setEditingReviewId] = useState(null);
        const [editingForm, setEditingForm] = useState({});
        const [emailSuggestions, setEmailSuggestions] = useState([]);

        const [tab, setTab] = useState("all");
        const [sortOrder, setSortOrder] = useState("desc");
        const [minRating, setMinRating] = useState(0);

        const { data: users = [] } = useQuery({
                queryKey: ["users"],
                queryFn: async () => (await api.get("/users/")).data,
        });

        const { data: sessions = [] } = useQuery({
                queryKey: ["sessions"],
                queryFn: async () => (await api.get("/sessions/")).data,
        });

        const { data: reviews = [] } = useQuery({
                queryKey: ["reviews"],
                queryFn: async () => (await api.get("/reviews/")).data,
                enabled: !!user,
        });

        const createReview = useMutation({
                mutationFn: (review) => api.post("/reviews/", review),
                onSuccess: () => {
                        queryClient.invalidateQueries(["reviews"]);
                        toast.success("Отзыв добавлен");
                        setNewReview({ to_user: "", session: "", text: "", rating: 0 });
                },
        });

        const updateReview = useMutation({
                mutationFn: ({ id, data }) => api.put(`/reviews/${id}/`, data),
                onSuccess: () => {
                        queryClient.invalidateQueries(["reviews"]);
                        toast.success("Отзыв обновлён");
                        setEditingReviewId(null);
                },
        });

        const deleteReview = useMutation({
                mutationFn: (id) => api.delete(`/reviews/${id}/`),
                onSuccess: () => {
                        queryClient.invalidateQueries(["reviews"]);
                        toast.success("Отзыв удалён");
                },
        });

        const handleEmailInput = (input) => {
                setNewReview((prev) => ({ ...prev, to_user: input }));
                const suggestions = users.filter((u) => u.email.includes(input)).slice(0, 5);
                setEmailSuggestions(suggestions);
        };

        if (isAuthLoading || !user) {
                return (
                        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex items-center justify-center">
                                <p className="text-gray-600 dark:text-gray-300">Загрузка...</p>
                        </div>
                );
        }

        const filteredReviews = (reviews || [])
                .filter((r) => r?.reviewer && r?.reviewee) // ✅ защита от undefined
                .filter((r) => {
                        if (tab === "my") return r.reviewer?.id === user.id;
                        if (tab === "about_me") return r.reviewee?.id === user.id;
                        return true;
                })
                .filter((r) => r.rating >= minRating)
                .sort((a, b) =>
                        sortOrder === "desc"
                                ? new Date(b.created_at) - new Date(a.created_at)
                                : new Date(a.created_at) - new Date(b.created_at)
                );


        return (
                <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors p-6 md:p-10 max-w-5xl mx-auto space-y-8">
                        <h1 className="text-3xl font-bold">Отзывы</h1>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-3">
                                <button onClick={() => setTab("all")} className={tab === "all" ? "font-bold underline" : ""}>
                                        Все отзывы
                                </button>
                                <button onClick={() => setTab("my")} className={tab === "my" ? "font-bold underline" : ""}>
                                        Мои отзывы
                                </button>
                                <button onClick={() => setTab("about_me")} className={tab === "about_me" ? "font-bold underline" : ""}>
                                        Обо мне
                                </button>
                        </div>

                        {/* Sort and filter */}
                        <div className="flex flex-wrap gap-4 items-center">
                                <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
                                >
                                        <option value="desc">Сначала новые</option>
                                        <option value="asc">Сначала старые</option>
                                </select>

                                <select
                                        value={minRating}
                                        onChange={(e) => setMinRating(Number(e.target.value))}
                                        className="px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
                                >
                                        <option value={0}>Все рейтинги</option>
                                        <option value={5}>Только 5 звёзд</option>
                                        <option value={4}>4+ звёзды</option>
                                        <option value={3}>3+ звезды</option>
                                </select>
                        </div>

                        {/* Форма нового отзыва */}
                        <div className="space-y-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
                                <h2 className="text-xl font-semibold">Оставить отзыв</h2>

                                <input
                                        type="text"
                                        value={newReview.to_user}
                                        onChange={(e) => handleEmailInput(e.target.value)}
                                        placeholder="Email пользователя"
                                        className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                                />
                                {emailSuggestions.length > 0 && (
                                        <ul className="border rounded bg-white dark:bg-gray-700 mt-1">
                                                {emailSuggestions.map((u) => (
                                                        <li
                                                                key={u.id}
                                                                className="px-3 py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white"
                                                                onClick={() => setNewReview((prev) => ({ ...prev, to_user: u.email }))}
                                                        >
                                                                {u.email}
                                                        </li>
                                                ))}
                                        </ul>
                                )}

                                <select
                                        value={newReview.session}
                                        onChange={(e) => setNewReview((prev) => ({ ...prev, session: e.target.value }))}
                                        className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                                >
                                        <option value="">Выберите сессию</option>
                                        {sessions
                                                .filter((s) => s.status === "completed")
                                                .map((s) => (
                                                        <option key={s.id} value={s.id}>
                                                                {s.title}
                                                        </option>
                                                ))}
                                </select>

                                <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                        key={star}
                                                        onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                                                        className={`w-6 h-6 cursor-pointer ${star <= newReview.rating ? "text-yellow-400" : "text-gray-400 dark:text-gray-600"
                                                                }`}
                                                        fill={star <= newReview.rating ? "currentColor" : "none"}
                                                />
                                        ))}
                                </div>

                                <textarea
                                        value={newReview.text}
                                        onChange={(e) => setNewReview((prev) => ({ ...prev, text: e.target.value }))}
                                        className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                                        placeholder="Ваш отзыв..."
                                />

                                <button
                                        onClick={() => {
                                                const { to_user, session, text, rating } = newReview;

                                                if (!to_user || !session || !text.trim() || rating === 0) {
                                                        toast.error("Пожалуйста, заполните все поля и поставьте рейтинг");
                                                        return;
                                                }

                                                createReview.mutate(newReview);
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                        Отправить
                                </button>
                        </div>
                        {/* Список отзывов */}
                        <div className="space-y-4">
                                {filteredReviews.map((review) => {
                                        if (!review?.reviewer || !review?.reviewee || !review?.created_at) return null;

                                        const isAuthor = review.reviewer.id === user.id;

                                        return (
                                                <div
                                                        key={review.id}
                                                        className="border rounded p-4 bg-white dark:bg-gray-800 text-black dark:text-white shadow"
                                                >
                                                        {editingReviewId === review.id ? (
                                                                <>
                                                                        <textarea
                                                                                value={editingForm.text}
                                                                                onChange={(e) =>
                                                                                        setEditingForm((prev) => ({
                                                                                                ...prev,
                                                                                                text: e.target.value,
                                                                                        }))
                                                                                }
                                                                                className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 mb-2"
                                                                        />
                                                                        <div className="flex space-x-1 mb-2">
                                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                                        <Star
                                                                                                key={star}
                                                                                                onClick={() =>
                                                                                                        setEditingForm((prev) => ({
                                                                                                                ...prev,
                                                                                                                rating: star,
                                                                                                        }))
                                                                                                }
                                                                                                className={`w-5 h-5 cursor-pointer ${star <= editingForm.rating
                                                                                                        ? "text-yellow-400"
                                                                                                        : "text-gray-400 dark:text-gray-600"
                                                                                                        }`}
                                                                                                fill={star <= editingForm.rating ? "currentColor" : "none"}
                                                                                        />
                                                                                ))}
                                                                        </div>
                                                                        <button
                                                                                onClick={() =>
                                                                                        updateReview.mutate({
                                                                                                id: review.id,
                                                                                                data: editingForm,
                                                                                        })
                                                                                }
                                                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2"
                                                                        >
                                                                                Сохранить
                                                                        </button>
                                                                        <button
                                                                                onClick={() => setEditingReviewId(null)}
                                                                                className="text-gray-600 dark:text-gray-300 hover:underline"
                                                                        >
                                                                                Отмена
                                                                        </button>
                                                                </>
                                                        ) : (
                                                                <>
                                                                        <div className="flex justify-between">
                                                                                <div>
                                                                                        <p className="font-semibold">
                                                                                                {review.reviewer.username || review.reviewer.email}
                                                                                        </p>
                                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                                                {formatDistanceToNow(new Date(review.created_at), {
                                                                                                        addSuffix: true,
                                                                                                        locale: ru,
                                                                                                })}
                                                                                        </p>
                                                                                </div>
                                                                                <div className="flex space-x-1">
                                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                                                <Star
                                                                                                        key={star}
                                                                                                        className={`w-4 h-4 ${star <= review.rating
                                                                                                                ? "text-yellow-400"
                                                                                                                : "text-gray-300 dark:text-gray-600"
                                                                                                                }`}
                                                                                                        fill={star <= review.rating ? "currentColor" : "none"}
                                                                                                />
                                                                                        ))}
                                                                                </div>
                                                                        </div>
                                                                        <p className="mt-2 text-gray-800 dark:text-gray-200">{review.text}</p>
                                                                        {isAuthor && (
                                                                                <div className="mt-2">
                                                                                        <button
                                                                                                onClick={() => {
                                                                                                        setEditingReviewId(review.id);
                                                                                                        setEditingForm({
                                                                                                                text: review.text,
                                                                                                                rating: review.rating,
                                                                                                        });
                                                                                                }}
                                                                                                className="text-blue-600 dark:text-blue-400 hover:underline mr-3"
                                                                                        >
                                                                                                Редактировать
                                                                                        </button>
                                                                                        <button
                                                                                                onClick={() => {
                                                                                                        if (window.confirm("Удалить отзыв?")) {
                                                                                                                deleteReview.mutate(review.id);
                                                                                                        }
                                                                                                }}
                                                                                                className="text-red-500 dark:text-red-400 hover:underline"
                                                                                        >
                                                                                                Удалить
                                                                                        </button>
                                                                                </div>
                                                                        )}
                                                                </>
                                                        )}
                                                </div>
                                        );
                                })}
                        </div>
                </div>
        );
}
