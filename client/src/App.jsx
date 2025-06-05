import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Chat from "./pages/Chat";
import CalendarPage from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import ReviewsPage from "@/pages/Reviews";
import NotificationsPage from "@/pages/Notifications";
import SessionsPage from "@/pages/Sessions";

import { useEffect } from "react";
import useTheme from "@/hooks/useTheme";

export default function App() {
  const { theme } = useTheme();

  useEffect(() => {
    // Применяем класс "dark" к <html> элементу
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
        <Route path="/search" element={<Search />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
