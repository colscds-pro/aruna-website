import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface CtaSectionProps {
  lang: Language;
  onOpenConsultation: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  lang,
  onOpenConsultation,
}) => {
  return (
    <section className="py-24 md:py-32 bg-[#0B1F33] text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-4 font-mono">
          <span>LANGKAH BERIKUTNYA</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6 text-balance max-w-4xl mx-auto">
          {lang === 'id'
            ? 'SIAP MEMAHAMI BISNIS ANDA LEBIH JELAS?'
            : 'READY TO UNDERSTAND YOUR BUSINESS WITH CLARITY?'}
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-10 font-normal text-balance">
          {lang === 'id'
            ? 'Mulai dari memahami bagaimana bisnis Anda bekerja hari ini — sebelum menentukan sistem yang dibutuhkan.'
            : 'Start by understanding how your business works today — before deciding on the system you need.'}
        </p>

        {/* Advisor-Led Dual Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            type="button"
            onClick={onOpenConsultation}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-[#0B1F33] bg-white hover:bg-[#F5F6F7] rounded-md transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            <span>{lang === 'id' ? 'Bicara dengan Advisor →' : 'Talk to an Advisor →'}</span>
          </button>

          <a
            href="#diagnostic"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-md transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-[#B59A5A]" />
            <span>{lang === 'id' ? 'Self-Diagnostic Kesiapan' : 'Self-Diagnostic Assessment'}</span>
          </a>
        </div>

        {/* Quiet Trust Note */}
        <div className="inline-flex items-center gap-2 text-xs text-white/70">
          <Shield className="w-3.5 h-3.5 text-[#B59A5A]" />
          <span>
            {lang === 'id'
              ? 'Diskusi awal berfokus pada bisnis Anda. Tanpa tekanan penjualan software.'
              : 'Consultation focuses on your business. Zero software sales pressure.'}
          </span>
        </div>
      </div>
    </section>
  );
};
