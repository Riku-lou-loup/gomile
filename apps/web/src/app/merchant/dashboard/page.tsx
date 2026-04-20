"use client";

import { DashboardMenuItem } from "@/components/dashboard/navbar-items";
import AlertIcon from "@/components/ui/icons/AlertIcon";
import HomeIcon from "@/components/ui/icons/HomeIcon";
import SettingIcon from "@/components/ui/icons/SettingIcon";
import ShopIcon from "@/components/ui/icons/ShopIcon";
import TruckIcon from "@/components/ui/icons/TrucIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn, styles } from "./style";
import { logout } from "@/lib/auth-client";
import Typography from "@/components/ui/design-system/typography";
import Navbar from "@/components/dashboard/navbar";
import LogoutIcon from "@/components/ui/icons/LogoutIcon";
import { Logo } from "@/components/Logo/Logo";
import Navigation from "@/components/ui/header/navigation";
import GrenobleDeliveryMap from "@/components/dashboard/grenoble-delivery-map";
import { mapMarkers } from "@/dummiesData/mapMarkers";
import ActiveDeliveries from "@/components/dashboard/active-delivery";
import { activeDeliveries } from "@/dummiesData/activeDeliveries";
import IncidentsAlerts from "@/components/dashboard/incidents-alerts";
import { incidents } from "@/dummiesData/incidentAlert";
import Footer from "@/components/ui/design-system/header_footer/footer";

type ThemeMode = "light" | "dark";

const menuItems: DashboardMenuItem[] = [
  { label: "Vue d'ensemble", href: "/merchant/dashboard", icon: HomeIcon },
  { label: "Mes commandes", href: "/merchant/dashboard", icon: ShopIcon },
  {
    label: "Suivi livraisons",
    href: "/merchant/dashboard",
    icon: TruckIcon,
    active: true,
  },
  { label: "Alertes client", href: "/merchant/dashboard", icon: AlertIcon },
  { label: "Parametres", href: "/merchant/dashboard", icon: SettingIcon },
];

function SurfaceCard({
  children,
  className,
  isDarkMode,
}: {
  children: ReactNode;
  className?: string;
  isDarkMode: boolean;
}) {
  return (
    <div
      className={cn(
        styles.surfaceCard,
        isDarkMode ? styles.surfaceCardDark : styles.surfaceCardLight,
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [username, setUsername] = useState("Client");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isDarkMode = theme === "dark";

  const initials =
    username
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk.charAt(0).toUpperCase())
      .join("") || "CL";

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("dashboardTheme");
    const storedUsername = window.localStorage.getItem("username");

    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

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
        title: "Vous etes deconnecte",
        text: "Vous etes deconnectes.",
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

  const profileSlot = (
    <div ref={menuRef} className={styles.profileMenuWrapper}>
      <div
        className={cn(
          styles.profileTrigger,
          isDarkMode
            ? styles.profileTriggerDark
            : styles.profileTriggerLight,
        )}
      >
        <button
          type="button"
          onClick={() => setProfileMenuOpen((value) => !value)}
          aria-haspopup="menu"
          aria-expanded={profileMenuOpen}
          className={cn(
            styles.profileAvatar,
            isDarkMode
              ? styles.profileAvatarDark
              : styles.profileAvatarLight,
          )}
        >
          <Typography
            variant="span"
            Component="span"
            weight="bold"
            className="!text-inherit"
          >
            {initials}
          </Typography>
        </button>

        <div className={styles.profileNameWrapper}>
          <Typography
            variant="span"
            Component="span"
            weight="semibold"
            className={cn(
              styles.profileName,
              isDarkMode
                ? styles.profileNameDark
                : styles.profileNameLight,
            )}
          >
            {username}
          </Typography>
        </div>
      </div>

      {profileMenuOpen ? (
        <div
          className={cn(
            styles.dropdown,
            isDarkMode ? styles.dropdownDark : styles.dropdownLight,
          )}
        >
          <div
            className={cn(
              styles.dropdownHeader,
              isDarkMode
                ? styles.dropdownHeaderDark
                : styles.dropdownHeaderLight,
            )}
          >
            <Typography
              variant="p"
              Component="p"
              weight="semibold"
              className={cn(
                styles.profileName,
                isDarkMode
                  ? styles.profileNameDark
                  : styles.profileNameLight,
              )}
            >
              {username}
            </Typography>
          </div>

          <Navbar
            items={menuItems}
            compact={true}
            isDarkMode={isDarkMode}
            onNavigate={() => setProfileMenuOpen(false)}
            className={styles.dropdownNav}
          />

          <div className={styles.dropdownNav}>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn(
                styles.logoutButton,
                isDarkMode
                  ? styles.logoutButtonDark
                  : styles.logoutButtonLight,
                isLoggingOut && styles.logoutButtonDisabled,
              )}
            >
              <span className={styles.logoutIconWrapper}>
                <LogoutIcon />
              </span>

              <Typography
                variant="span"
                Component="span"
                weight="semibold"
                className="!text-inherit"
              >
                {isLoggingOut ? "Deconnexion..." : "Deconnexion"}
              </Typography>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      className={cn(
        styles.page,
        isDarkMode ? styles.pageDark : styles.pageLight,
      )}
    >
      <div className={styles.layout}>
        <aside
          className={cn(
            styles.sidebar,
            isDarkMode ? styles.sidebarDark : styles.sidebarLight,
          )}
        >
          <div
            className={cn(
              styles.sidebarHeader,
              isDarkMode ? styles.sidebarHeaderDark : styles.sidebarHeaderLight,
            )}
          >
            <Link href="/" className={styles.sidebarLogoLink}>
              <Logo size="lg" />
            </Link>
          </div>

          <Navbar items={menuItems} isDarkMode={isDarkMode} />
        </aside>

        <div className={styles.mainPanel}>
          <Navigation
            theme={theme}
            onChange={setTheme}
            isDarkMode={isDarkMode}
            rightSlot={profileSlot}
          />

          <main className={styles.main}>
            <SurfaceCard isDarkMode={isDarkMode}>
              <div className={styles.mapGrid}>
                <section
                  className={cn(
                    styles.mapSection,
                    isDarkMode ? styles.mapSectionDark : styles.mapSectionLight,
                  )}
                >
                  <GrenobleDeliveryMap markers={mapMarkers} />
                </section>

                <ActiveDeliveries
                  deliveries={activeDeliveries}
                  isDarkMode={isDarkMode}
                />
              </div>
            </SurfaceCard>

            <SurfaceCard
              className={styles.incidentsCard}
              isDarkMode={isDarkMode}
            >
              <IncidentsAlerts
                incidents={incidents}
                isDarkMode={isDarkMode}
              />
            </SurfaceCard>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}