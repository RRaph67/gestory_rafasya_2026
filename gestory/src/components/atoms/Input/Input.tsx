import React from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Input: React.FC<InputProps> = ({
  variant = "outline",
  size = "md",
  className,
  icon,
  iconPosition = "left",
  ...props
}) => {
  const baseStyles = "font-medium transition-all rounded focus:outline-none focus:ring-2";

  const variantStyles = {
    default: "bg-slate-50 border border-slate-100 text-slate-700 focus:ring-blue-100",
    outline: "bg-white border border-slate-200 text-slate-700 focus:ring-blue-100",
    filled: "bg-slate-100 border-0 text-slate-700 focus:ring-blue-100",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3.5 py-2.5 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const containerClasses = icon ? "relative flex items-center" : "";
  const inputClasses = icon ? (iconPosition === "left" ? "pl-8" : "pr-8") : "";

  return (
    <div className={containerClasses}>
      {icon && iconPosition === "left" && (
        <div className="absolute left-3 text-slate-400">{icon}</div>
      )}
      <input
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${inputClasses} ${className} w-full`}
        {...props}
      />
      {icon && iconPosition === "right" && (
        <div className="absolute right-3 text-slate-400">{icon}</div>
      )}
    </div>
  );
};
