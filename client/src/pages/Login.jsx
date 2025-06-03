import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [error, setError] = useState("");
        const navigate = useNavigate();

        const handleLogin = async (e) => {
                e.preventDefault();
                setError("");

                try {
                        const res = await fetch("http://localhost:8000/api/auth/jwt/create/", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email, password }),
                        });

                        const data = await res.json();

                        if (!res.ok) {
                                throw new Error(data.detail || "Ошибка входа");
                        }

                        localStorage.setItem("access", data.access);
                        localStorage.setItem("refresh", data.refresh);

                        navigate("/");
                } catch (err) {
                        setError(err.message);
                }
        };

        return (
                <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
                        <div className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-xl text-gray-900 dark:text-white">
                                <h2 className="text-3xl font-bold mb-6 text-center">Вход</h2>

                                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                                <form onSubmit={handleLogin} className="space-y-4">
                                        <input
                                                type="email"
                                                placeholder="Email"
                                                className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                        />
                                        <input
                                                type="password"
                                                placeholder="Пароль"
                                                className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                        />
                                        <button
                                                type="submit"
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
                                        >
                                                Войти
                                        </button>
                                </form>

                                <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                                        или войдите через:
                                </div>

                                <div className="flex justify-center mt-4 space-x-4">
                                        <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded">
                                                Google
                                        </button>
                                        <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded">
                                                VK
                                        </button>
                                        <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded">
                                                GitHub
                                        </button>
                                </div>
                        </div>
                </div>
        );
}
