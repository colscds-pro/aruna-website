import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { Language } from '../types';
import { HERO_IMAGE } from '../data/content';
import { useSiteMedia } from '../services/supabase/useSiteMedia';

interface HeroProps {
  lang: Language;
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onOpenConsultation }) => {
  const [imageError, setImageError] = useState(false);
  const { url: heroImageUrl } = useSiteMedia('hero-consulting-meeting', HERO_IMAGE);
  const [imgSrc, setImgSrc] = useState(heroImageUrl);

  React.useEffect(() => {
    setImgSrc(heroImageUrl);
  }, [heroImageUrl]);

  const handleImageError = () => {
    if (imgSrc !== HERO_IMAGE) {
      setImgSrc(HERO_IMAGE);
    } else {
      setImageError(true);
    }
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Header Group */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Unboxed editorial kicker */}
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#667085] mb-5">
            <span>Business Transformation Partner</span>
            <span aria-hidden="true" className="text-[#B59A5A]">·</span>
            <span>Trusted Business Advisor</span>
          </div>

          {/* Master Tagline Headline on two confident lines */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0B1F33] leading-[1.06] mb-6">
            <span className="block">MAKE BUSINESS</span>
            <span className="block text-[#0B1F33]">MAKE SENSE.</span>
          </h1>

          {/* Value proposition narrative per Prompt #3 */}
          <p className="text-base sm:text-lg md:text-xl text-[#667085] leading-relaxed max-w-3xl mx-auto mb-9 font-normal text-balance">
            {lang === 'id'
              ? 'ARUNA membantu bisnis yang sedang bertumbuh memahami cara mereka bekerja, menata proses, dan membangun sistem agar bisnis lebih mudah dikontrol.'
              : 'ARUNA helps growing businesses understand how they work, organize their processes, and build systems so the business is easier to control.'}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenConsultation}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors shadow-sm whitespace-nowrap cursor-pointer"
            >
              <span>{lang === 'id' ? 'Bicara dengan Advisor →' : 'Talk to an Advisor →'}</span>
            </button>

            <a
              href="#how-we-work"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#0B1F33] bg-[#F5F6F7] hover:bg-[#EAECF0] rounded-md transition-colors whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-[#B59A5A]" />
              <span>{lang === 'id' ? 'Cara Kerja Kami' : 'How We Work'}</span>
            </a>
          </div>
        </div>

        {/* Hero Visual Container */}
        <div className="max-w-5xl mx-auto relative rounded-xl overflow-hidden border border-[#EAECF0] shadow-sm bg-white">
          <div className="relative aspect-[16/9] w-full bg-[#0B1F33]/5 overflow-hidden">
            {!imageError ? (
              <img
                src={imgSrc}
                alt="ARUNA senior advisor and business founder reviewing operational workflows"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.01]"
                referrerPolicy="no-referrer"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1F33] to-[#132D47] text-white p-8 text-center">
                <span className="text-xs uppercase tracking-widest text-[#B59A5A] mb-2 font-semibold">ARUNA Advisory</span>
                <p className="text-xl font-medium max-w-md">Business first. Software second.</p>
                <p className="text-xs text-white/70 mt-2">Duduk bersama pemilik bisnis memahami alur riil di lapangan.</p>
              </div>
            )}

            {/* Subtle editorial photo overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33]/60 via-transparent to-transparent pointer-events-none" />

            {/* In-Frame Context Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto max-w-lg bg-[#0B1F33]/90 backdrop-blur-md text-white p-4 sm:p-5 rounded-lg border border-white/10 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B59A5A] mb-1">
                <span>Fokus Kemitraan</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white mb-0.5">
                Bisnis Beromzet Rp5–20 Miliar / Unit
              </p>
              <p className="text-xs text-white/80">
                Mempersiapkan cabang ke-2 dan ekspansi unit berikutnya dengan kontrol penuh
              </p>
            </div>
          </div>
        </div>

        {/* Quiet Sub-bar: Core Transition Philosophy */}
        <div className="max-w-4xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="py-3 px-4 border-b md:border-b-0 md:border-r border-[#EAECF0]">
            <span className="text-xs font-semibold text-[#667085] block">01 · BUSINESS FIRST</span>
            <span className="text-xs text-[#0B1F33] font-medium">Memahami cara bisnis bekerja</span>
          </div>
          <div className="py-3 px-4 border-b md:border-b-0 md:border-r border-[#EAECF0]">
            <span className="text-xs font-semibold text-[#667085] block">02 · PROCESS FIRST</span>
            <span className="text-xs text-[#0B1F33] font-medium">Menata alur & tanggung jawab</span>
          </div>
          <div className="py-3 px-4 border-b md:border-b-0 md:border-r border-[#EAECF0]">
            <span className="text-xs font-semibold text-[#667085] block">03 · CONTROL BEFORE GROWTH</span>
            <span className="text-xs text-[#0B1F33] font-medium">Kuasai kontrol sebelum ekspansi</span>
          </div>
          <div className="py-3 px-4">
            <span className="text-xs font-semibold text-[#667085] block">04 · ENABLING TECH</span>
            <span className="text-xs text-[#0B1F33] font-medium">Sistem teknologi yang mendukung</span>
          </div>
        </div>
      </div>
    </section>
  );
};
