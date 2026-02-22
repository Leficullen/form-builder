"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-[72px] h-[36px]" />;
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Switch
      id="theme-mode"
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      className="!h-[36px] !w-[70px] border-[3px] border-primary bg-background data-[state=checked]:!bg-background rounded-full transition-colors duration-300"
      thumbClassName="!h-[28px] !w-[28px] data-[state=checked]:!translate-x-[34px] data-[state=unchecked]:!translate-x-[2px] bg-hover dark:!bg-primary shadow-sm transition-all duration-500 ease-in-out"
      icon={
        isDark ? (
          <Moon className="h-[18px] w-[18px] text-white transition-opacity duration-300" />
        ) : (
          <Sun className="h-[18px] w-[18px] text-orange-400 transition-opacity duration-300" />
        )
      }
    />
  );
}
