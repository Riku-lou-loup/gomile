"use client";

import { useEffect, useState } from "react";
import Navigation from "./navigation";


type ThemeMode = "light" | "dark";

export default function NavigationDefault() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("dashboardTheme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  }, []);
  useEffect(() => {
    window.localStorage.setItem("dashboardTheme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  return (
    <Navigation
      theme={theme}
      isDarkMode={theme === "dark"}
      onChange={setTheme}
    />
  );
}