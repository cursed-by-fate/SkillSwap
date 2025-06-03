/** @type {import('tailwindcss').Config} */
export default {
        darkMode: 'class', // важно!
        content: [
                "./index.html",
                "./src/**/*.{js,jsx}",
        ],
        theme: {
                extend: {},
        },
        plugins: [],
        safelist: ["bg-white", "bg-gray-900"],
};
