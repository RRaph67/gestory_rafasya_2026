"use client";
import React from "react";
import Link from "next/link";
import { BookOpen, Settings, Award } from "lucide-react";
import { NavItem } from "../../molecules/NavItem";

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className = "",
  collapsed = false,
}) => {
  const menuItems = [
    {
      label: "Materi",
      href: "/materi",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: <Award className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-slate-200 p-4 flex flex-col transition-all ${className}`}
    >
      {/* Logo */}
      <div className="mb-8 font-bold text-blue-600">
        {!collapsed && <span>Gestory</span>}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      {/* Settings */}
      <div className="border-t border-slate-200 pt-4">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-all">
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Pengaturan</span>}
        </button>
      </div>
    </aside>
  );
};
