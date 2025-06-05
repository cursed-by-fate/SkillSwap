// CalendarPage.jsx
import { useState } from "react";
import {
        Calendar as CalendarIcon,
        Plus,
        Video,
        StickyNote,
        GraduationCap,
} from "lucide-react";
import {
        Calendar as BigCalendar,
        dateFnsLocalizer,
        Views,
} from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ru from "date-fns/locale/ru";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/custom-calendar.css';

const locales = { ru };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function CalendarPage() {
        const { eventsQuery, createEvent } = useCalendarEvents();
        const events = (eventsQuery.data || []).map((e) => ({
                ...e,
                start: new Date(e.start_time),
                end: new Date(e.end_time),
        }));

        const [newEvent, setNewEvent] = useState({ title: "", date: "", type: "personal", color: "#10B981" });
        const [selectedEvent, setSelectedEvent] = useState(null);
        const [view, setView] = useState("month");

        const handleAdd = () => {
                if (!newEvent.title || !newEvent.date) return;
                createEvent({
                        title: newEvent.title,
                        start_time: newEvent.date + "T12:00:00Z",
                        end_time: newEvent.date + "T13:00:00Z",
                        event_type: newEvent.type,
                        metadata: { color: newEvent.color },
                });
                setNewEvent({ title: "", date: "", type: "personal", color: "#10B981" });
        };

        return (
                <div className="min-h-screen transition-colors bg-white text-black dark:bg-gray-900 dark:text-white">
                        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
                                <h1 className="text-3xl font-bold">Календарь</h1>

                                <div className="grid md:grid-cols-5 gap-6">
                                        {/* Левая колонка */}
                                        <div className="space-y-6 md:col-span-1">
                                                <div className="rounded-xl p-4 shadow bg-white dark:bg-gray-800">
                                                        <h2 className="text-lg font-semibold mb-3">Добавить событие</h2>
                                                        <input type="text" placeholder="Название" className="w-full mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                                                        <input type="date" className="w-full mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                                                        <select className="w-full mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
                                                                <option value="personal">Личное</option>
                                                                <option value="session">Сессия</option>
                                                                <option value="reminder">Напоминание</option>
                                                        </select>
                                                        <label className="block text-sm font-medium mb-1">Цвет события</label>
                                                        <input type="color" value={newEvent.color} onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })} className="w-full h-10 p-0 border-none bg-transparent mb-4" />
                                                        <button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2">
                                                                <Plus size={16} /> Новое событие
                                                        </button>
                                                </div>

                                                {selectedEvent && (
                                                        <div className="rounded-xl p-4 shadow bg-white dark:bg-gray-800">
                                                                <h2 className="text-lg font-semibold mb-2">Событие</h2>
                                                                <p className="text-sm"><strong>Название:</strong> {selectedEvent.title}</p>
                                                                <p className="text-sm"><strong>Тип:</strong> {selectedEvent.event_type}</p>
                                                                <p className="text-sm">
                                                                        <strong>Дата:</strong> {format(selectedEvent.start, "dd.MM.yyyy HH:mm")}
                                                                </p>
                                                        </div>
                                                )}
                                        </div>

                                        {/* Календарь */}
                                        <div className="md:col-span-4 rounded-xl shadow p-4 bg-white dark:bg-gray-800 custom-calendar-wrapper">
                                                <BigCalendar
                                                        localizer={localizer}
                                                        events={events}
                                                        startAccessor="start"
                                                        endAccessor="end"
                                                        style={{ height: 600 }}
                                                        views={['month', 'week', 'day']}
                                                        view={view}
                                                        onView={(v) => setView(v)}
                                                        defaultView="month"
                                                        messages={{
                                                                today: "Сегодня",
                                                                previous: "<",
                                                                next: ">",
                                                                month: "Месяц",
                                                                week: "Неделя",
                                                                day: "День",
                                                        }}
                                                        eventPropGetter={(event) => {
                                                                const backgroundColor = event.metadata?.color || "#10B981";
                                                                const isLight = backgroundColor === "#FACC15";

                                                                return {
                                                                        style: {
                                                                                backgroundColor,
                                                                                color: isLight ? "#1F2937" : "white",
                                                                                borderRadius: "0.5rem",
                                                                                padding: "6px 10px",
                                                                                fontWeight: 500,
                                                                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                                                cursor: "pointer",
                                                                                border: "none",
                                                                        },
                                                                };
                                                        }}

                                                        onSelectEvent={(event) => setSelectedEvent(event)}
                                                />
                                        </div>
                                </div>
                        </div>
                </div>
        );
}
