import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  href?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  image,
  href = `/course/${id}`,
}) => {
  return (
    <Link
      href={href}
      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col grow">
        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-4">
          {description}
        </p>
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-blue-600">
          <span className="text-xs font-bold uppercase tracking-wider">Buka Materi</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
