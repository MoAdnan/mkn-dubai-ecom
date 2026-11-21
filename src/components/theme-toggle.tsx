"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="w-9 h-9 rounded-full flex items-center justify-center border border-border/60 bg-background/50 text-muted-foreground opacity-50"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full flex items-center justify-center border border-border/80 bg-background/60 hover:bg-accent/40 text-foreground transition-all duration-200 hover:border-cyan-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-cyan-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-violet-600 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}

