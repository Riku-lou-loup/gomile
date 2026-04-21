"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { logout } from "@/lib/auth-client";
import {
  buildDashboardAvatarLabel,
  buildDashboardUsername,
} from "@/lib/dashboard-session";
import {
  clearMerchantSession,
  getCurrentMerchantSession,
} from "@/lib/merchant-session";

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

function isMerchantRole(role: string) {
  return role === "MERCHANT" || role === "ADMIN";
}

function resolveDashboardUsername(user: { email: string }) {
  const merchantName = (user as { name?: string }).name;

  if (typeof merchantName === "string" && merchantName.trim().length > 0) {
    return merchantName.trim();
  }

  return buildDashboardUsername(user.email);
}

export function useDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [username, setUsername] = useState("Client");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isDarkMode = theme === "dark";
  const avatarLabel = buildDashboardAvatarLabel(username);

  useEffect(() => {
    window.localStorage.setItem("dashboardTheme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    let isActive = true;

    async function loadMerchantName() {
      try {
        const session = await getCurrentMerchantSession();

        if (!isActive || !isMerchantRole(session.user.role)) {
          return;
        }

        setUsername(resolveDashboardUsername(session.user));
      } catch {
        if (isActive) {
          setUsername("Client");
        }
      }
    }

    void loadMerchantName();

    return () => {
      isActive = false;
    };
  }, []);

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
      clearMerchantSession();

      const Swal = (await import("sweetalert2")).default;

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
    avatarLabel,
    handleLogout,
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
