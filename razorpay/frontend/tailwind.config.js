/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#3B82F6",
        "background-light": "#F3F4F6",
        "background-dark": "#111827",
        "text-light": "#1F2937",
        "text-dark": "#F9FAFB",
        "text-secondary-light": "#6B7281",
        "text-secondary-dark": "#9CA3AF",
        "card-light": "#FFFFFF",
        "card-dark": "#1F2937",
        "border-light": "#E5E7EB",
        "border-dark": "#374151",
        "success": "#10B981",
        "error": "#EF4444"
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
    },
  },
  plugins: [],
  darkMode: "class",
}
