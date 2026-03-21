"use client";
import { cn, styles } from "@/app/merchant/dashboard/style";
import SunIcon from "../icons/SunIcon";
import MoonIcon from "../icons/MoonIcon";

type ThemeMode = "light" | "dark";
type ModeToggleProps = {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
  isDarkMode: boolean;
};

export default function ModeToggle({
  theme,
  onChange,
  isDarkMode,
}: ModeToggleProps) {
  return (
    <div
      className={cn(
        styles.modeToggle,
        isDarkMode ? styles.modeToggleDark : styles.modeToggleLight,
      )}
    >
      <button
        type="button"
        onClick={() => onChange("light")}
        aria-label="Mode lumière"
        className={cn(
          styles.modeButton,
          theme === "light"
            ? styles.modeButtonActiveLight
            : isDarkMode
              ? styles.modeButtonInactiveDark
              : styles.modeButtonInactiveLight,
        )}
      >
        <SunIcon className={styles.iconMedium} />
      </button>

      <button
        type="button"
        onClick={() => onChange("dark")}
        aria-label="Mode sombre"
        className={cn(
          styles.modeButton,
          theme === "dark"
            ? styles.modeButtonActiveDark
            : isDarkMode
              ? styles.modeButtonInactiveDark
              : styles.modeButtonInactiveLight,
        )}
      >
        <MoonIcon className={styles.iconMedium} />
      </button>
    </div>
  );
}