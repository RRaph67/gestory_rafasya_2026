"use client";

import React, { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFetchCourses } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { CourseCard, ContinueLearning } from "@/components/organisms";

export default function Dashboard() {
  const { data: courses, loading: coursesLoading, error, refetch } = useFetchCourses();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Get last course (first in list)
  const lastCourse = courses?.[0];

  if (authLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500">{authLoading ? "Verifikasi akun..." : "Memuat materi..."}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevent showing protected content before redirect
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Error Loading Courses</h2>
          <p className="text-slate-500 text-center text-sm">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">No courses available</h2>
          <p className="text-slate-500">Check back later for new courses!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Banner / Welcome */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Halo Vicent!</h1>
          <p className="text-slate-500 mt-1">Selamat datang kembali di beranda</p>
        </header>

        {/* Continue Learning - Big Card */}
        {lastCourse && (
          <section className="mb-12">
            <ContinueLearning
              courseId={lastCourse.id}
              courseTitle={lastCourse.title}
            />
          </section>
        )}

        {/* Course List */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Kursus tersedia ({courses.length})
            </h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-600 transition-all">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                image={course.image}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
