import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { ArunaLogo } from './ArunaLogo';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenConsultation: () => void;
  onOpenCms?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  onOpenConsultation,
  onOpenCms,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simplified public navigation according to Prompt #3 Section 12
  const navLinks = [
    { label: lang === 'id' ? 'Layanan' : 'Services', href: '#services' },
    { label: lang === 'id' ? 'Industri' : 'Industries', href: '#industries' },
    { label: lang === 'id' ? 'Cara Kerja' : 'How We Work', href: '#how-we-work' },
    { label: 'Insights', href: '#insights' },
    { label: lang === 'id' ? 'Tentang ARUNA' : 'About ARUNA', href: '#about-aruna' },
    { label: 'Self-Diagnostic', href: '#diagnostic' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#EAECF0] shadow-xs'
            : 'bg-white border-b border-[#EAECF0]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Zone 1: Pure, clean ARUNA Logo */}
          <a
            href="#"
            className="hover:opacity-90 transition-opacity"
            aria-label="ARUNA Homepage"
          >
            <ArunaLogo variant="horizontal" color="navy" size="md" />
          </a>

          {/* Zone 2: 5 clean navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#667085]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#0B1F33] transition-colors py-1 relative group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B1F33] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Zone 3: Language toggle & Primary Action */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language toggle */}
            <div className="flex items-center bg-[#F5F6F7] p-1 rounded-md text-xs font-semibold text-[#667085]">
              <button
                type="button"
                onClick={() => onLanguageChange('id')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  lang === 'id'
                    ? 'bg-[#0B1F33] text-white'
                    : 'text-[#667085] hover:text-[#0B1F33]'
                }`}
                aria-label="Bahasa Indonesia"
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  lang === 'en'
                    ? 'bg-[#0B1F33] text-white'
                    : 'text-[#667085] hover:text-[#0B1F33]'
                }`}
                aria-label="English"
              >
                EN
              </button>
            </div>

            {/* Primary Action Button: "Bicara dengan Advisor →" */}
            <button
              type="button"
              onClick={onOpenConsultation}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <span>{lang === 'id' ? 'Bicara dengan Advisor' : 'Talk to an Advisor'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#0B1F33] hover:bg-[#F5F6F7] rounded-md transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 z-30 bg-white border-b border-[#EAECF0] shadow-lg px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4 text-base font-medium text-[#0B1F33]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#EAECF0] hover:text-[#B59A5A] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0B1F33] rounded-md hover:bg-[#132D47] transition-colors"
              >
                <span>{lang === 'id' ? 'Bicara dengan Advisor →' : 'Talk to an Advisor →'}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
