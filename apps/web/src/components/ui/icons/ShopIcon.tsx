import { IconProps } from "./types";

export default function ShopIcon({
  className = "h-6 w-6",
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 9.5 5.5 5h13L20 9.5" />
      <path d="M5 10h14v9.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5V10Z" />
      <path d="M9 14h6" />
    </svg>
  );
}