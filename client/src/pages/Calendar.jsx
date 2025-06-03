import { useState } from "react";
import {
        Calendar as CalendarIcon,
        Clock,
        Plus,
        Video,
        StickyNote,
        GraduationCap,
} from "lucide-react";

export default function CalendarPage() {
        const [events, setEvents] = useState([
                {
                        id: 1,
                        title: "Встреча с bob42",
                        date: "2025-06-06",
                        type: "Сессия",
                },
                {
                        id: 2,
                        title: "Подготовка к обучению",
                        date: "2025-06-07",
                        type: "Напоминание",
                },
        ]);

        const [newEvent, setNewEvent] = useState({ title: "", date: "", type: "Сессия" });

        const handleAdd = () => {
                if (!newEvent.title || !newEvent.date) return;
                setEvents([...events, { ...newEvent, id: Date.now() }]);
                setNewEvent({ title: "", date: "", type: "Сессия" });
        };

        return (
                <div className="min-h-screen transition-colors bg-white text-black dark:bg-gray-900 dark:text-white">
                        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
                                <h1 className="text-3xl font-bold">Календарь</h1>

                                <div className="grid md:grid-cols-5 gap-6">
                                        {/* Левая колонка */}
                                        <div className="space-y-6 md:col-span-1">
                                                {/* Добавить событие */}
                                                <div className="rounded-xl p-4 shadow bg-white dark:bg-gray-800 text-black dark:text-white">
                                                        <h2 className="text-lg font-semibold mb-3">Добавить событие</h2>
                                                        <button
                                                                onClick={handleAdd}
                                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 mb-3"
                                                        >
                                                                <Plus size={16} /> Новое событие
                                                        </button>

                                                        <div className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
                                                                <div className="flex items-center gap-2">
                                                                        <Video size={16} /> Видеозвонок
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                        <GraduationCap size={16} /> Сессия обучения
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                        <StickyNote size={16} /> Заметка
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Ближайшие события */}
                                                <div className="rounded-xl p-4 shadow bg-white dark:bg-gray-800 text-black dark:text-white">
                                                        <h2 className="text-lg font-semibold mb-3">Ближайшие события</h2>
                                                        {events.length === 0 ? (
                                                                <p className="text-gray-600 dark:text-gray-400 text-sm">Нет предстоящих событий</p>
                                                        ) : (
                                                                <ul className="space-y-2 text-sm">
                                                                        {events.slice(0, 3).map((event) => (
                                                                                <li key={event.id} className="flex items-center gap-2 text-gray-800 dark:text-gray-300">
                                                                                        <CalendarIcon size={16} /> {event.title}
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        )}
                                                </div>

                                                {/* Фильтры */}
                                                <div className="rounded-xl p-4 shadow bg-white dark:bg-gray-800 text-black dark:text-white">
                                                        <h2 className="text-lg font-semibold mb-3">Фильтры</h2>
                                                        <div className="space-y-2 text-sm">
                                                                <label className="flex items-center gap-2">
                                                                        <input type="checkbox" defaultChecked className="accent-blue-500" /> Мои события
                                                                </label>
                                                                <label className="flex items-center gap-2">
                                                                        <input type="checkbox" defaultChecked className="accent-blue-500" /> Сессии обучения
                                                                </label>
                                                                <label className="flex items-center gap-2">
                                                                        <input type="checkbox" className="accent-blue-500" /> Напоминания
                                                                </label>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Центральная колонка — Календарь */}
                                        <div className="md:col-span-4 rounded-xl shadow p-6 bg-white dark:bg-gray-800 text-black dark:text-white">
                                                <h2 className="text-xl font-semibold mb-4">июнь 2025 г.</h2>

                                                {/* Макет календаря */}
                                                <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-800 dark:text-gray-300">
                                                        {[
                                                                "Пн",
                                                                "Вт",
                                                                "Ср",
                                                                "Чт",
                                                                "Пт",
                                                                "Сб",
                                                                "Вс",
                                                        ].map((d) => (
                                                                <div key={d} className="font-semibold text-gray-700 dark:text-gray-400">
                                                                        {d}
                                                                </div>
                                                        ))}
                                                        {Array.from({ length: 31 }, (_, i) => (
                                                                <div
                                                                        key={i}
                                                                        className={`py-2 rounded cursor-default ${i + 1 === 1
                                                                                        ? "bg-blue-600 text-white"
                                                                                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                                                                }`}
                                                                >
                                                                        {i + 1}
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}
