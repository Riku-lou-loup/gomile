export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const styles = {
  page: "flex min-h-screen flex-col transition-colors",
  pageLight: "bg-[#edf3e7] text-slate-900",
  pageDark: "bg-slate-950 text-slate-100",

  layout: "flex flex-1",

  sidebar: "hidden border-r lg:flex lg:w-[19rem] lg:flex-col",
  sidebarLight: "border-slate-200 bg-white",
  sidebarDark: "border-slate-800 bg-slate-900",

  sidebarHeader: "border-b px-6 py-6",
  sidebarHeaderLight: "border-slate-200",
  sidebarHeaderDark: "border-slate-800",

  sidebarLogoLink: "inline-flex items-center",
  sidebarNav: "grid gap-3 px-4 py-5",

  mainPanel: "min-w-0 flex-1",
  main: "px-4 py-5 sm:px-6 lg:px-8 lg:py-6",

  topBar: "mb-6 flex flex-wrap items-center gap-3",
  mobileLogoWrapper: "lg:hidden",
  mobileLogoLink: "inline-flex items-center rounded-[1.2rem] px-2 py-1",

  toolbar: "ml-auto flex items-center gap-3",

  modeToggle: "inline-flex items-center rounded-full border p-1 shadow-sm",
  modeToggleLight: "border-slate-200 bg-white",
  modeToggleDark: "border-slate-700 bg-slate-900",

  modeButton:
    "inline-flex h-10 w-10 items-center justify-center rounded-full transition",
  modeButtonActiveLight:
    "bg-[#86ba2f] text-white shadow-[0_8px_18px_rgba(134,186,47,0.28)]",
  modeButtonActiveDark:
    "bg-slate-950 text-white shadow-[0_8px_18px_rgba(15,23,42,0.35)]",
  modeButtonInactiveLight: "text-slate-600 hover:bg-slate-100",
  modeButtonInactiveDark: "text-slate-300 hover:bg-slate-800",

  profileMenuWrapper: "relative",

  profileTrigger:
    "flex items-center gap-3 rounded-full border px-2 py-1.5 shadow-sm",
  profileTriggerLight: "border-slate-200 bg-white",
  profileTriggerDark: "border-slate-700 bg-slate-900",

  profileAvatar:
    "flex min-h-11 min-w-11 max-w-[9rem] items-center justify-center rounded-full px-3 text-xs font-bold transition sm:text-sm",
  profileAvatarLight: "bg-[#86ba2f] text-white hover:bg-[#79ab29]",
  profileAvatarDark: "bg-emerald-700 text-white hover:bg-emerald-600",

  profileNameWrapper: "hidden pr-2 sm:block",
  profileName: "text-sm font-semibold",
  profileNameLight: "text-slate-900",
  profileNameDark: "text-slate-100",

  dropdown:
    "absolute right-0 top-[calc(100%+0.75rem)] z-30 w-[18rem] rounded-[1.4rem] border p-3 shadow-[0_24px_60px_rgba(15,23,42,0.18)]",
  dropdownLight: "border-slate-200 bg-white",
  dropdownDark: "border-slate-800 bg-slate-900",

  dropdownHeader: "mb-3 rounded-[1rem] px-3 py-3",
  dropdownHeaderLight: "bg-slate-50",
  dropdownHeaderDark: "bg-slate-800",

  dropdownNav: "grid gap-2",

  logoutButton:
    "flex items-center gap-3 rounded-[1.05rem] border px-3 py-3 text-left text-sm font-semibold transition",
  logoutButtonLight: "border-slate-200 text-rose-600 hover:bg-rose-50",
  logoutButtonDark: "border-slate-700 text-rose-300 hover:bg-slate-800",
  logoutButtonDisabled: "cursor-not-allowed opacity-70",
  logoutIconWrapper:
    "inline-flex h-8 w-8 items-center justify-center rounded-full bg-current/10",

  surfaceCard:
    "rounded-[2rem] border p-5 shadow-[0_18px_50px_rgba(88,117,52,0.08)] lg:p-6",
  surfaceCardLight: "border-[#d9e7cf] bg-white",
  surfaceCardDark: "border-slate-800 bg-slate-900",

  mapGrid:
    "grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(23rem,0.95fr)]",

  mapSection:
    "relative min-h-[42rem] overflow-hidden rounded-[1.75rem] border shadow-[0_16px_40px_rgba(15,23,42,0.06)]",
  mapSectionLight: "border-[#d6dfcf] bg-[#f8f8f1]",
  mapSectionDark: "border-slate-800 bg-slate-950",

  deliveriesSection:
    "rounded-[1.75rem] border shadow-[0_16px_40px_rgba(15,23,42,0.06)]",
  deliveriesSectionLight: "border-[#d6dfcf] bg-white",
  deliveriesSectionDark: "border-slate-800 bg-slate-900",

  deliveriesHeader: "border-b px-5 py-5",
  deliveriesHeaderLight: "border-slate-200",
  deliveriesHeaderDark: "border-slate-800",

  sectionTitle: "font-display text-[2rem] font-bold",

  tableOverflow: "overflow-x-auto",
  deliveriesTableMin: "min-w-[44rem]",

  deliveriesTableHead:
    "grid grid-cols-[8rem_1.4fr_1.1fr_1fr] gap-3 border-b px-5 py-4 text-[1.05rem] font-semibold",
  deliveriesTableHeadLight: "border-slate-200 text-slate-700",
  deliveriesTableHeadDark: "border-slate-800 text-slate-300",

  deliveriesDividerLight: "divide-y divide-slate-200",
  deliveriesDividerDark: "divide-y divide-slate-800",

  deliveryRow:
    "grid grid-cols-[8rem_1.4fr_1.1fr_1fr] gap-3 px-5 py-4 text-[1.02rem]",
  deliveryIdentity: "flex items-center gap-3",
  deliveryAvatar:
    "flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold",
  deliveryId: "font-display text-[1.9rem] font-bold leading-none",
  deliveryDestination: "flex items-center font-medium",
  deliveryStatusWrap: "flex items-center",
  deliveryEtaWrap: "flex items-center text-[1.08rem] font-semibold",
  deliveryNoteLight: "block text-sm font-medium text-slate-500",
  deliveryNoteDark: "block text-sm font-medium text-slate-400",

  statusBadge:
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
  statusLateLight: "bg-amber-50 text-amber-700",
  statusLateDark: "bg-amber-950/60 text-amber-300",
  statusOnTimeLight: "bg-emerald-50 text-emerald-700",
  statusOnTimeDark: "bg-emerald-950/60 text-emerald-300",
  statusLateIcon: "text-amber-500",
  statusOnTimeIcon: "text-emerald-500",

  incidentsCard: "mt-6",
  incidentsHeaderLight: "border-b border-slate-200 pb-4",
  incidentsHeaderDark: "border-b border-slate-800 pb-4",

  incidentsTableWrapperLight:
    "mt-5 overflow-x-auto rounded-[1.5rem] border border-slate-200",
  incidentsTableWrapperDark:
    "mt-5 overflow-x-auto rounded-[1.5rem] border border-slate-800",

  incidentsTableMin: "min-w-[48rem]",
  incidentsTableHead:
    "grid grid-cols-[8rem_10rem_minmax(0,1fr)_10rem] gap-4 px-5 py-4 text-[1.05rem] font-semibold",
  incidentsTableHeadLight: "bg-slate-50 text-slate-700",
  incidentsTableHeadDark: "bg-slate-950 text-slate-300",

  incidentsTableBodyLight: "divide-y divide-slate-200 bg-white",
  incidentsTableBodyDark: "divide-y divide-slate-800 bg-slate-900",

  incidentRow:
    "grid grid-cols-[8rem_10rem_minmax(0,1fr)_10rem] gap-4 px-5 py-5 text-[1.05rem]",
  incidentId: "font-display text-[1.9rem] font-bold leading-none",
  incidentTypeLight: "font-semibold text-slate-700",
  incidentTypeDark: "font-semibold text-slate-300",
  incidentDescriptionLight: "font-medium text-slate-700",
  incidentDescriptionDark: "font-medium text-slate-300",
  incidentBadgeWrap: "flex justify-end",

  incidentBadge:
    "inline-flex min-w-[7rem] items-center justify-center rounded-full px-4 py-2 text-sm font-bold tracking-[0.05em] text-white",
  incidentBadgeCancelled:
    "bg-[linear-gradient(180deg,#d95757_0%,#b92d2d_100%)]",
  incidentBadgeInProgress:
    "bg-[linear-gradient(180deg,#f5b34b_0%,#d8901f_100%)]",

  navbarItemBase:
    "flex items-center gap-3 rounded-[1.05rem] border font-semibold transition",
  navbarItemCompact: "px-3 py-3 text-sm",
  navbarItemDefault: "px-4 py-4 text-[1.05rem]",

  navbarItemActiveLight:
    "border-[#8cb83f] bg-[#f7fbe9] text-slate-950 shadow-[0_6px_18px_rgba(136,176,56,0.12)]",
  navbarItemActiveDark:
    "border-emerald-700 bg-emerald-900/40 text-white shadow-[0_6px_18px_rgba(0,0,0,0.2)]",

  navbarItemInactiveLight:
    "border-transparent text-slate-800 hover:border-slate-200 hover:bg-slate-50",
  navbarItemInactiveDark:
    "border-transparent text-slate-200 hover:border-slate-700 hover:bg-slate-800",

  navbarIconActiveLight: "text-[#628e20]",
  navbarIconActiveDark: "text-emerald-300",
  navbarIconInactiveLight: "text-slate-500",
  navbarIconInactiveDark: "text-slate-400",

  iconLarge: "h-6 w-6",
  iconMedium: "h-5 w-5",
};
