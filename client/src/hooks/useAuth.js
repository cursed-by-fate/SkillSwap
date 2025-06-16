import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as authApi from "@/api/auth";

export const useAuth = () => {
        const queryClient = useQueryClient();
        const navigate = useNavigate();

        // 📌 Получение текущего пользователя
        const {
                data: user,
                isLoading,
                isError,
        } = useQuery({
                queryKey: ["currentUser"],
                queryFn: authApi.fetchCurrentUser,
                refetchOnMount: true,
                refetchOnWindowFocus: false,
                retry: false,
        });

        // 🔐 Вход
        const loginMutation = useMutation({
                mutationFn: authApi.login,
                onSuccess: async (user) => {
                        queryClient.setQueryData(["currentUser"], user); // ⬅️ вручную ставим после login()
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
