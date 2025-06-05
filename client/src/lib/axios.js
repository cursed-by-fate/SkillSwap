import axios from "axios";


axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.withCredentials = true;

const api = axios.create({
        baseURL: "http://localhost:8000/api",
        withCredentials: true,
});

api.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
});

export default api;
