import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "interactive";
}

export const Card: React.FC<CardProps> = ({
  className = "",
  children,
  onClick,
  variant = "default",
}) => {
  const baseStyles = "rounded-lg border bg-white shadow-sm";

  const variantStyles = {
    default: "border-slate-200",
    interactive:
      "border-slate-200 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
