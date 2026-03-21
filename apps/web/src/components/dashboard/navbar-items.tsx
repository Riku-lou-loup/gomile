import { cn, styles } from "@/app/merchant/dashboard/style";
import Link from "next/link";
import type { ReactElement } from "react";
import { IconProps } from "../ui/icons/types";


export type DashboardMenuItem = {
  label: string;
  href: string;
  icon: (props: IconProps) => ReactElement;
  active?: boolean;
};

type NavbarItemProps = DashboardMenuItem & {
  compact?: boolean;
  onNavigate?: () => void;
  isDarkMode: boolean;
};

export default function NavbarItem({
  href,
  label,
  active,
  icon: Icon,
  compact = false,
  onNavigate,
  isDarkMode,
}: NavbarItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        styles.navbarItemBase,
        compact ? styles.navbarItemCompact : styles.navbarItemDefault,
        active
          ? isDarkMode
            ? styles.navbarItemActiveDark
            : styles.navbarItemActiveLight
          : isDarkMode
            ? styles.navbarItemInactiveDark
            : styles.navbarItemInactiveLight,
      )}
    >
      <span
        className={cn(
          active
            ? isDarkMode
              ? styles.navbarIconActiveDark
              : styles.navbarIconActiveLight
            : isDarkMode
              ? styles.navbarIconInactiveDark
              : styles.navbarIconInactiveLight,
        )}
      >
        <Icon className={styles.iconLarge} />
      </span>

      <span>{label}</span>
    </Link>
  );
}