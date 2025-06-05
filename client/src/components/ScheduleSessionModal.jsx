import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios"; // ✅ обязательно импорт api
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createEvent } from "@/api/calendar";
import { createSession } from "@/api/sessions";

// Функция для расчёта окончания сессии
function calculateEndTime(start, durationMinutes) {
        const startDate = new Date(start);
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
        return endDate.toISOString();
}

export default function ScheduleSessionModal({ isOpen, onClose, chat, currentUser }) {
        const [form, setForm] = useState({
                title: "",
                description: "",
                scheduled_at: "",
                duration: 60,
                skill: "",
        });

        const queryClient = useQueryClient();

        // Загрузка навыков
        const { data: skills = [] } = useQuery({
                queryKey: ["skills"],
                queryFn: async () => {
                        const res = await api.get("/skills/");
                        console.log("Полученные навыки:", res.data);
                        return res.data;
                },
        });

        // Создание сессии и события в календаре
        const createSessionMutation = useMutation({
                mutationFn: async () => {
                        const scheduledAtISO = new Date(form.scheduled_at).toISOString();

                        const session = await createSession({
                                title: form.title,
                                description: form.description,
                                scheduled_at: scheduledAtISO,
                                duration: form.duration, // уже число
                                skill: form.skill,
                                mentor: currentUser.id,
                                student:
                                        chat.participant1.id === currentUser.id
                                                ? chat.participant2.id
                                                : chat.participant1.id,
                        });

                        await createEvent({
                                title: `Сессия: ${form.title}`,
                                start_time: session.scheduled_at,
                                end_time: calculateEndTime(session.scheduled_at, form.duration),
                                event_type: "session",
                                related_session: session.id,
                        });

                        return session;
                },
                onSuccess: () => {
                        toast.success("Сессия и событие добавлены в календарь! 🎉");
                        queryClient.invalidateQueries(["sessions"]);
                        queryClient.invalidateQueries(["calendar-events"]);
                        onClose();
                },
                onError: (error) => {
                        console.error("Ошибка при создании:", error.response?.data || error);
                        toast.error("Ошибка при создании сессии или события 😕");
                },
        });

        const handleSubmit = () => {
                if (!form.title || !form.scheduled_at || !form.skill) {
                        toast.warn("Пожалуйста, заполните все обязательные поля");
                        return;
                }
                createSessionMutation.mutate();
        };

        return (
                <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30 p-4">
                                <Dialog.Panel className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-md w-full space-y-4">
                                        <Dialog.Title className="text-xl font-bold">Запланировать сессию</Dialog.Title>

                                        <input
                                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                                                placeholder="Название"
                                                value={form.title}
                                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        />
                                        <textarea
                                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                                                placeholder="Описание"
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        />
                                        <input
                                                type="datetime-local"
                                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                                                value={form.scheduled_at}
                                                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                                        />
                                        <input
                                                type="number"
                                                min="15"
                                                step="15"
                                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                                                placeholder="Длительность (мин)"
                                                value={form.duration}
                                                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                                        />
                                        <select
                                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                                                value={form.skill}
                                                onChange={(e) => setForm({ ...form, skill: e.target.value })}
                                        >
                                                <option value="">Выберите навык</option>
                                                {skills.map((skill) => (
                                                        <option key={skill.id} value={skill.id}>
                                                                {skill.name}
                                                        </option>
                                                ))}
                                        </select>

                                        <div className="flex justify-end gap-2">
                                                <button
                                                        onClick={onClose}
                                                        className="px-4 py-2 rounded text-sm bg-gray-300 dark:bg-gray-700"
                                                >
                                                        Отмена
                                                </button>
                                                <button
                                                        onClick={handleSubmit}
                                                        className="px-4 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                        Создать
                                                </button>
                                        </div>
                                </Dialog.Panel>
                        </div>
                </Dialog>
        );
}
