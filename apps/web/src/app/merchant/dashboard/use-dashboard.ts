"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { logout } from "@/lib/auth-client";

export type ThemeMode = "light" | "dark";

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("dashboardTheme");
  return storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : "light";
}

function getStoredUsername() {
  if (typeof window === "undefined") {
    return "Client";
  }

  return window.localStorage.getItem("username") || "Client";
}

function buildInitials(username: string) {
  return (
    username
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk.charAt(0).toUpperCase())
      .join("") || "CL"
  );
}

export function useDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [username, setUsername] = useState(getStoredUsername);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isDarkMode = theme === "dark";
  const initials = buildInitials(username);

  useEffect(() => {
    window.localStorage.setItem("dashboardTheme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function toggleProfileMenu() {
    setProfileMenuOpen((value) => !value);
  }

  function closeProfileMenu() {
    setProfileMenuOpen(false);
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();

      const Swal = (await import("sweetalert2")).default;

      window.localStorage.removeItem("username");
      setUsername("Client");
      setProfileMenuOpen(false);

      await Swal.fire({
        icon: "success",
        title: "Deconnexion reussie",
        text: "Vous etes déconnecté avec succès.",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      router.replace("/");
      router.refresh();
    } catch (error) {
      const Swal = (await import("sweetalert2")).default;

      await Swal.fire({
        icon: "error",
        title: "Deconnexion impossible",
        text:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue pendant la deconnexion.",
        confirmButtonText: "Fermer",
        confirmButtonColor: "#d95757",
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return {
    closeProfileMenu,
    handleLogout,
    initials,
    isDarkMode,
    isLoggingOut,
    menuRef,
    profileMenuOpen,
    setTheme,
    theme,
    toggleProfileMenu,
    username,
  };
}
