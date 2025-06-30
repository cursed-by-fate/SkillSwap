import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
// ❌ Удалено: import Chat from "./pages/Chat"; // Конфликтует с ChatPage
import CalendarPage from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import ReviewsPage from "@/pages/Reviews";
import NotificationsPage from "@/pages/Notifications";
import SessionsPage from "@/pages/Sessions";
import VideoCall from "./pages/VideoCall";
import ChatPage from "@/pages/Chat"; // ✅ Используется как основной чат
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

import { useEffect } from "react";
import useTheme from "@/hooks/useTheme";

export default function App() {
  useNotificationSocket();
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/video-call/:chatId" element={<VideoCall />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  );
}
