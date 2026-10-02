import React from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { CONTENT } from '../data/content';

interface WhyArunaProps {
  lang: Language;
  onOpenConsultation?: () => void;
}

export const WhyAruna: React.FC<WhyArunaProps> = ({ lang, onOpenConsultation }) => {
  const t = CONTENT[lang].whyAruna;

  return (
    <section id="why-aruna" className="py-20 md:py-28 bg-white border-t border-[#EAECF0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>{t.kicker}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-4">
            {t.title}
          </h2>

          <p className="text-base sm:text-lg text-[#667085] leading-relaxed">
            {t.lead}
          </p>
        </div>

        {/* 4 Strategic Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {t.tenets.map((tenet, idx) => (
            <div
              key={tenet.title}
              className="p-7 rounded-xl bg-[#F5F6F7] border border-[#EAECF0] shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-[#B59A5A] block mb-3 uppercase tracking-wider">
                  0{idx + 1} · Prinsip
                </span>
                <h3 className="text-lg font-bold text-[#0B1F33] mb-3 leading-snug">
                  {tenet.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mt-2">
                {tenet.description}
              </p>
            </div>
          ))}
        </div>

        {/* Comprehensive Differentiation Table */}
        <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-[#EAECF0] bg-[#F5F6F7]">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F33] mb-1">
              {t.comparison.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#667085]">
              Perbandingan mendasar antara pendekatan penjualan vendor IT dengan pendampingan transformasi ARUNA.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#EAECF0] bg-[#F5F6F7] text-xs font-bold uppercase tracking-wider text-[#667085]">
                  <th className="p-4 sm:p-5 w-1/4">Dimensi Kerja</th>
                  <th className="p-4 sm:p-5 w-3/8 text-[#667085]">
                    {t.comparison.vendorLabel}
                  </th>
                  <th className="p-4 sm:p-5 w-3/8 bg-[#0B1F33]/5 text-[#0B1F33]">
                    {t.comparison.arunaLabel}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0] text-xs sm:text-sm">
                {t.comparison.rows.map((row) => (
                  <tr key={row.topic} className="hover:bg-[#F5F6F7]/60 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-[#0B1F33]">
                      {row.topic}
                    </td>
                    <td className="p-4 sm:p-5 text-[#667085]">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{row.vendor}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 bg-[#0B1F33]/5 font-medium text-[#0B1F33]">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#B59A5A] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{row.aruna}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-5 bg-[#F5F6F7] border-t border-[#EAECF0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#667085]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B59A5A]" />
              <span>Komitmen kami: Menghubungkan proses operasional riil dengan sistem yang masuk akal.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block font-mono text-[11px] text-[#667085]">
                Business first. Software second.
              </span>
              {onOpenConsultation && (
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="font-semibold text-[#0B1F33] hover:text-[#B59A5A] transition-colors cursor-pointer"
                >
                  Bicara dengan Advisor →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
