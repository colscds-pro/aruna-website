import React from 'react';
import { ArrowRight, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { CONTENT } from '../data/content';

interface CaseStudyProps {
  lang: Language;
  onOpenConsultation: () => void;
}

export const CaseStudy: React.FC<CaseStudyProps> = ({ lang, onOpenConsultation }) => {
  const t = CONTENT[lang].caseStudy;

  return (
    <section id="case-study" className="py-20 md:py-28 bg-[#F5F6F7] border-t border-[#EAECF0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>{t.kicker}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-4 text-balance">
            {t.title}
          </h2>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B1F33] bg-white border border-[#EAECF0] px-3.5 py-1.5 rounded-md mb-4 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#B59A5A]" />
            <span>{t.badgeStatus}</span>
          </div>

          <p className="text-lg sm:text-xl font-medium italic text-[#0B1F33]">
            {t.subtitle}
          </p>
        </div>

        {/* Case Study Card */}
        <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm overflow-hidden">
          {/* Top metadata strip */}
          <div className="p-6 bg-[#F5F6F7] border-b border-[#EAECF0] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#667085] uppercase tracking-wider block font-semibold text-[10px]">
                Sektor Bisnis
              </span>
              <span className="font-bold text-[#0B1F33] text-sm">
                {t.clientContext.sector}
              </span>
            </div>
            <div>
              <span className="text-[#667085] uppercase tracking-wider block font-semibold text-[10px]">
                Wilayah
              </span>
              <span className="font-bold text-[#0B1F33] text-sm">
                {t.clientContext.location}
              </span>
            </div>
            <div className="col-span-2 md:col-span-2">
              <span className="text-[#667085] uppercase tracking-wider block font-semibold text-[10px]">
                Status Keterlibatan
              </span>
              <span className="font-medium text-[#0B1F33]">
                {t.clientContext.status}
              </span>
            </div>
          </div>

          {/* Core Content: Problem vs Strategic Intervention */}
          <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Problem */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-4">
                <AlertCircle className="w-4 h-4 text-[#B59A5A]" />
                <span>{t.problem.title}</span>
              </div>

              <div className="space-y-4">
                {t.problem.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-[#F5F6F7] border border-[#EAECF0]">
                    <span className="w-5 h-5 rounded-full bg-white border border-[#EAECF0] text-[#0B1F33] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                      {pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: ARUNA Intervention */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-4">
                <CheckCircle2 className="w-4 h-4 text-[#0B1F33]" />
                <span>{t.intervention.title}</span>
              </div>

              <div className="space-y-4">
                {t.intervention.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-[#0B1F33]/5 border border-[#EAECF0]">
                    <span className="w-5 h-5 rounded-full bg-[#0B1F33] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <p className="text-xs sm:text-sm text-[#0B1F33] font-medium leading-relaxed">
                      {pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Outcome Reflection & Integrity Assurance */}
          <div className="p-8 sm:p-10 bg-[#0B1F33] text-white border-t border-[#EAECF0]">
            <div className="max-w-3xl">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#B59A5A] block mb-2">
                {t.outcomeReflection.title}
              </span>
              <p className="text-lg sm:text-xl font-medium text-white italic leading-relaxed mb-4">
                {t.outcomeReflection.quote}
              </p>
              <p className="text-xs text-white/75 leading-relaxed font-normal">
                {t.outcomeReflection.note}
              </p>
            </div>
          </div>
        </div>

        {/* Quiet prompt */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#667085] mb-3">
            Ingin mengetahui apakah situasi bisnis Anda mirip dengan kondisi di atas?
          </p>
          <button
            type="button"
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1F33] hover:text-[#B59A5A] transition-colors cursor-pointer"
          >
            <span>Bicara dengan Advisor →</span>
          </button>
        </div>
      </div>
    </section>
  );
};
