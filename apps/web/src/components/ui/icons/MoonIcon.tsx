import { IconProps } from "./types";

export default function MoonIcon({
  className = "h-5 w-5",
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
      <path d="M20.2 14.2A8.7 8.7 0 1 1 9.8 3.8a7.1 7.1 0 1 0 10.4 10.4Z" />
    </svg>
  );
}