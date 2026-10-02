import React from 'react';
import { ArrowUpRight, MessageSquare, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { Language } from '../types';
import { CONTENT } from '../data/content';
import { ArunaLogo } from './ArunaLogo';

interface FooterProps {
  lang: Language;
  onOpenConsultation: () => void;
  onOpenCms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenConsultation,
  onOpenCms,
}) => {
  const t = CONTENT[lang].footer;
  const nav = CONTENT[lang].nav;

  return (
    <footer className="bg-[#0B1F33] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand & Purpose Column */}
          <div className="lg:col-span-4">
            <div className="mb-4">
              <ArunaLogo variant="horizontal-tagline" color="white" size="lg" />
            </div>
            <p className="text-xs text-white/70 leading-relaxed mb-6 max-w-sm">
              {t.description}
            </p>
            <div className="text-[11px] text-[#667085]">
              <span className="block font-medium text-white/80">Kategori:</span>
              <span>{t.category}</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B59A5A] block mb-4">
              Navigasi
            </span>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {lang === 'id' ? 'Layanan' : 'Services'}
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-white transition-colors">
                  {lang === 'id' ? 'Industri' : 'Industries'}
                </a>
              </li>
              <li>
                <a href="#how-we-work" className="hover:text-white transition-colors">
                  {lang === 'id' ? 'Cara Kerja' : 'How We Work'}
                </a>
              </li>
              <li>
                <a href="#insights" className="hover:text-white transition-colors">
                  Insights
                </a>
              </li>
              <li>
                <a href="#about-aruna" className="hover:text-white transition-colors">
                  {lang === 'id' ? 'Tentang ARUNA' : 'About ARUNA'}
                </a>
              </li>
              <li>
                <a href="#diagnostic" className="hover:text-white transition-colors">
                  Self-Diagnostic
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Advisory Office */}
          <div className="lg:col-span-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B59A5A] block mb-4">
              {t.contactHeading}
            </span>
            <div className="space-y-3 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#B59A5A] shrink-0 mt-0.5" />
                <span>{t.office}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#B59A5A] shrink-0 mt-0.5" />
                <a href={`mailto:${t.email}`} className="hover:text-white transition-colors">
                  {t.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#B59A5A] shrink-0 mt-0.5" />
                <span>{t.phone}</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#B59A5A] shrink-0 mt-0.5" />
                <a
                  href={t.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#B59A5A] font-semibold underline transition-colors"
                >
                  WhatsApp Konsultasi Cepat
                </a>
              </div>
              <p className="text-[11px] text-[#667085] pt-1">
                {t.workingHours}
              </p>
            </div>
          </div>

          {/* Integrity & Engagement Pledge */}
          <div className="lg:col-span-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B59A5A] block mb-4">
              {t.legalHeading}
            </span>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              {t.disclaimer}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0B1F33] bg-white hover:bg-[#F5F6F7] rounded transition-colors cursor-pointer"
              >
                <span>Bicara dengan Advisor →</span>
              </button>
              <button
                type="button"
                onClick={onOpenCms}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors"
                title="Akses Editorial CMS"
              >
                <Lock className="w-3 h-3 text-[#B59A5A]" />
                <span>CMS Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Business first. Software second.</span>
            <span>·</span>
            <span>Clarity → Structure → Control → Growth</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

