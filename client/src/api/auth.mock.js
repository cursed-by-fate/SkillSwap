export async function fetchCurrentUser() {
        return {
                id: "mock-user-1",
                email: "mockuser@example.com",
                first_name: "Mock",
                last_name: "User",
        };
}

export async function login({ email, password }) {
        localStorage.setItem("accessToken", "mock-access");
        localStorage.setItem("refreshToken", "mock-refresh");
        return fetchCurrentUser();
}

export async function logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
}

export async function register({ email, username, password, re_password }) {
        localStorage.setItem("accessToken", "mock-access");
        localStorage.setItem("refreshToken", "mock-refresh");
        return {
                id: "mock-user-1",
                email,
                first_name: username,
                last_name: "",
                tokens: {
                        access: "mock-access",
                        refresh: "mock-refresh",
                },
        };
}

