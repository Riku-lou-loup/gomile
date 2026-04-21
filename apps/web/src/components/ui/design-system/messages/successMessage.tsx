import React from "react";
import TypeMessage from "./typeMessage";

interface SuccessMessageProps {
  children: React.ReactNode;
  className?: string;
}

export default function SuccessMessage({
  children,
  className,
}: SuccessMessageProps) {
  return (
    <TypeMessage variant="success" className={className}>
      {children}
    </TypeMessage>
  );
}