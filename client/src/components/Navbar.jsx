import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Sun, Bell, Home, Search, MessageCircle, Calendar, User, Star, ClipboardList } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import clsx from "classnames";

export default function Navbar() {
        const location = useLocation();
        const navigate = useNavigate();
        const { theme, toggleTheme } = useTheme();
        const { user, logout, isLoading } = useAuth();
        const { unreadCount, recentNotifications } = useNotifications();
        const [mobileOpen, setMobileOpen] = useState(false);
        const [dropdownOpen, setDropdownOpen] = useState(false);

        const menuItems = [
                { label: "Главная", path: "/dashboard", icon: <Home size={18} /> },
                { label: "Поиск", path: "/search", icon: <Search size={18} /> },
                { label: "Чаты", path: "/chat", icon: <MessageCircle size={18} /> },
                { label: "Календарь", path: "/calendar", icon: <Calendar size={18} /> },
                { label: "Профиль", path: "/profile", icon: <User size={18} /> },
                { label: "Отзывы", path: "/reviews", icon: <Star size={18} /> },
                { label: "Мои сессии", path: "/sessions", icon: <ClipboardList size={18} /> },
        ];

        const handleLogout = () => {
                logout();
                navigate("/login");
        };

        useEffect(() => {
                const close = (e) => {
                        if (!e.target.closest("#notif-bell")) setDropdownOpen(false);
                };
                document.addEventListener("click", close);
                return () => document.removeEventListener("click", close);
        }, []);

        return (
                <nav className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                                <Link to="/" className="font-bold text-xl text-white">
                                        SkillSwap
                                </Link>

                                <div className="hidden md:flex items-center space-x-6">
                                        {!isLoading && user && (
                                                menuItems.map(({ label, path, icon }) => (
                                                        <Link
                                                                key={path}
                                                                to={path}
                                                                className={clsx(
                                                                        "flex items-center gap-1 hover:text-blue-400 transition",
                                                                        location.pathname === path && "text-blue-400"
                                                                )}
                                                        >
                                                                {icon}
                                                                {label}
                                                        </Link>
                                                ))
                                        )}

                                        {/* 🔔 Уведомления */}
                                        <div className="relative" id="notif-bell">
                                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative hover:text-blue-400">
                                                        <Bell size={22} />
                                                        {unreadCount > 0 && (
                                                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                                                        {unreadCount}
                                                                </span>
                                                        )}
                                                </button>
                                                {dropdownOpen && (
                                                        <NotificationsDropdown
                                                                notifications={recentNotifications}
                                                                onClose={() => setDropdownOpen(false)}
                                                        />
                                                )}
                                        </div>

                                        {/* 🌗 Тема */}
                                        <button
                                                onClick={toggleTheme}
                                                className="hover:text-blue-400 transition"
                                                title="Переключить тему"
                                        >
                                                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                                        </button>

                                        {/* 🔐 Аутентификация */}
                                        {!isLoading && user ? (
                                                <button
                                                        onClick={handleLogout}
                                                        className="ml-4 text-red-400 hover:text-red-500"
                                                >
                                                        Выйти
                                                </button>
                                        ) : (
                                                <>
                                                        <Link to="/login" className="ml-4 hover:text-blue-400">
                                                                Вход
                                                        </Link>
                                                        <Link to="/register" className="ml-2 hover:text-blue-400">
                                                                Регистрация
                                                        </Link>
                                                </>
                                        )}
                                </div>

                                {/* Бургер для мобильных */}
                                <div className="md:hidden">
                                        <button onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
                                </div>
                        </div>

                        {/* Мобильное меню */}
                        {mobileOpen && (
                                <div className="md:hidden mt-2 space-y-2 px-4">
                                        {menuItems.map(({ label, path }) => (
                                                <Link
                                                        key={path}
                                                        to={path}
                                                        onClick={() => setMobileOpen(false)}
                                                        className={clsx(
                                                                "block hover:text-blue-400 transition",
                                                                location.pathname === path && "text-blue-400"
                                                        )}
                                                >
                                                        {label}
                                                </Link>
                                        ))}

                                        <button
                                                onClick={() => {
                                                        toggleTheme();
                                                        setMobileOpen(false);
                                                }}
                                                className="block hover:text-blue-400"
                                        >
                                                {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                                        </button>

                                        {!isLoading && user ? (
                                                <button
                                                        onClick={() => {
                                                                handleLogout();
                                                                setMobileOpen(false);
                                                        }}
                                                        className="block text-red-400 hover:text-red-500"
                                                >
                                                        Выйти
                                                </button>
                                        ) : (
                                                <>
                                                        <Link to="/login" className="block hover:text-blue-400">Вход</Link>
                                                        <Link to="/register" className="block hover:text-blue-400">Регистрация</Link>
                                                </>
                                        )}
                                </div>
                        )}
                </nav>
        );
}
