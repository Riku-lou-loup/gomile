import type { DashboardMenuItem } from "@/components/dashboard/navbar-items";
import AlertIcon from "@/components/ui/icons/AlertIcon";
import HomeIcon from "@/components/ui/icons/HomeIcon";
import SettingIcon from "@/components/ui/icons/SettingIcon";
import ShopIcon from "@/components/ui/icons/ShopIcon";
import TruckIcon from "@/components/ui/icons/TrucIcon";

export const dashboardMenuItems: DashboardMenuItem[] = [
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
