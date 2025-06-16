import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserCard({ user, currentUserId, onStartChat }) {
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`;
        const avatarUrl =
                user.profile_image_url ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name || user.email}`;

        return (
                <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        layout
                        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
                >
                        <div className="flex items-center gap-4 mb-4">
                                <motion.img
                                        loading="lazy"
                                        src={avatarUrl}
                                        alt="avatar"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.3 }}
                                        className="w-16 h-16 rounded-full border"
                                />
                                <div>
                                        <motion.h2
                                                className="text-lg font-semibold"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                        >
                                                {fullName}
                                        </motion.h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                        {user.city && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.city}</p>
                                        )}
                                </div>
                        </div>

                        <div className="mb-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Обучает:</p>
                                <div className="flex flex-wrap gap-1">
                                        {user.teachSkills?.length > 0 ? (
                                                user.teachSkills.map((s) => (
                                                        <motion.span
                                                                key={s.id}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs"
                                                        >
                                                                {s.skill?.name}
                                                        </motion.span>
                                                ))
                                        ) : (
                                                <span className="text-xs text-gray-400">не указано</span>
                                        )}
                                </div>
                        </div>

                        <div className="mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Хочет изучить:</p>
                                <div className="flex flex-wrap gap-1">
                                        {user.learnSkills?.length > 0 ? (
                                                user.learnSkills.map((s) => (
                                                        <motion.span
                                                                key={s.id}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs"
                                                        >
                                                                {s.skill?.name}
                                                        </motion.span>
                                                ))
                                        ) : (
                                                <span className="text-xs text-gray-400">не указано</span>
                                        )}
                                </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-auto">
                                <Link
                                        to={`/profile/${user.id}`}
                                        className="w-full text-center bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white py-2 rounded"
                                >
                                        Профиль
                                </Link>
                                {user.id !== currentUserId && (
                                        <motion.button
                                                onClick={onStartChat}
                                                whileTap={{ scale: 0.97 }}
                                                whileHover={{ scale: 1.02 }}
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                                        >
                                                Написать
                                        </motion.button>
                                )}
                        </div>
                </motion.div>
        );
}
