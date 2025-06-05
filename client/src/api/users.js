// src/api/users.js
import api from "@/lib/axios";

export async function searchUsers(query = "") {
        const response = await api.get("/users/", {
                params: { search: query },
        });
        return response.data;
}
