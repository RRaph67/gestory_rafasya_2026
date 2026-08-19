"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pointer, LayoutDashboard, Compass, BookOpen, User, LogOut, Settings, Award } from "lucide-react";
import { AuthModal } from "@/components/molecules/AuthModal/AuthModal";
import { useAuth } from "@/hooks/useAuth";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 group">
          <div className="relative">
            <span className="text-[34px] leading-none font-black text-blue-600 tracking-tighter drop-shadow-sm">
              G
            </span>
            <Pointer className="absolute -top-2 left-2.5 w-4.5 h-4.5 text-slate-800 fill-white -rotate-12 group-hover:scale-125 transition-transform" />
          </div>
          <span className="text-[28px] leading-none font-black text-slate-700 tracking-tight mt-0.5">
            estory
          </span>
        </Link>

        {/* Nav Links (removed non-MVP fitur link) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-bold px-3 py-2 rounded-xl transition-all duration-200 ${
              isActive("/")
                ? "text-blue-600 bg-blue-50/50"
                : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            }`}
          >
            Beranda
          </Link>
          {user && (
            <Link
              href="/materi"
              className={`text-sm font-bold px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive("/materi")
                  ? "text-blue-600 bg-blue-50/50"
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              Materi
            </Link>
          )}
          <Link
            href="/leaderboard"
            className={`text-sm font-bold px-3 py-2 rounded-xl transition-all duration-200 ${
              isActive("/leaderboard")
                ? "text-blue-600 bg-blue-50/50"
                : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            }`}
          >
            Leaderboard
          </Link>
        </div>

        {/* Profile Menu / Auth Buttons */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          <AuthButtonsAndProfile setDropdownOpen={setDropdownOpen} dropdownOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
        </div>
      </div>
    </nav>
  );
};

const AuthButtonsAndProfile: React.FC<{ setDropdownOpen: (v: boolean) => void; dropdownOpen: boolean; onClose: () => void }> = ({ setDropdownOpen, dropdownOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"signin" | "signup">("signin");

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setModalMode("signin");
            setModalOpen(true);
          }}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-blue-100 active:scale-95 cursor-pointer"
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setModalMode("signup");
            setModalOpen(true);
          }}
          className="px-5 py-2.5 bg-white border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50/30 text-slate-700 hover:text-blue-600 rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer"
        >
          Sign Up
        </button>
        <AuthModal open={modalOpen} defaultMode={modalMode} onClose={() => setModalOpen(false)} />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-100">
          {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
        </div>
        <span className="hidden sm:inline text-sm font-bold text-slate-700">{user.full_name || user.email || "User"}</span>
        <span className="text-[10px] text-slate-400">▼</span>
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 py-4 px-5 z-50">
          <div className="mt-2 space-y-1">
            <div className="px-3 py-3 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Signed in as</p>
              <p className="text-sm font-bold text-slate-900 truncate">{user.full_name || user.email}</p>
            </div>
            <Link href="/materi" className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all font-bold text-sm">Materi</Link>
            <div className="border-t border-slate-100 my-2" />
            <button
              onClick={() => {
                signOut().then(() => {
                  window.location.href = "/";
                }).catch(() => {
                  window.location.href = "/";
                });
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-red-500 hover:bg-red-50/50 transition-all font-bold text-sm text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
