import React, { useState } from 'react';
import { ShoppingBag, Utensils, Hotel, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { CONTENT } from '../data/content';
import { useSiteMedia } from '../services/supabase/useSiteMedia';

interface IndustriesProps {
  lang: Language;
  onOpenConsultation: () => void;
}

export const Industries: React.FC<IndustriesProps> = ({ lang, onOpenConsultation }) => {
  const t = CONTENT[lang].industries;
  const [selectedIndustry, setSelectedIndustry] = useState<'retail' | 'fb' | 'hospitality'>('retail');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const current = t.items.find((item) => item.id === selectedIndustry) || t.items[0];

  const mediaSlug =
    selectedIndustry === 'retail'
      ? 'industry-retail'
      : selectedIndustry === 'fb'
      ? 'industry-fnb'
      : 'industry-hospitality';
  const { url: dynamicIndustryUrl } = useSiteMedia(mediaSlug, current.imageSrc);
  const [currentImgSrc, setCurrentImgSrc] = useState(dynamicIndustryUrl);

  React.useEffect(() => {
    setCurrentImgSrc(dynamicIndustryUrl);
  }, [dynamicIndustryUrl]);

  const handleImageError = () => {
    if (currentImgSrc !== current.imageSrc) {
      setCurrentImgSrc(current.imageSrc);
    } else {
      setImageErrors((prev) => ({ ...prev, [current.id]: true }));
    }
  };

  const industryIcons = {
    retail: <ShoppingBag className="w-4 h-4" />,
    fb: <Utensils className="w-4 h-4" />,
    hospitality: <Hotel className="w-4 h-4" />
  };

  return (
    <section id="industries" className="py-20 md:py-28 bg-white border-t border-[#EAECF0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>{t.kicker}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-4 text-balance">
            {t.title}
          </h2>

          <p className="text-base sm:text-lg text-[#667085] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Industry Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[#EAECF0]">
          {t.items.map((item) => {
            const isActive = selectedIndustry === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndustry(item.id)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0B1F33] text-white shadow-xs'
                    : 'bg-[#F5F6F7] text-[#667085] border border-[#EAECF0] hover:text-[#0B1F33] hover:bg-white'
                }`}
              >
                <span>{industryIcons[item.id]}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Showcase Card */}
        <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Imagery with Scrim & Caption */}
            <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto min-h-[320px] bg-[#0B1F33]/5 overflow-hidden">
              {!imageErrors[current.id] ? (
                <img
                  src={currentImgSrc}
                  alt={current.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0B1F33] text-white p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    {industryIcons[current.id]}
                  </div>
                  <h4 className="text-xl font-bold">{current.name}</h4>
                  <p className="text-xs text-white/70 mt-2">Operasional Terstruktur & Sistem Terintegrasi</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#B59A5A] block mb-0.5">
                  Sektor Terfokus
                </span>
                <p className="text-sm font-semibold">{current.headline}</p>
              </div>
            </div>

            {/* Right: Operational Friction & System Solutions */}
            <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#B59A5A] uppercase tracking-wider">
                    Industri Primer
                  </span>
                  <span aria-hidden="true" className="text-[#667085]">·</span>
                  <span className="text-xs font-semibold text-[#667085]">
                    Kesiapan Multi-Unit
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] mb-3">
                  {current.headline}
                </h3>

                <p className="text-sm sm:text-base text-[#667085] leading-relaxed mb-8">
                  {current.description}
                </p>

                {/* Two-column sub-grid: Frictions vs System Architecture */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Friction Column */}
                  <div className="p-5 rounded-lg bg-[#F5F6F7] border border-[#EAECF0]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-3">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#B59A5A]" />
                      <span>Friksi Lapangan yang Kerap Terjadi</span>
                    </div>
                    <ul className="space-y-2.5">
                      {current.frictionPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#667085] leading-relaxed">
                          <span className="text-[#B59A5A] font-bold">·</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* System Focus Column */}
                  <div className="p-5 rounded-lg bg-[#F5F6F7] border border-[#EAECF0]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-3">
                      <CheckCircle className="w-3.5 h-3.5 text-[#0B1F33]" />
                      <span>Fokus Solusi & Konfigurasi ARUNA</span>
                    </div>
                    <ul className="space-y-2.5">
                      {current.systemFocus.map((focus, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#0B1F33] font-medium leading-relaxed">
                          <span className="text-[#0B1F33] font-bold">✓</span>
                          <span>{focus}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Consultation trigger */}
              <div className="pt-4 border-t border-[#EAECF0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-[#667085]">
                  Memiliki outlet {current.name} dan sedang bersiap menambah cabang?
                </span>
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1F33] hover:text-[#B59A5A] transition-colors self-start sm:self-auto"
                >
                  <span>Konsultasikan dengan Advisor Industri</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
