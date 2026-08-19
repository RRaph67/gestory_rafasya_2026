"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, defaultMode = "signin" }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState(defaultMode);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setMode(defaultMode);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  }, [defaultMode, open]);

  if (!open || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const trimmedEmail = email.trim();
    try {
      if (mode === "signin") {
        await signIn(trimmedEmail, password);
        onClose();
      } else {
        if (password !== confirmPassword) {
          setError("Password dan konfirmasi tidak cocok");
          setLoading(false);
          return;
        }
        await signUp(fullName.trim(), trimmedEmail, password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-300 p-4">
      {/* Modal Card */}
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-slate-100/80 animate-in zoom-in duration-300 relative overflow-hidden">
        {/* Decorative subtle background gradient blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h3 className="font-black text-2xl text-slate-800 tracking-tight">
              {mode === "signin" ? "Selamat Datang!" : "Buat Akun Baru"}
            </h3>
            <p className="text-slate-400 text-xs mt-1 font-medium">
              {mode === "signin" ? "Silakan masuk untuk melanjutkan belajar" : "Isi form di bawah untuk mulai berpetualang"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer font-bold animate-in duration-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">Nama Lengkap</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full border-2 border-slate-100 focus:border-blue-500 focus:bg-white bg-slate-50/50 rounded-2xl px-4 py-3 outline-none text-slate-700 text-sm transition-all font-semibold"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              type="email"
              className="w-full border-2 border-slate-100 focus:border-blue-500 focus:bg-white bg-slate-50/50 rounded-2xl px-4 py-3 outline-none text-slate-700 text-sm transition-all font-semibold"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              className="w-full border-2 border-slate-100 focus:border-blue-500 focus:bg-white bg-slate-50/50 rounded-2xl px-4 py-3 outline-none text-slate-700 text-sm transition-all font-semibold"
              required
            />
          </div>

          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">Konfirmasi Password</label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                className="w-full border-2 border-slate-100 focus:border-blue-500 focus:bg-white bg-slate-50/50 rounded-2xl px-4 py-3 outline-none text-slate-700 text-sm transition-all font-semibold"
                required
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              ⚠️ {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-blue-100 active:scale-95 disabled:opacity-50 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Memproses..." : mode === "signin" ? "Masuk ke Akun" : "Daftar Sekarang"}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer text-center"
            >
              {mode === "signin" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AuthModal;
