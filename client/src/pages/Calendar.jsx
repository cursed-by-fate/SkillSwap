import { useState } from "react";
import {
        Calendar as CalendarIcon,
        Plus,
        Video,
        StickyNote,
        GraduationCap,
} from "lucide-react";
import { format, getDaysInMonth } from "date-fns";
import ru from "date-fns/locale/ru";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

export default function CalendarPage() {
        const today = new Date();
        const { eventsQuery, createEvent } = useCalendarEvents();
        const events = eventsQuery.data || [];

        const [newEvent, setNewEvent] = useState({
                title: "",
                date: "",
                type: "personal", // значения должны совпадать с event_type в backend
        });

        const handleAdd = () => {
                if (!newEvent.title || !newEvent.date) return;

                createEvent({
                        title: newEvent.title,
                        start_time: newEvent.date + "T12:00:00Z",
                        end_time: newEvent.date + "T13:00:00Z",
                        event_type: newEvent.type,
                });


                setNewEvent({ title: "", date: "", type: "personal" });
        };

        const daysInMonth = getDaysInMonth(today);
        const monthLabel = format(today, "LLLL yyyy", { locale: ru });

        const getEventsForDate = (dateString) =>
                events.filter((event) =>
                        event.start_time.startsWith(dateString)
                );

        return (
                <div className="min-h-screen transition-colors bg-white text-black dark:bg-gray-900 dark:text-white">
                        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
                                <h1 className="text-3xl font-bold">Календарь</h1>

                                <div className="grid md:grid-cols-5 gap-6">
                                        {/* Левая колонка */}
                                        <div className="space-y-6 md:col-span-1">
                                                {/* Добавить событие */}
                                                <div className="rounded-xl p-4 shadow bg-white dark:bg-gray-800">
                                                        <h2 className="text-lg font-semibold mb-3">Добавить событие</h2>
                                                        <input
                                                                type="text"
                                                                placeholder="Название"
                                                                className="w-full mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                                                                value={newEvent.title}
                                                                onChange={(e) =>
                                                                        setNewEvent({ ...newEvent, title: e.target.value })
                                                                }
                                                        />
                                                        <input
                                                                type="date"
                                                                className="w-full mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                                                                value={newEvent.date}
                                                                onChange={(e) =>
                                                                        setNewEvent({ ...newEvent, date: e.target.value })
                                                                }
                                                        />
                                                        <select
                                                                className="w-full mb-4 p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                                                                value={newEvent.type}
                                                                onChange={(e) =>
                                                                        setNewEvent({ ...newEvent, type: e.target.value })
                                                                }
                                                        >
                                                                <option value="personal">Личное</option>
                                                                <option value="session">Сессия</option>
                                                                <option value="reminder">Напоминание</option>
                                                        </select>
                                                        <button
                                                                onClick={handleAdd}
                                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
                                                        >
                                                                <Plus size={16} /> Новое событие
                                                        </button>
                                                </div>

                                                {/* Ближайшие события */}
                                                <div className="rounded-xl p-4 shadow bg-white dark:bg-gray-800">
                                                        <h2 className="text-lg font-semibold mb-3">Ближайшие события</h2>
                                                        {events.length === 0 ? (
                                                                <p className="text-gray-600 dark:text-gray-400 text-sm">Нет событий</p>
                                                        ) : (
                                                                <ul className="space-y-2 text-sm">
                                                                        {events.slice(0, 3).map((event) => (
                                                                                <li key={event.id} className="flex items-center gap-2">
                                                                                        <CalendarIcon size={16} /> {event.title}
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        )}
                                                </div>

                                                {/* Фильтры */}
                                                <div className="rounded-xl p-4 shadow bg-white dark:bg-gray-800">
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

                                        {/* Центральная колонка */}
                                        <div className="md:col-span-4 rounded-xl shadow p-6 bg-white dark:bg-gray-800">
                                                <h2 className="text-xl font-semibold mb-4">{monthLabel}</h2>
                                                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                                                        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                                                                <div key={d} className="font-semibold text-gray-700 dark:text-gray-400">{d}</div>
                                                        ))}
                                                        {Array.from({ length: daysInMonth }, (_, i) => {
                                                                const day = i + 1;
                                                                const dateString = format(new Date(today.getFullYear(), today.getMonth(), day), "yyyy-MM-dd");
                                                                const hasEvent = getEventsForDate(dateString).length > 0;

                                                                return (
                                                                        <div
                                                                                key={day}
                                                                                className={`py-2 rounded ${hasEvent ? "bg-blue-600 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"} cursor-pointer`}
                                                                        >
                                                                                {day}
                                                                        </div>
                                                                );
                                                        })}
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}
