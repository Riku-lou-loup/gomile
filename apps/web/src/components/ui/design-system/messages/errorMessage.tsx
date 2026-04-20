import React from "react";
import TypeMessage from "./typeMessage";

interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export default function ErrorMessage({
  children,
  className,
}: ErrorMessageProps) {
  return (
    <TypeMessage variant="error" className={className}>
      {children}
    </TypeMessage>
  );
}