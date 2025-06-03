// src/hooks/useTheme.js
import { useEffect, useState } from "react";

export default function useTheme() {
        const [theme, setTheme] = useState(() => {
                if (typeof window !== "undefined") {
                        return localStorage.getItem("theme") || "dark";
                }
                return "dark";
        });

        useEffect(() => {
                const root = document.documentElement;
                if (theme === "dark") {
                        root.classList.add("dark");
                        localStorage.setItem("theme", "dark");
                } else {
                        root.classList.remove("dark");
                        localStorage.setItem("theme", "light");
                }
        }, [theme]);

        const toggleTheme = () => {
                setTheme((prev) => (prev === "dark" ? "light" : "dark"));
        };

        return { theme, toggleTheme };
}
