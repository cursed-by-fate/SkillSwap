// ✅ useAuth.js для react-query v5 + автологин после регистрации
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// import * as authApi from "@/api/auth";
// import * as authApi from "@/api/auth";
import * as authApi from "@/api/auth.mock"; // ← временно

export const useAuth = () => {
        const queryClient = useQueryClient();
        const navigate = useNavigate();

        const { data: user, isLoading } = useQuery({
                queryKey: ["currentUser"],
                queryFn: authApi.fetchCurrentUser,
                retry: false,
        });

        const loginMutation = useMutation({
                mutationFn: authApi.login,
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
                        navigate("/dashboard");
                },
        });

        const logoutMutation = useMutation({
                mutationFn: authApi.logout,
                onSuccess: () => {
                        queryClient.removeQueries({ queryKey: ["currentUser"] });
                        navigate("/login");
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
        });

        return {
                user,
                isLoading,
                login: loginMutation.mutate,
                loginStatus: loginMutation.status,
                loginError: loginMutation.error,

                logout: logoutMutation.mutate,

                register: registerMutation.mutate,
                registerStatus: registerMutation.status,
                registerError: registerMutation.error,
        };
};
