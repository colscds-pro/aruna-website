import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, MessageSquare, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { CONTENT, DIAGNOSTIC_QUESTIONS } from '../data/content';

interface DiagnosticToolProps {
  lang: Language;
  onOpenConsultation: () => void;
}

export const DiagnosticTool: React.FC<DiagnosticToolProps> = ({
  lang,
  onOpenConsultation,
}) => {
  const t = CONTENT[lang].diagnostic;
  const questions = DIAGNOSTIC_QUESTIONS[lang];

  // State: selected option index for each question
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCalculated, setIsCalculated] = useState(false);

  const handleSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setIsCalculated(false);
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  // Score calculation
  const totalScore = Object.entries(answers).reduce((sum, [qId, optIdx]) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return sum;
    return sum + q.options[optIdx].score;
  }, 0);

  const maxScore = questions.length * 3;

  const getTier = (score: number) => {
    if (score <= 8) {
      return {
        level: 'Tingkat Kesiapan Rendah (High Risk)',
        title: 'Fondasi Operasional Sangat Rentan',
        badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
        summary: 'Operasional bisnis Anda saat ini masih sangat bergantung pada pengawasan fisik langsung dan ingatan personil. Membuka cabang kedua dalam kondisi saat ini berisiko melipatgandakan kebocoran stok dan kebingungan kas.',
        recommendation: 'Prioritas utama adalah Business Process Analysis & perapian master data inventori sebelum menambah sewa unit baru.'
      };
    }
    if (score <= 12) {
      return {
        level: 'Tingkat Kesiapan Menengah (Moderate Risk)',
        title: 'Transisi Menuju Struktur yang Tepat',
        badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
        summary: 'Sebagian proses Anda telah berjalan dengan baik, namun integrasi antara stok, pembelian, dan pembukuan masih longgar. Anda siap tumbuh asalkan sistem ERP yang tepat diimplementasikan bersamaan dengan persiapan cabang baru.',
        recommendation: 'Standarisasi alur PO supplier dan otomatisasi valuasi persediaan antar-gudang.'
      };
    }
    return {
      level: 'Tingkat Kesiapan Tinggi (Scale Ready)',
      title: 'Fondasi Siap Direplikasi',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      summary: 'Bisnis Anda telah memiliki disiplin proses yang kuat. Tantangan berikutnya adalah memastikan konfigurasi sistem multi-cabang tetap konsisten seiring penambahan personil baru.',
      recommendation: 'Implementasi manajemen multi-outlet dan dashboard kontrol eksekutif.'
    };
  };

  const handleReset = () => {
    setAnswers({});
    setIsCalculated(false);
  };

  const tier = getTier(totalScore);

  const whatsappMessage = encodeURIComponent(
    `Halo ARUNA, saya baru saja menyelesaikan Diagnostic Kesiapan Multi-Outlet di website dengan skor ${totalScore}/${maxScore} (${tier.title}). Saya ingin berdiskusi mengenai langkah pembenahan sistem kami.`
  );

  return (
    <section id="diagnostic" className="py-20 md:py-28 bg-white border-t border-[#EAECF0]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>{t.kicker}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-4">
            {t.title}
          </h2>

          <p className="text-base sm:text-lg text-[#667085] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Diagnostic Form Container */}
        <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm p-6 sm:p-10 mb-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAECF0]">
            <p className="text-xs sm:text-sm text-[#667085]">
              {t.instructions}
            </p>
            <span className="text-xs font-mono text-[#0B1F33] font-semibold shrink-0">
              {Object.keys(answers).length} / {questions.length} Terisi
            </span>
          </div>

          {/* Question List */}
          <div className="space-y-8">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="pt-2 first:pt-0">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B59A5A] uppercase tracking-wider mb-1.5">
                  <span>0{qIndex + 1}</span>
                  <span>·</span>
                  <span>{q.category}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0B1F33] mb-4">
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = answers[q.id] === optIndex;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleSelect(q.id, optIndex)}
                        className={`p-4 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B1F33] text-white border-[#0B1F33] shadow-xs'
                            : 'bg-[#F5F6F7] text-[#0B1F33] border-[#EAECF0] hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-xs font-bold ${
                                isSelected ? 'text-white' : 'text-[#0B1F33]'
                              }`}
                            >
                              {opt.label}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#B59A5A]" />
                            )}
                          </div>
                          <p
                            className={`text-xs leading-relaxed ${
                              isSelected ? 'text-white/80' : 'text-[#667085]'
                            }`}
                          >
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="mt-10 pt-6 border-t border-[#EAECF0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#0B1F33] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.reset}</span>
            </button>

            <button
              type="button"
              disabled={!allAnswered}
              onClick={() => setIsCalculated(true)}
              className={`w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
                allAnswered
                  ? 'bg-[#0B1F33] text-white hover:bg-[#132D47] shadow-xs cursor-pointer'
                  : 'bg-[#F5F6F7] text-[#667085] cursor-not-allowed border border-[#EAECF0]'
              }`}
            >
              {allAnswered ? t.ctaSubmit : `Lengkapi ${questions.length - Object.keys(answers).length} Pertanyaan Lagi`}
            </button>
          </div>
        </div>

        {/* Results Card (shown when calculated) */}
        {isCalculated && (
          <div className="bg-white rounded-xl border border-[#EAECF0] p-8 sm:p-10 shadow-lg animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EAECF0] mb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-1">
                  Hasil Diagnostic Mandiri
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F33]">
                  {tier.title}
                </h3>
              </div>

              <div className="flex items-baseline gap-2 bg-[#F5F6F7] px-5 py-3 rounded-lg border border-[#EAECF0]">
                <span className="text-xs text-[#667085] font-semibold">Skor Kesiapan:</span>
                <span className="text-2xl font-bold font-mono text-[#0B1F33]">
                  {totalScore}
                </span>
                <span className="text-xs text-[#667085] font-mono">/ {maxScore}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#667085] leading-relaxed mb-6">
              {tier.summary}
            </p>

            <div className="p-4 sm:p-5 rounded-lg bg-[#F5F6F7] border border-[#EAECF0] mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] block mb-1">
                Langkah Rekomendasi ARUNA:
              </span>
              <p className="text-sm text-[#0B1F33] font-medium leading-relaxed">
                {tier.recommendation}
              </p>
            </div>

            {/* Direct Connect Options */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href={`https://wa.me/6281288004560?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 text-[#B59A5A]" />
                <span>Diskusikan Hasil Ini via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onOpenConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-[#0B1F33] bg-[#F5F6F7] hover:bg-[#EAECF0] rounded-md transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Bicara dengan Advisor →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
