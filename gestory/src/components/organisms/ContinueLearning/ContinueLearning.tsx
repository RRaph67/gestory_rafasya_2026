import React from "react";
import Link from "next/link";
import { ChevronRight, PlayCircle, Clock } from "lucide-react";

interface ContinueLearningProps {
  courseId: string;
  courseTitle: string;
  variant?: "default" | "compact";
}

export const ContinueLearning: React.FC<ContinueLearningProps> = ({
  courseId,
  courseTitle,
  variant = "default",
}) => {
  if (variant === "compact") {
    return (
      <Link
        href={`/course/${courseId}`}
        className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all"
      >
        <Clock className="w-5 h-5 text-blue-600 shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-blue-600 font-bold uppercase">Lanjutkan Belajar</p>
          <p className="text-sm font-semibold text-slate-900 line-clamp-1">
            {courseTitle}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-blue-600" />
      </Link>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#0077B6] rounded-3xl p-8 lg:p-12 text-white shadow-xl">
      {/* Background pattern/blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs font-bold mb-4">
          <Clock className="w-3 h-3" />
          Terakhir Dilihat
        </div>
        <h2 className="text-2xl lg:text-4xl font-black mb-6 leading-tight">
          {courseTitle}
        </h2>
        <Link
          href={`/course/${courseId}`}
          className="inline-flex items-center gap-2 bg-white text-[#0077B6] px-6 py-3 rounded-full font-bold transition-all hover:bg-slate-100 active:scale-95"
        >
          <PlayCircle className="w-5 h-5" />
          Lanjutkan
        </Link>
      </div>
    </div>
  );
};
