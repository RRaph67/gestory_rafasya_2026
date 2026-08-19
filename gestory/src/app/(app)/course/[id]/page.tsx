"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useFetchCourseDetail } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { QuizSection, GameBoard } from "@/components/organisms";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { data: course, loading: courseLoading, error, refetch } = useFetchCourseDetail(courseId);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [openSection, setOpenSection] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  if (authLoading || courseLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500">{authLoading ? "Verifikasi akun..." : "Memuat detail materi..."}</p>
      </div>
    );
  }

  if (!user) {
    return null; // Prevent showing protected content before redirect
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="text-4xl">⚠️</div>
        <h1 className="text-2xl font-bold text-slate-900">Error Loading Course</h1>
        <p className="text-slate-500">{error.message}</p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/materi"
            className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Kembali ke Materi
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Materi tidak ditemukan
        </h1>
        <Link
          href="/materi"
          className="text-blue-600 font-bold hover:underline"
        >
          Kembali ke Materi
        </Link>
      </div>
    );
  }

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      {/* Breadcrumbs */}
      <nav className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Link
            href="/materi"
            className="hover:text-blue-600 transition-colors"
          >
            Materi
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate">
            {course.breadcrumb}
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">
        {/* Course Title */}
        <h1 className="text-3xl font-black text-[#0077B6] mb-8 leading-tight">
          {course.title}
        </h1>

        {/* Description Box */}
        <div className="bg-[#0077B6] rounded-2xl overflow-hidden shadow-sm mb-10">
          <div className="bg-[#005F92] px-6 py-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">
              Deskripsi singkat
            </h2>
          </div>
          <div className="bg-white p-6 border-x border-b border-blue-50">
            <p className="text-slate-600 leading-relaxed font-medium">
              {course.description}
            </p>
          </div>
        </div>

        {/* Game Button */}
        <div className="mb-16">
          <GameBoard />
        </div>

        {/* Material & Quiz Section */}
        {course.sections && course.sections.length > 0 && (
          <QuizSection
            courseId={courseId}
            sections={course.sections}
            openSection={openSection}
            onToggleSection={toggleSection}
          />
        )}

        {(!course.sections || course.sections.length === 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-slate-600">Materi untuk kursus ini sedang disiapkan.</p>
          </div>
        )}
      </main>
    </div>
  );
}
