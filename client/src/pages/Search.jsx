import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getOrCreateChat } from "@/api/chat";
import { useDebounce } from "@/hooks/useDebounce";
import SearchFilters from "@/components/SearchFilters";
import UserCard from "@/components/UserCard";
import SortDropdown from "@/components/SortDropdown";
import { motion, AnimatePresence } from "framer-motion";

export default function Search() {
        const { data: users = [], isLoading, isError } = useUsers();
        const { user: currentUser } = useAuth();
        const navigate = useNavigate();

        const [query, setQuery] = useState("");
        const [filters, setFilters] = useState({
                teaches: "",
                learns: "",
                minReviews: 0,
                city: "",
                onlyTeach: false,
                onlyLearn: false,
        });
        const [sortBy, setSortBy] = useState("reviews");
        const [visibleCount, setVisibleCount] = useState(6);

        const loadMoreRef = useRef(null);

        const debouncedQuery = useDebounce(query, 300);
        const tokens = debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean);

        const filtered = useMemo(() => {
                return users.filter((u) => {
                        const fullName = `${u.first_name || ""} ${u.last_name || ""}`;
                        const email = u.email || "";
                        const teach = u.teachSkills?.map((s) => s.skill?.name.toLowerCase() || "") || [];
                        const learn = u.learnSkills?.map((s) => s.skill?.name.toLowerCase() || "") || [];

                        const matchesQuery =
                                !tokens.length ||
                                tokens.some((token) =>
                                        fullName.toLowerCase().includes(token) ||
                                        email.toLowerCase().includes(token) ||
                                        teach.some((skill) => skill.includes(token)) ||
                                        learn.some((skill) => skill.includes(token))
                                );

                        const teachesMatch =
                                !filters.teaches ||
                                teach.some((skill) => skill.includes(filters.teaches.toLowerCase()));

                        const learnsMatch =
                                !filters.learns ||
                                learn.some((skill) => skill.includes(filters.learns.toLowerCase()));

                        const reviewMatch = (u.reviews?.length || 0) >= filters.minReviews;

                        const cityMatch =
                                !filters.city ||
                                (u.city?.toLowerCase().includes(filters.city.toLowerCase()));

                        const teachOnlyMatch = !filters.onlyTeach || teach.length > 0;
                        const learnOnlyMatch = !filters.onlyLearn || learn.length > 0;

                        return (
                                matchesQuery &&
                                teachesMatch &&
                                learnsMatch &&
                                reviewMatch &&
                                cityMatch &&
                                teachOnlyMatch &&
                                learnOnlyMatch
                        );
                });
        }, [users, filters, tokens]);

        const sorted = useMemo(() => {
                return [...filtered].sort((a, b) => {
                        if (sortBy === "reviews") {
                                return (b.reviews?.length || 0) - (a.reviews?.length || 0);
                        }
                        if (sortBy === "name") {
                                return a.first_name?.localeCompare(b.first_name || "") || 0;
                        }
                        if (sortBy === "city") {
                                return (a.city || "").localeCompare(b.city || "");
                        }
                        return 0;
                });
        }, [filtered, sortBy]);

        const visibleUsers = sorted.slice(0, visibleCount);

        const handleStartChat = async (partnerId) => {
                try {
                        const chat = await getOrCreateChat(partnerId);
                        navigate(`/chat/${chat.id}`);
                } catch (err) {
                        console.error("Ошибка при открытии чата", err);
                }
        };

        const handleObserver = useCallback((entries) => {
                const target = entries[0];
                if (target.isIntersecting) {
                        setVisibleCount((prev) => prev + 6);
                }
        }, []);

        useEffect(() => {
                const observer = new IntersectionObserver(handleObserver, {
                        root: null,
                        rootMargin: "0px",
                        threshold: 1.0,
                });
                if (loadMoreRef.current) {
                        observer.observe(loadMoreRef.current);
                }
                return () => {
                        if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
                };
        }, [handleObserver]);

        return (
                <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
                        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
                                <h1 className="text-2xl font-bold mb-4">Поиск пользователей</h1>

                                <motion.input
                                        type="text"
                                        placeholder="Поиск по имени, email, навыкам..."
                                        className="w-full p-3 mb-4 rounded bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                />

                                <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />

                                <SearchFilters filters={filters} setFilters={setFilters} />

                                {isLoading && (
                                        <motion.div
                                                className="animate-pulse space-y-4"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.4 }}
                                        >
                                                {[...Array(6)].map((_, i) => (
                                                        <motion.div
                                                                key={i}
                                                                className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: i * 0.1 }}
                                                        />
                                                ))}
                                        </motion.div>
                                )}

                                {isError && <p className="text-red-500">Ошибка загрузки</p>}

                                {!isLoading && !visibleUsers.length && (
                                        <p className="text-gray-500 text-center">😕 Пользователи не найдены</p>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <AnimatePresence mode="popLayout">
                                                {visibleUsers.map((u) => (
                                                        <UserCard
                                                                key={u.id}
                                                                user={u}
                                                                currentUserId={currentUser?.id}
                                                                onStartChat={() => handleStartChat(u.id)}
                                                        />
                                                ))}
                                        </AnimatePresence>
                                </div>

                                <div ref={loadMoreRef} className="h-10" />
                        </div>
                </div>
        );
}
