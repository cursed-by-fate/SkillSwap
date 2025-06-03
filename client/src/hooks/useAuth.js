import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "@/api/auth";

export const useAuth = () => {
        const queryClient = useQueryClient();

        const { data: user, isLoading } = useQuery(["currentUser"], authApi.fetchCurrentUser, {
                retry: false,
        });

        const loginMutation = useMutation(authApi.login, {
                onSuccess: () => queryClient.invalidateQueries(["currentUser"]),
        });

        const logoutMutation = useMutation(authApi.logout, {
                onSuccess: () => queryClient.invalidateQueries(["currentUser"]),
        });

        return {
                user,
                isLoading,
                login: loginMutation.mutate,
                logout: logoutMutation.mutate,
        };
};
