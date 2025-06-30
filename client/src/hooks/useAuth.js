// Почти без изменений
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as authApi from "@/api/auth";

export const useAuth = () => {
        const queryClient = useQueryClient();
        const navigate = useNavigate();

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

        const loginMutation = useMutation({
                mutationFn: authApi.login,
                onSuccess: async (user) => {
                        queryClient.setQueryData(["currentUser"], user);
                        navigate("/dashboard");
                },
                onError: (err) => {
                        console.error("Ошибка при входе", err);
                },
        });

        const logoutMutation = useMutation({
                mutationFn: authApi.logout,
                onSuccess: async () => {
                        await queryClient.cancelQueries(); // ⛔ останови текущие
                        queryClient.removeQueries({ queryKey: ["currentUser"] });
                        navigate("/login");
                },
                onError: (err) => {
                        console.error("Ошибка при выходе", err);
                },
        });

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
