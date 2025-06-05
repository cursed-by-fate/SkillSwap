import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 💡 Мокаем useAuth
const mockUser = {
        id: "mock-user-1",
        email: "mockuser@example.com",
        first_name: "Mock",
        last_name: "User",
};

export default function Login() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loginStatus, setLoginStatus] = useState("idle");
        const [loginError, setLoginError] = useState(null);
        const [user, setUser] = useState(null);

        const navigate = useNavigate();

        const handleLogin = (e) => {
                e.preventDefault();
                setLoginStatus("pending");
                setLoginError(null);

                // 💬 Фиктивная авторизация
                setTimeout(() => {
                        if (email === "user@example.com" && password === "password") {
                                localStorage.setItem("accessToken", "mock-access");
                                localStorage.setItem("refreshToken", "mock-refresh");
                                setUser(mockUser);
                                setLoginStatus("success");
                        } else {
                                setLoginError({ message: "Неверный email или пароль" });
                                setLoginStatus("error");
                        }
                }, 1000);
        };

        useEffect(() => {
                if (user) {
                        navigate("/");
                }
        }, [user, navigate]);

        return (
                <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
                        <div className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-xl text-gray-900 dark:text-white">
                                <h2 className="text-3xl font-bold mb-6 text-center">Вход</h2>

                                {loginError && (
                                        <div className="text-red-500 mb-4 text-center">
                                                {loginError.message}
                                        </div>
                                )}

                                <form onSubmit={handleLogin} className="space-y-4">
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
                                        <button
                                                type="submit"
                                                disabled={loginStatus === "pending"}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
                                        >
                                                {loginStatus === "pending" ? "Входим..." : "Войти"}
                                        </button>
                                </form>

                                <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                                        или войдите через:
                                </div>

                                <div className="flex justify-center mt-4 space-x-4">
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
                        value={value}
                        onChange={onChange}
                        required
                        className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
        );
}

function OAuthButton({ provider }) {
        return (
                <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded">
                        {provider}
                </button>
        );
}
