"use client";

import Link from "next/link";
import { type ReactNode } from "react";

import Navbar from "@/components/dashboard/navbar";
import ActiveDeliveries from "@/components/dashboard/active-delivery";
import Footer from "@/components/ui/design-system/header_footer/footer";
import Navigation from "@/components/ui/header/navigation";
import GrenobleDeliveryMap from "@/components/dashboard/grenoble-delivery-map";
import IncidentsAlerts from "@/components/dashboard/incidents-alerts";
import { Logo } from "@/components/Logo/Logo";
import { activeDeliveries } from "@/dummiesData/activeDeliveries";
import { incidents } from "@/dummiesData/incidentAlert";
import { mapMarkers } from "@/dummiesData/mapMarkers";
import { dashboardMenuItems } from "./dashboard-menu";
import ProfileSlot from "./profile-slot";
import { cn, styles } from "./style";
import { useDashboard } from "./use-dashboard";

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
  const {
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
  } = useDashboard();

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

          <Navbar items={dashboardMenuItems} isDarkMode={isDarkMode} />
        </aside>

        <div className={styles.mainPanel}>
          <Navigation
            theme={theme}
            onChange={setTheme}
            isDarkMode={isDarkMode}
            rightSlot={
              <ProfileSlot
                initials={initials}
                isDarkMode={isDarkMode}
                isLoggingOut={isLoggingOut}
                menuItems={dashboardMenuItems}
                menuRef={menuRef}
                onClose={closeProfileMenu}
                onLogout={handleLogout}
                onToggle={toggleProfileMenu}
                profileMenuOpen={profileMenuOpen}
                username={username}
              />
            }
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
