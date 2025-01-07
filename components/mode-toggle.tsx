import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="fixed bottom-4 right-4">
      {theme === "dark" ? (
        <button
          onClick={() => setTheme("light")}
          className="p-2 rounded-full hover:bg-primary-foreground transition"
        >
          <Sun className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={() => setTheme("dark")}
          className="p-2 rounded-full hover:bg-primary-foreground transition"
        >
          <Moon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
