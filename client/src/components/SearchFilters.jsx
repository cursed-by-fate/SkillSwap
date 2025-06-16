import { motion } from "framer-motion";

export default function SearchFilters({ filters, setFilters }) {
        return (
                <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6"
                >
                        <input
                                type="text"
                                placeholder="Навык, который преподаёт"
                                className="p-2 rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-700"
                                value={filters.teaches}
                                onChange={(e) => setFilters({ ...filters, teaches: e.target.value })}
                        />

                        <input
                                type="text"
                                placeholder="Навык, который хочет изучить"
                                className="p-2 rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-700"
                                value={filters.learns}
                                onChange={(e) => setFilters({ ...filters, learns: e.target.value })}
                        />

                        <input
                                type="number"
                                placeholder="Минимум отзывов"
                                className="p-2 rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-700"
                                value={filters.minReviews}
                                onChange={(e) =>
                                        setFilters({ ...filters, minReviews: parseInt(e.target.value) || 0 })
                                }
                        />

                        <input
                                type="text"
                                placeholder="Город"
                                className="p-2 rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-700"
                                value={filters.city}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        />

                        <label className="flex items-center gap-2 text-sm">
                                <input
                                        type="checkbox"
                                        checked={filters.onlyTeach}
                                        onChange={(e) => setFilters({ ...filters, onlyTeach: e.target.checked })}
                                />
                                Только преподаватели
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                                <input
                                        type="checkbox"
                                        checked={filters.onlyLearn}
                                        onChange={(e) => setFilters({ ...filters, onlyLearn: e.target.checked })}
                                />
                                Только учащиеся
                        </label>
                </motion.div>
        );
}
