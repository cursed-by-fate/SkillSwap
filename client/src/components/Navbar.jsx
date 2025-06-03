import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated, logout } from "@/auth";
import { Moon, Sun } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export default function Navbar() {
        const location = useLocation();
        const navigate = useNavigate();
        const { theme, toggleTheme } = useTheme();
        const [mobileOpen, setMobileOpen] = useState(false);
        const [auth, setAuth] = useState(isAuthenticated());

        useEffect(() => {
                setAuth(isAuthenticated());
        }, [location]);

        const handleLogout = () => {
                logout();
                setAuth(false);
                navigate("/login");
        };

        const menuItems = [
                { label: "Главная", path: "/dashboard" },
                { label: "Поиск", path: "/search" },
                { label: "Чаты", path: "/chat" },
                { label: "Календарь", path: "/calendar" },
                { label: "Профиль", path: "/profile" },
        ];

        return (
                <nav className="bg-gray-900 dark:bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                                {/* Логотип */}
                                <div className="text-xl font-bold">
                                        <Link to="/" className="font-bold text-xl text-white">SkillSwap</Link>
                                </div>

                                {/* Десктоп меню */}
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

                                        {/* Кнопка темы */}
                                        <button
                                                onClick={toggleTheme}
                                                className="hover:text-blue-400 transition"
                                                title="Переключить тему"
                                        >
                                                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                                        </button>

                                        {auth ? (
                                                <button
                                                        onClick={handleLogout}
                                                        className="ml-4 text-red-400 hover:text-red-500"
                                                >
                                                        Выйти
                                                </button>
                                        ) : (
                                                <>
                                                        <Link to="/login" className="ml-4 hover:text-blue-400">Вход</Link>
                                                        <Link to="/register" className="ml-2 hover:text-blue-400">Регистрация</Link>
                                                </>
                                        )}
                                </div>

                                {/* Мобильное меню (бургер) */}
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

                                        {/* Кнопка темы (моб) */}
                                        <button
                                                onClick={() => {
                                                        toggleTheme();
                                                        setMobileOpen(false);
                                                }}
                                                className="block hover:text-blue-400"
                                        >
                                                {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                                        </button>

                                        {auth ? (
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
