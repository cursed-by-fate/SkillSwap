// /api/chat.js
export async function getChats() {
        const res = await fetch("/api/chats/", {
                headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
        });
        if (!res.ok) throw new Error("Не удалось загрузить чаты");
        return res.json();
}

export async function getMessages(chatId) {
        const res = await fetch(`/api/chats/${chatId}/messages/`, {
                headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
        });
        if (!res.ok) throw new Error("Не удалось загрузить сообщения");
        return res.json();
}

export async function sendMessage({ chat, content, message_type = "text" }) {
        const res = await fetch("/api/messages/", {
                method: "POST",
                headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ chat, content, message_type }),
        });
        if (!res.ok) throw new Error("Ошибка при отправке сообщения");
        return res.json();
}
