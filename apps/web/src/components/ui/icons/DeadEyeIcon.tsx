type IconProps = {
  className?: string;
};

export default function DeadEyeIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.585 10.587A2 2 0 0 0 13.414 13.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.364 5.365A10.477 10.477 0 0 1 12 5c5.25 0 8.777 4.123 9.764 5.412a1 1 0 0 1 0 1.176A17.847 17.847 0 0 1 18.56 15.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.12 18.633A10.96 10.96 0 0 1 12 19c-5.25 0-8.777-4.123-9.764-5.412a1 1 0 0 1 0-1.176A17.578 17.578 0 0 1 5.44 8.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}