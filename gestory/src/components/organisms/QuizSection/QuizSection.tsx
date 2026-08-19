import React, { useState } from "react";
import {
  FileType,
  FileText,
  Video,
  ClipboardCheck,
  ChevronRight,
  ChevronDown,
  Play,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Trophy,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { useQuizQuestions } from "@/hooks";
import { quizService } from "@/services";

interface MaterialSection {
  type: "pdf" | "text" | "video" | "quiz";
  title: string;
  content?: string;
  url?: string;
}

interface QuizSectionProps {
  courseId: string;
  sections: MaterialSection[];
  openSection: number | null;
  onToggleSection: (index: number) => void;
}

// Helper to extract Youtube ID
function getYoutubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  courseId,
  sections,
  openSection,
  onToggleSection,
}) => {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  // --- Quiz Engine States ---
  const { data: quizQuestions, loading: quizLoading, error: quizError } = useQuizQuestions(courseId);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Array<{ questionId: string; selectedAnswer: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Find PDF URL for Text Section's "Buka PDF" button
  const pdfSection = sections.find((s) => s.type === "pdf");
  const pdfUrl = pdfSection?.url || "#";

  const handleAnswerSelect = (optionKey: string) => {
    if (showFeedback) return;
    setSelectedAnswer(optionKey);
    setShowFeedback(true);

    const question = quizQuestions?.[currentQuestionIdx];
    if (!question) return;

    const isCorrect = optionKey === question.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 100);
    }

    setQuizAnswers((prev) => [
      ...prev,
      { questionId: question.id, selectedAnswer: optionKey },
    ]);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);

    if (quizQuestions && currentQuestionIdx + 1 < quizQuestions.length) {
      setCurrentQuestionIdx((idx) => idx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizFinished(false);
    setQuizAnswers([]);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  };

  const handleSubmitQuizScore = async () => {
    if (!quizQuestions) return;
    setIsSubmitting(true);
    try {
      const response = await quizService.submitQuiz({
        courseId,
        answers: quizAnswers,
      });
      if (response.success) {
        setSubmitSuccess(true);
      } else {
        alert("Gagal menyimpan hasil kuis: " + (response.message || "Error"));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi saat menyimpan kuis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-black text-slate-800 mb-6">Materi & Kuis</h2>

      <div className="space-y-4">
        {sections.map((section, idx) => {
          const isOpen = openSection === idx;
          const Icon =
            section.type === "pdf"
              ? FileType
              : section.type === "text"
                ? FileText
                : section.type === "video"
                  ? Video
                  : ClipboardCheck;

          return (
            <div
              key={idx}
              className="border-2 border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 shadow-xs"
            >
              <button
                onClick={() => onToggleSection(idx)}
                className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors ${
                  isOpen
                    ? "bg-[#0077B6] text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon
                    className={`w-6 h-6 shrink-0 ${
                      isOpen ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span className="font-bold text-lg md:text-xl leading-snug">
                    {section.title}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-6 h-6" />
                ) : (
                  <ChevronRight className="w-6 h-6" />
                )}
              </button>

              {isOpen && (
                <div className="p-8 bg-slate-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  
                  {/* --- PDF SECTION --- */}
                  {section.type === "pdf" && (
                    <div className="flex flex-col items-center gap-6">
                      <p className="text-slate-500 font-medium">
                        Materi tersedia dalam format PDF untuk dipelajari lebih
                        mendalam.
                      </p>
                      <a
                        href={section.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                      >
                        <FileType className="w-5 h-5" />
                        Buka Materi PDF
                      </a>
                    </div>
                  )}

                  {/* --- TEXT SECTION (Summary with PDF link) --- */}
                  {section.type === "text" && (
                    <div className="flex flex-col gap-6">
                      <p className="text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                        {section.content}
                      </p>
                      <div className="border-t border-slate-200 pt-6 flex justify-end">
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-6 py-3.5 rounded-2xl font-black hover:bg-blue-50 transition-all text-sm"
                        >
                          <FileType className="w-4 h-4" />
                          Buka PDF Lengkap
                        </a>
                      </div>
                    </div>
                  )}

                  {/* --- VIDEO SECTION --- */}
                  {section.type === "video" && (
                    <div className="flex flex-col items-center gap-4">
                      {(() => {
                        const videoUrl = (section.url && section.url !== "#") 
                          ? section.url 
                          : (courseId === "bab-1" ? "https://youtu.be/TTeRijrtDhg?si=zC-k-ia-QHAqKMH_" : section.url);

                        if (videoUrl && videoUrl !== "#") {
                          const ytId = getYoutubeId(videoUrl);
                          return (
                            <div className="w-full max-w-2xl">
                              {ytId ? (
                                <div className="aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full border-none"
                                  />
                                </div>
                              ) : (
                                <a
                                  href={videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative block aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-900 cursor-pointer"
                                >
                                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-600 to-indigo-900">
                                    <Video className="w-16 h-16 text-white/30" />
                                  </div>
                                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/35 transition-colors" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-blue-600/90 text-white rounded-full flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 group-hover:bg-blue-600">
                                      <Play className="w-10 h-10 fill-current translate-x-0.5" />
                                    </div>
                                  </div>
                                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-xs font-black tracking-wider flex items-center gap-1.5">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    TONTON DI YOUTUBE
                                  </div>
                                </a>
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <div className="p-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-3xl w-full">
                              Video sedang dipersiapkan.
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}

                  {/* --- PRE TEST QUIZ SECTION --- */}
                  {section.type === "quiz" && (
                    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-xs">
                      {quizLoading && (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                          <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                          <p className="text-slate-500 font-bold">Memuat kuis...</p>
                        </div>
                      )}

                      {quizError && (
                        <div className="text-center py-6">
                          <p className="text-red-500 font-bold">Gagal memuat kuis: {quizError.message}</p>
                          <button
                            onClick={handleResetQuiz}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm"
                          >
                            Ulangi
                          </button>
                        </div>
                      )}

                      {!quizLoading && !quizError && quizQuestions && quizQuestions.length === 0 && (
                        <div className="text-center py-10 text-slate-400 font-bold">
                          Kuis belum tersedia untuk bab ini.
                        </div>
                      )}

                      {!quizLoading && !quizError && quizQuestions && quizQuestions.length > 0 && (
                        <div>
                          {!quizFinished ? (
                            <div>
                              {/* HUD / Progress */}
                              <div className="flex justify-between items-center mb-6">
                                <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase">
                                  Soal Sejarah
                                </span>
                                <span className="text-slate-500 text-sm font-black">
                                  {currentQuestionIdx + 1} / {quizQuestions.length}
                                </span>
                              </div>

                              {/* Question Card */}
                              <div className="mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-snug">
                                  {quizQuestions[currentQuestionIdx].question}
                                </h3>
                              </div>

                              {/* Answers */}
                              <div className="flex flex-col gap-4">
                                {Object.entries(quizQuestions[currentQuestionIdx].options).map(([key, val]) => {
                                  const question = quizQuestions[currentQuestionIdx];
                                  const isSelected = selectedAnswer === key;
                                  const isCorrect = key === question.correctAnswer;

                                  let btnClass = "bg-white hover:bg-slate-50 text-slate-700 border-slate-200";
                                  if (showFeedback) {
                                    if (isCorrect) {
                                      btnClass = "bg-green-500 text-white border-green-600";
                                    } else if (isSelected) {
                                      btnClass = "bg-red-500 text-white border-red-600";
                                    } else {
                                      btnClass = "bg-white text-slate-400 border-slate-100 opacity-60";
                                    }
                                  }

                                  return (
                                    <button
                                      key={key}
                                      onClick={() => handleAnswerSelect(key)}
                                      disabled={showFeedback}
                                      className={`w-full px-6 py-4.5 text-left border-2 rounded-2xl font-bold transition-all text-base md:text-lg flex justify-between items-center ${btnClass}`}
                                    >
                                      <span className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black shrink-0 text-sm">
                                          {key}
                                        </span>
                                        {val}
                                      </span>
                                      {showFeedback && isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                                      {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 shrink-0" />}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Feedback / Explanation Box */}
                              {showFeedback && (
                                <div className="mt-8 bg-slate-50 border border-slate-100 p-5 rounded-2xl text-left">
                                  <div className="flex items-start gap-3">
                                    <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-bold text-slate-800 text-base mb-1">
                                        {selectedAnswer === quizQuestions[currentQuestionIdx].correctAnswer
                                          ? "Tembakan Jitu! 🎉"
                                          : "Belum Tepat! 😅"}
                                      </p>
                                      <p className="text-slate-600 text-sm leading-relaxed">
                                        {quizQuestions[currentQuestionIdx].explanation}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-6 flex justify-end">
                                    <button
                                      onClick={handleNextQuestion}
                                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-blue-700 transition-all"
                                    >
                                      {currentQuestionIdx + 1 < quizQuestions.length ? "Lanjut" : "Selesai"}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Finished State */
                            <div className="text-center py-6">
                              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
                              <h3 className="text-2xl font-black text-slate-800 mb-2">Kuis Selesai!</h3>
                              <p className="text-slate-500 mb-6 font-medium">Anda telah menyelesaikan kuis pre-test.</p>

                              <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl mb-8 max-w-sm mx-auto shadow-md">
                                <p className="text-xs font-black uppercase tracking-wider text-blue-200 mb-1">Skor Akhir</p>
                                <p className="text-6xl font-black">{score}</p>
                                <p className="text-xs text-blue-200 mt-2 font-medium">
                                  dari {quizQuestions.length * 100} poin maksimal
                                </p>
                              </div>

                              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                                {!submitSuccess ? (
                                  <button
                                    onClick={handleSubmitQuizScore}
                                    disabled={isSubmitting}
                                    className="bg-blue-600 text-white py-3.5 rounded-xl font-black hover:bg-blue-700 disabled:opacity-50 text-sm transition-all"
                                  >
                                    {isSubmitting ? "Menyimpan..." : "Simpan Nilai ke Akun"}
                                  </button>
                                ) : (
                                  <div className="bg-green-50 border border-green-200 text-green-700 py-3 rounded-xl font-bold text-sm">
                                    ✅ Nilai berhasil disimpan!
                                  </div>
                                )}
                                
                                <button
                                  onClick={handleResetQuiz}
                                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  Ulangi Kuis
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
