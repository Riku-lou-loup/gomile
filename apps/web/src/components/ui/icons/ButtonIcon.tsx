import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonIconProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
};

export default function ButtonIcon({
  icon,
  type = "button",
  className = "",
  ...props
}: ButtonIconProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center align-middle ${className}`.trim()}
      {...props}
    >
      {icon}
    </button>
  );
}