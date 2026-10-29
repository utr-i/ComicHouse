"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className="flex items-center gap-2 rounded-full border border-gray-400 px-3 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      {theme === "light" ? (
        <>
          <Moon size={16} />
        </>
      ) : (
        <>
          <Sun size={16} />
        </>
      )}
    </button>
  );
}