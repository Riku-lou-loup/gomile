import { styles as authStyles } from "@/app/merchant/login/styles";

export const styles = {
  ...authStyles,
  card:
    "w-full max-w-[22rem] overflow-hidden rounded-[1.8rem] shadow-[0_26px_90px_rgba(24,58,92,0.18)] sm:max-w-[38rem] lg:max-w-[76rem]",
  stepper: "mt-6 rounded-[1.4rem] border border-slate-200 bg-slate-50/85 p-4",
  stepperList: "grid gap-3 md:grid-cols-3",
  stepperItem: "flex items-start gap-3 rounded-[1rem] px-3 py-3 transition",
  stepperItemActive: "bg-white shadow-[0_10px_25px_rgba(15,23,42,0.06)]",
  stepperItemDone: "bg-emerald-50",
  stepperItemPending: "bg-transparent",
  stepBadge:
    "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
  stepBadgeActive: "border-primary-light bg-primary-light text-white",
  stepBadgeDone: "border-emerald-200 bg-emerald-500 text-white",
  stepBadgePending: "border-slate-300 bg-white text-slate-600",
  stepCopy: "min-w-0",
  stepTitle: "text-sm font-semibold text-slate-900",
  stepDescription: "mt-1 text-xs leading-5 text-slate-500",

  stepSection: "mt-6",
  stepHeading: "text-left text-[1.25rem] !text-slate-900",
  stepText: "mt-2 text-sm leading-6 !text-slate-600",
  stepGrid: "mt-5 grid gap-4 md:grid-cols-2",
  stepGridSingle: "mt-5 grid gap-4",

  selectContainer: "",
  selectLabel:
    "mb-2 block text-sm font-medium leading-5 text-[var(--foreground)]",
  selectWrapper:
    "flex h-[3.75rem] items-center rounded-[1.4rem] border-2 border-slate-700/85 bg-white px-4 focus-within:!border-primary-light focus-within:ring-4 focus-within:ring-emerald-100 lg:h-[4.35rem]",
  selectField:
    "h-full w-full bg-transparent text-[1.05rem] text-slate-950 outline-none lg:text-[1.2rem]",
  selectIcon: "mr-3 flex shrink-0 items-center justify-center text-slate-700",
  selectError: "mt-2 text-sm font-medium leading-5 text-[var(--error)]",

  stepActions: "mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between",
  secondaryActionButton:
    "!h-[3.75rem] !min-w-[13rem] !rounded-[1.25rem] !border-2 !border-slate-200 !bg-white px-6 !text-[1rem] !font-bold uppercase tracking-[0.08em] !text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-[1px] hover:!bg-white hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)] lg:!h-[4.4rem] lg:!text-[1.08rem]",
  primaryActionButton:
    "!min-w-[13rem]",

  footerLink:
    "font-semibold text-sky-800 transition hover:text-sky-950",
};
