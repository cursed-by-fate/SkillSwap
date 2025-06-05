import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun, Bell } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationsDropdown from "@/components/NotificationsDropdown"; // 👈 не забудь создать этот файл

export default function Navbar() {
        const location = useLocation();
        const navigate = useNavigate();
        const { theme, toggleTheme } = useTheme();
        const { user, logout, isLoading } = useAuth();
        const { unreadCount, recentNotifications } = useNotifications();
        const [mobileOpen, setMobileOpen] = useState(false);
        const [dropdownOpen, setDropdownOpen] = useState(false);

        const menuItems = [
                { label: "Главная", path: "/dashboard" },
                { label: "Поиск", path: "/search" },
                { label: "Чаты", path: "/chat" },
                { label: "Календарь", path: "/calendar" },
                { label: "Профиль", path: "/profile" },
        ];

        const handleLogout = () => {
                logout();
                navigate("/login");
        };

        // Закрытие дропдауна по клику вне
        useEffect(() => {
                const close = (e) => {
                        if (!e.target.closest("#notif-bell")) setDropdownOpen(false);
                };
                document.addEventListener("click", close);
                return () => document.removeEventListener("click", close);
        }, []);

        return (
                <nav className="bg-gray-900 dark:bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                                {/* Логотип */}
                                <div className="text-xl font-bold">
                                        <Link to="/" className="font-bold text-xl text-white">
                                                SkillSwap
                                        </Link>
                                </div>

                                {/* Меню */}
                                <div className="hidden md:flex space-x-6 items-center">
                                        {menuItems.map((item) => (
                                                <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        className={`hover:text-blue-400 ${location.pathname === item.path ? "text-blue-400" : ""}`}
                                                >
                                                        {item.label}
                                                </Link>
                                        ))}

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

                                        {/* 🌗 Переключение темы */}
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

                                {/* Mobile burger */}
                                <div className="md:hidden">
                                        <button onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
                                </div>
                        </div>

                        {/* Мобильное меню */}
                        {mobileOpen && (
                                <div className="md:hidden mt-2 space-y-2 px-4">
                                        {menuItems.map((item) => (
                                                <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        className="block hover:text-blue-400"
                                                        onClick={() => setMobileOpen(false)}
                                                >
                                                        {item.label}
                                                </Link>
                                        ))}

                                        {/* Мобильный переключатель темы */}
                                        <button
                                                onClick={() => {
                                                        toggleTheme();
                                                        setMobileOpen(false);
                                                }}
                                                className="block hover:text-blue-400"
                                        >
                                                {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                                        </button>

                                        {/* Мобильный выход / вход */}
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
                                                        <Link
                                                                to="/login"
                                                                className="block hover:text-blue-400"
                                                                onClick={() => setMobileOpen(false)}
                                                        >
                                                                Вход
                                                        </Link>
                                                        <Link
                                                                to="/register"
                                                                className="block hover:text-blue-400"
                                                                onClick={() => setMobileOpen(false)}
                                                        >
                                                                Регистрация
                                                        </Link>
                                                </>
                                        )}
                                </div>
                        )}
                </nav>
        );
}
