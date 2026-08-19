import React from "react";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export const GameBoard: React.FC = () => {
  return (
    <Link
      href="/play"
      className="group relative flex items-center justify-center gap-4 bg-gradient-to-r from-[#FF8200] to-[#FF6200] hover:from-[#FF9210] hover:to-[#FF7210] text-white p-8 rounded-[24px] shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
    >
      <div className="bg-white/20 p-3 rounded-2xl group-hover:scale-110 transition-transform">
        <Gamepad2 className="w-8 h-8 fill-white" />
      </div>
      <div className="text-left">
        <h3 className="text-2xl font-black uppercase tracking-tight">
          Latihan Soal Investigasi (Game)
        </h3>
        <p className="text-orange-100 font-medium">
          Bermain sambil belajar dengan webcam interaktif!
        </p>
      </div>
    </Link>
  );
};
