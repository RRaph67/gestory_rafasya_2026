"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  icon?: React.ReactNode;
  label: string;
  badge?: number;
}

export const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  badge,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all relative ${
        isActive
          ? "bg-blue-100 text-blue-700 font-semibold"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {badge && badge > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};
