import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { CONTENT } from '../data/content';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const t = CONTENT[lang].modal;

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    sector: t.options.sectors[0],
    outlets: t.options.outlets[0],
    challenge: '',
    contact: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.businessName.trim() || !formData.contact.trim()) {
      setErrorMessage(
        lang === 'id'
          ? 'Mohon lengkapi nama, nama bisnis, dan kontak WhatsApp/email Anda.'
          : 'Please complete your name, business name, and contact details.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Simulate reliable advisory dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const prefilledWhatsApp = encodeURIComponent(
    `Halo ARUNA, saya ${formData.name || 'Owner'} dari ${formData.businessName || 'bisnis saya'} (${formData.sector}, ${formData.outlets}). Saya ingin berkonsultasi mengenai tantangan operasional: "${formData.challenge || 'persiapan sistem multi-outlet'}".`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#EAECF0] overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 sm:p-7 bg-[#F5F6F7] border-b border-[#EAECF0] flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-1">
              ARUNA Advisory Discovery
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
              {t.title}
            </h3>
            <p className="text-xs text-[#667085] mt-1">
              {t.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:text-[#0B1F33] hover:bg-white rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Success State */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#F5F6F7] border border-[#B59A5A]/40 text-[#B59A5A] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-[#0B1F33] mb-2">
                {t.successTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto leading-relaxed mb-6">
                {t.successMessage}
              </p>

              <div className="p-4 rounded-lg bg-[#F5F6F7] border border-[#EAECF0] text-left mb-6 text-xs text-[#0B1F33]">
                <p className="font-semibold mb-1">Rincian Diskusi Terjadwal:</p>
                <p>Bisnis: <span className="font-bold">{formData.businessName}</span> ({formData.sector})</p>
                <p>Skala: <span>{formData.outlets}</span></p>
                <p>Kontak: <span>{formData.contact}</span></p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/6281288004560?text=${prefilledWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#B59A5A]" />
                  <span>Buka Chat WhatsApp Langsung</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#0B1F33] bg-[#F5F6F7] hover:bg-[#EAECF0] rounded-md transition-colors cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-md">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                    {t.fields.name} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Hendra Wijaya"
                    className="w-full px-3.5 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                    {t.fields.businessName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Contoh: Kopi Nusantara / Jaya Retail"
                    className="w-full px-3.5 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                    {t.fields.sector}
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                  >
                    {t.options.sectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                    {t.fields.outlets}
                  </label>
                  <select
                    value={formData.outlets}
                    onChange={(e) => setFormData({ ...formData, outlets: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                  >
                    {t.options.outlets.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                  {t.fields.challenge}
                </label>
                <textarea
                  rows={3}
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  placeholder="Misal: Stok sering selisih, PO ke supplier tidak terkontrol, persiapan membuka cabang ke-2..."
                  className="w-full px-3.5 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                  {t.fields.contact} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Nomor WhatsApp aktif (e.g., 0812-xxxx-xxxx) atau Email"
                  className="w-full px-3.5 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{t.submitting}</span>
                  ) : (
                    <>
                      <span>{t.submitButton}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[#667085]">
                  {t.orWhatsApp}{' '}
                  <a
                    href={`https://wa.me/6281288004560?text=${prefilledWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B1F33] font-semibold underline hover:text-[#B59A5A]"
                  >
                    +62 812-8800-4560
                  </a>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
