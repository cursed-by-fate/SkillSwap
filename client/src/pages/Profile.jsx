import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
        const { user } = useAuth();
        const queryClient = useQueryClient();

        const [isEditing, setIsEditing] = useState(false);
        const [form, setForm] = useState(null);

        useEffect(() => {
                if (user) {
                        setForm({
                                first_name: user.first_name || "",
                                last_name: user.last_name || "",
                                email: user.email || "",
                                bio: user.bio || "",
                                location: user.location || "",
                                teach: (user.teachSkills || []).map((s) => ({
                                        name: s.skill.name,
                                        level: s.level || "",
                                })),
                                learn: (user.learnSkills || []).map((s) => ({
                                        name: s.skill.name,
                                        level: s.level || "",
                                })),
                        });
                }
        }, [user]);

        const handleSkillChange = (type, index, field, value) => {
                setForm((prev) => {
                        const updated = [...prev[type]];
                        updated[index][field] = value;
                        return { ...prev, [type]: updated };
                });
        };

        const handleAddSkill = (type) => {
                setForm((prev) => ({
                        ...prev,
                        [type]: [...prev[type], { name: "", level: "" }],
                }));
        };

        const handleRemoveSkill = (type, index) => {
                setForm((prev) => {
                        const updated = [...prev[type]];
                        updated.splice(index, 1);
                        return { ...prev, [type]: updated };
                });
        };

        const handleSave = async () => {
                const payload = {
                        first_name: form.first_name,
                        last_name: form.last_name,
                        email: form.email,
                        bio: form.bio,
                        location: form.location,
                        teachSkills: form.teach.filter((s) => s.name),
                        learnSkills: form.learn.filter((s) => s.name),
                };

                try {
                        await updateProfile(payload);
                        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
                        setIsEditing(false);
                        toast.success("Профиль успешно обновлён");
                } catch (err) {
                        console.error("Ошибка при обновлении профиля", err);
                        toast.error("Ошибка при обновлении профиля");
                }
        };

        if (!user || !form) return <div className="p-6">Загрузка...</div>;

        return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 md:p-10 transition-colors">
                        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="colored" />
                        <div className="max-w-4xl mx-auto space-y-8">
                                {isEditing && (
                                        <Modal title="Редактировать профиль" onClose={() => setIsEditing(false)} onSave={handleSave}>
                                                <FormInput label="Имя" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
                                                <FormInput label="Фамилия" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
                                                <FormInput label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                                <FormInput label="Биография" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                                                <FormInput label="Город" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />

                                                <SkillList label="Навыки (обучаю)" skills={form.teach} onChange={(i, f, v) => handleSkillChange("teach", i, f, v)} onAdd={() => handleAddSkill("teach")} onRemove={(i) => handleRemoveSkill("teach", i)} />
                                                <SkillList label="Навыки (изучаю)" skills={form.learn} onChange={(i, f, v) => handleSkillChange("learn", i, f, v)} onAdd={() => handleAddSkill("learn")} onRemove={(i) => handleRemoveSkill("learn", i)} />
                                        </Modal>
                                )}

                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex flex-col sm:flex-row items-center gap-6">
                                        <img
                                                src={user.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name}`}
                                                alt="avatar"
                                                className="w-24 h-24 rounded-full border"
                                        />
                                        <div>
                                                <h2 className="text-2xl font-bold">{user.first_name} {user.last_name}</h2>
                                                <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
                                                <button onClick={() => setIsEditing(true)} className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                                                        Редактировать профиль
                                                </button>
                                        </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <SkillBlock title="Могу обучать:" skills={user.teachSkills?.map((s) => `${s.skill.name} (${s.level})`)} />
                                        <SkillBlock title="Хочу изучить:" skills={user.learnSkills?.map((s) => `${s.skill.name} (${s.level})`)} />
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-2">
                                        <p><strong>Город:</strong> {user.location || <span className="text-gray-400">Не указано</span>}</p>
                                        <p><strong>О себе:</strong> {user.bio || <span className="text-gray-400">Пока ничего не написано</span>}</p>
                                </div>
                        </div>
                </div>
        );
}

function SkillList({ label, skills, onChange, onAdd, onRemove }) {
        return (
                <div className="mb-4">
                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">{label}</label>
                        {skills.map((skill, index) => (
                                <div key={index} className="flex gap-2 items-center mb-2">
                                        <input
                                                className="w-1/2 p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                                                placeholder="Навык"
                                                value={skill.name}
                                                onChange={(e) => onChange(index, "name", e.target.value)}
                                        />
                                        <select
                                                className="w-1/3 p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                                                value={skill.level}
                                                onChange={(e) => onChange(index, "level", e.target.value)}
                                        >
                                                <option value="">Уровень</option>
                                                <option value="beginner">Начинающий</option>
                                                <option value="intermediate">Средний</option>
                                                <option value="advanced">Продвинутый</option>
                                        </select>
                                        <button onClick={() => onRemove(index)} className="text-red-500 text-xl">×</button>
                                </div>
                        ))}
                        <button onClick={onAdd} className="mt-1 text-blue-600 text-sm hover:underline">+ Добавить навык</button>
                </div>
        );
}

function SkillBlock({ title, skills }) {
        return (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
                        {skills?.length ? (
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-200 space-y-1">
                                        {skills.map((skill, i) => (
                                                <li key={i}>{skill}</li>
                                        ))}
                                </ul>
                        ) : (
                                <p className="text-gray-400">Навыков пока нет</p>
                        )}
                </div>
        );
}

function FormInput({ label, ...props }) {
        return (
                <div className="mb-3">
                        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">{label}</label>
                        <input
                                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                                {...props}
                        />
                </div>
        );
}

function Modal({ title, children, onClose, onSave }) {
        return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md relative flex flex-col max-h-[90vh]">
                                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                                        <h2 className="text-xl font-semibold">{title}</h2>
                                        {children}
                                </div>
                                <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
                                        <button onClick={onClose} className="px-4 py-2 border rounded dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Отмена
                                        </button>
                                        <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                                Сохранить
                                        </button>
                                </div>
                                <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl">×</button>
                        </div>
                </div>
        );
}