import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
        const [email, setEmail] = useState("");
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [rePassword, setRePassword] = useState("");
        const [error, setError] = useState("");
        const [success, setSuccess] = useState(false);

        const navigate = useNavigate();

        const handleRegister = async (e) => {
                e.preventDefault();
                setError("");

                if (password !== rePassword) {
                        setError("Пароли не совпадают");
                        return;
                }

                try {
                        const res = await fetch("http://localhost:8000/api/auth/users/", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email, username, password, re_password: rePassword }),
                        });

                        const data = await res.json();

                        if (!res.ok) {
                                const detail =
                                        data.email?.[0] ||
                                        data.username?.[0] ||
                                        data.password?.[0] ||
                                        data.detail ||
                                        "Ошибка регистрации";
                                throw new Error(detail);
                        }

                        setSuccess(true);
                        setTimeout(() => navigate("/login"), 1500);
                } catch (err) {
                        setError(err.message);
                }
        };

        return (
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors">
                        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-gray-900 dark:text-white">
                                <h2 className="text-3xl font-bold mb-6 text-center">Регистрация</h2>

                                {error && <div className="text-red-500 mb-3 text-center">{error}</div>}
                                {success && <div className="text-green-500 mb-3 text-center">Успешно! Перенаправление...</div>}

                                <form onSubmit={handleRegister} className="space-y-4">
                                        <Input
                                                type="text"
                                                placeholder="Никнейм"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                        />
                                        <Input
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Input
                                                type="password"
                                                placeholder="Пароль"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Input
                                                type="password"
                                                placeholder="Подтвердите пароль"
                                                value={rePassword}
                                                onChange={(e) => setRePassword(e.target.value)}
                                        />

                                        <button
                                                type="submit"
                                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition"
                                        >
                                                Зарегистрироваться
                                        </button>
                                </form>

                                <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                                        или войдите через:
                                </div>

                                <div className="flex justify-center mt-4 gap-4">
                                        <OAuthButton provider="Google" />
                                        <OAuthButton provider="VK" />
                                        <OAuthButton provider="GitHub" />
                                </div>
                        </div>
                </div>
        );
}

function Input({ type, placeholder, value, onChange }) {
        return (
                <input
                        type={type}
                        placeholder={placeholder}
                        className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={value}
                        onChange={onChange}
                        required
                />
        );
}

function OAuthButton({ provider }) {
        return (
                <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                        {provider}
                </button>
        );
}
