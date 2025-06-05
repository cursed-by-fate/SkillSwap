import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as authApi from "@/api/auth"; // подключение к API

export const useAuth = () => {
        const queryClient = useQueryClient();
        const navigate = useNavigate();

        const accessToken = localStorage.getItem("accessToken");

        // 📌 Получение текущего пользователя
        const {
                data: user,
                isLoading,
                isError,
        } = useQuery({
                queryKey: ["currentUser"],
                queryFn: authApi.fetchCurrentUser,
                enabled: !!accessToken,        // Только если токен есть
                refetchOnMount: true,
                refetchOnWindowFocus: false,
                retry: false,
        });

        // 🔐 Вход
        const loginMutation = useMutation({
                mutationFn: authApi.login,
                onSuccess: async () => {
                        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
                        navigate("/dashboard");
                },
                onError: (err) => {
                        console.error("Ошибка при входе", err);
                },
        });

        // 🚪 Выход
        const logoutMutation = useMutation({
                mutationFn: authApi.logout,
                onSuccess: () => {
                        queryClient.removeQueries({ queryKey: ["currentUser"] });
                        navigate("/login");
                },
                onError: (err) => {
                        console.error("Ошибка при выходе", err);
                },
        });

        // 🆕 Регистрация
        const registerMutation = useMutation({
                mutationFn: authApi.register,
                onSuccess: async () => {
                        try {
                                const currentUser = await authApi.fetchCurrentUser();
                                queryClient.setQueryData(["currentUser"], currentUser);
                                navigate("/dashboard");
                        } catch (error) {
                                console.error("Ошибка при загрузке пользователя после регистрации", error);
                        }
                },
                onError: (err) => {
                        console.error("Ошибка при регистрации", err);
                },
        });

        return {
                user,
                isLoading,
                isError,

                login: loginMutation.mutate,
                loginStatus: loginMutation.status,
                loginError: loginMutation.error,

                logout: logoutMutation.mutate,

                register: registerMutation.mutate,
                registerStatus: registerMutation.status,
                registerError: registerMutation.error,
        };
};
