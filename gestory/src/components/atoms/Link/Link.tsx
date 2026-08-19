import React from "react";
import Link from "next/link";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  external?: boolean;
}

export const NavLink: React.FC<LinkProps> = ({
  href,
  variant = "primary",
  children,
  external = false,
  className = "",
  ...props
}) => {
  const variantStyles = {
    primary: "text-blue-600 hover:text-blue-700 underline",
    secondary: "text-slate-600 hover:text-slate-700",
    ghost: "text-slate-700 hover:underline",
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${variantStyles[variant]} transition-colors ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`${variantStyles[variant]} transition-colors ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};
