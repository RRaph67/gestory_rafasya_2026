"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Medal, Crown, ArrowLeft, RefreshCw, Calendar, Award } from "lucide-react";
import { gameService } from "@/services/gameService";

interface LeaderboardEntry {
  rank: number;
  score: number;
  playerName: string;
  date: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameService.getGameLeaderboard(10);
      if (response && response.success && Array.isArray(response.data)) {
        setLeaderboard(response.data);
      } else {
        setError("Gagal mengambil data papan peringkat.");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Separate top 3 and others
  const topThree = leaderboard.filter((item) => item.rank <= 3);
  const otherRanks = leaderboard.filter((item) => item.rank > 3);

  // Helper for styling podium positions
  const getPodiumStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          cardBg: "bg-linear-to-b from-amber-50 to-yellow-100/30 border-amber-200 shadow-amber-100",
          medalColor: "text-yellow-500",
          badgeBg: "bg-yellow-500",
          height: "h-64 md:h-72",
          crown: true,
        };
      case 2:
        return {
          cardBg: "bg-linear-to-b from-slate-50 to-slate-100/30 border-slate-200 shadow-slate-100",
          medalColor: "text-slate-400",
          badgeBg: "bg-slate-400",
          height: "h-56 md:h-64",
          crown: false,
        };
      case 3:
        return {
          cardBg: "bg-linear-to-b from-amber-50/50 to-amber-100/20 border-amber-100 shadow-amber-50",
          medalColor: "text-amber-600",
          badgeBg: "bg-amber-600",
          height: "h-48 md:h-56",
          crown: false,
        };
      default:
        return {
          cardBg: "bg-white border-slate-100 shadow-xs",
          medalColor: "text-slate-400",
          badgeBg: "bg-slate-400",
          height: "h-auto",
          crown: false,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6 shadow-md mb-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <Link
              href="/materi"
              className="inline-flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors text-sm font-bold bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Materi
            </Link>
            <h1 className="text-3xl md:text-4xl font-black flex items-center gap-2">
              <Trophy className="w-9 h-9 fill-yellow-400 text-yellow-400" />
              Papan Peringkat Misi
            </h1>
            <p className="text-blue-100 text-sm md:text-base font-medium max-w-xl">
              Ayo selesaikan kuis dan dapatkan skor terbaik di setiap materi sejarah. Buktikan bahwa kamu adalah penjelajah terbaik!
            </p>
          </div>

          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl border border-white/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Segarkan
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {loading ? (
          /* Loading State skeleton */
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-3 gap-4 items-end h-72">
              <div className="bg-slate-200 h-48 rounded-3xl" />
              <div className="bg-slate-200 h-64 rounded-3xl" />
              <div className="bg-slate-200 h-40 rounded-3xl" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white border border-red-100 rounded-3xl p-10 text-center shadow-md max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 text-3xl mx-auto mb-4">
              ⚠️
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">Gagal Memuat Data</h3>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-95 cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        ) : leaderboard.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-md max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">
              🏆
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">Papan Peringkat Kosong</h3>
            <p className="text-slate-500 text-sm mb-6">
              Belum ada skor tercatat di sistem. Jadilah pemain pertama dengan mulai belajar sekarang!
            </p>
            <Link
              href="/materi"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-95"
            >
              Mulai Petualangan Misi
            </Link>
          </div>
        ) : (
          /* Content State */
          <div className="space-y-12">
            {/* Top 3 Podium Layout */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-3 gap-3 md:gap-6 items-end pt-8 pb-4">
                {/* 2nd Place */}
                {topThree[1] ? (
                  <div className="flex flex-col items-center">
                    <div className={`w-full ${getPodiumStyles(2).cardBg} border-2 rounded-t-4xl px-4 py-6 text-center flex flex-col items-center justify-end ${getPodiumStyles(2).height} shadow-lg transition-transform hover:-translate-y-1 duration-300 relative`}>
                      <span className="absolute -top-5 w-10 h-10 rounded-full bg-slate-400 text-white flex items-center justify-center font-black border-4 border-[#F8FAFC] text-sm">
                        2
                      </span>
                      <Medal className="w-10 h-10 text-slate-400 mb-2" />
                      <h3 className="font-extrabold text-slate-800 text-xs md:text-sm truncate w-full">
                        {topThree[1].playerName}
                      </h3>
                      <p className="text-blue-600 font-black text-sm md:text-base mt-1">
                        {topThree[1].score} <span className="text-[10px] text-slate-500 font-bold">XP</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-10" />
                )}

                {/* 1st Place */}
                {topThree[0] ? (
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-full ${getPodiumStyles(1).cardBg} border-2 rounded-t-4xl px-4 py-6 text-center flex flex-col items-center justify-end ${getPodiumStyles(1).height} shadow-xl transition-transform hover:-translate-y-1 duration-300 relative`}>
                      <div className="absolute -top-7 animate-bounce duration-1000">
                        <Crown className="w-8 h-8 text-yellow-500 fill-yellow-400" />
                      </div>
                      <span className="absolute -top-5 w-11 h-11 rounded-full bg-yellow-500 text-white flex items-center justify-center font-black border-4 border-[#F8FAFC] text-base">
                        1
                      </span>
                      <Trophy className="w-12 h-12 text-yellow-500 fill-yellow-100 mb-2" />
                      <h3 className="font-black text-slate-800 text-sm md:text-base truncate w-full">
                        {topThree[0].playerName}
                      </h3>
                      <p className="text-blue-600 font-black text-base md:text-lg mt-1">
                        {topThree[0].score} <span className="text-xs text-slate-500 font-bold">XP</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-10" />
                )}

                {/* 3rd Place */}
                {topThree[2] ? (
                  <div className="flex flex-col items-center">
                    <div className={`w-full ${getPodiumStyles(3).cardBg} border-2 rounded-t-4xl px-4 py-6 text-center flex flex-col items-center justify-end ${getPodiumStyles(3).height} shadow-lg transition-transform hover:-translate-y-1 duration-300 relative`}>
                      <span className="absolute -top-5 w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-black border-4 border-[#F8FAFC] text-sm">
                        3
                      </span>
                      <Medal className="w-10 h-10 text-amber-600 mb-2" />
                      <h3 className="font-extrabold text-slate-800 text-xs md:text-sm truncate w-full">
                        {topThree[2].playerName}
                      </h3>
                      <p className="text-blue-600 font-black text-sm md:text-base mt-1">
                        {topThree[2].score} <span className="text-[10px] text-slate-500 font-bold">XP</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-10" />
                )}
              </div>
            )}

            {/* List for ranks 4-10 */}
            {otherRanks.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100">
                  <h2 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm md:text-base">
                    <Award className="w-5 h-5 text-blue-500" />
                    Penjelajah Peringkat Lainnya
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {otherRanks.map((item) => (
                    <div
                      key={item.rank}
                      className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm">
                          {item.rank}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm md:text-base">
                            {item.playerName}
                          </h4>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(item.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-blue-600 text-base md:text-lg">
                          {item.score}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold ml-1">XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
