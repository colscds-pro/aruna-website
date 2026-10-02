import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';
import { Language } from '../types';

interface MethodologyProps {
  lang: Language;
  onOpenConsultation?: () => void;
}

export const Methodology: React.FC<MethodologyProps> = ({ lang, onOpenConsultation }) => {
  const [selectedStep, setSelectedStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'DISCOVER',
      subtitle: 'Understand the business and its current way of working',
      action: 'Duduk bersama pemilik dan kepala operasional untuk memahami cara bisnis bergerak hari ini: pola pesanan, kebiasaan toko, dan tujuan ekspansi.',
      output: 'Pemahaman mendalam tentang konteks bisnis, batas kendali, dan prioritas perbaikan.',
    },
    {
      num: '02',
      title: 'ANALYZE',
      subtitle: 'Identify problems, gaps, dependencies, and opportunities',
      action: 'Mengidentifikasi masalah, celah kebocoran stok, penumpukan faktur, dan dependensi proses pada orang tertentu di lantai toko atau gudang.',
      output: 'Peta diagnosa friksi operasional dan peluang standardisasi alur kerja.',
    },
    {
      num: '03',
      title: 'PREPARE',
      subtitle: 'Prepare the business, process, system structure, and data',
      action: 'Menata alur kerja target, merumuskan batas wewenang persetujuan (approval), dan menyiapkan struktur data yang dibutuhkan.',
      output: 'Alur kerja terstruktur (SOP praktis) dan arsitektur sistem yang siap dibangun.',
    },
    {
      num: '04',
      title: 'CONFIGURE',
      subtitle: 'Configure the solution according to the business context',
      action: 'Mengonfigurasi solusi ERP dan sistem pendukung agar sesuai dengan konteks bisnis Anda—tanpa modul rumit yang tidak diperlukan.',
      output: 'Sistem yang ramping, tepat guna, dan mencerminkan cara bisnis Anda bekerja.',
    },
    {
      num: '05',
      title: 'DATA',
      subtitle: 'Prepare and organize the required master data',
      action: 'Merapikan dan menstandarkan master data: penamaan SKU produk, harga beli supplier, harga jual, dan bagan akun pembukuan.',
      output: 'Master data bersih, konsisten, dan bebas dari duplikasi.',
    },
    {
      num: '06',
      title: 'ENABLE',
      subtitle: 'Train people and help them understand the new way of working',
      action: 'Melatih staf dan tim manajemen. Kami menjelaskan tidak hanya BAGAIMANA cara menginput data, tetapi MENGAPA proses bisnisnya berjalan demikian.',
      output: 'Tim lapangan yang memahami tanggung jawabnya dan disiplin menjalankan sistem.',
    },
    {
      num: '07',
      title: 'GO LIVE',
      subtitle: 'Launch the system and support the transition into daily operations',
      action: 'Meluncurkan sistem baru secara bertahap dengan pendampingan langsung saat cutover saldo awal dan transaksi harian perdana.',
      output: 'Transisi yang tenang, operasional tetap berjalan, dan kendali berada di tangan Anda.',
    },
  ];

  return (
    <section id="how-we-work" className="py-20 md:py-28 bg-white border-t border-[#EAECF0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>CARA KERJA KAMI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-5">
            Metodologi Implementasi ARUNA
          </h2>

          <p className="text-base sm:text-lg text-[#667085] leading-relaxed">
            Kami tidak langsung memasang software. Transformasi operasional dibangun melalui tahapan nyata yang disiplin, berurutan, dan terukur.
          </p>
        </div>

        {/* Essential Implementation Tenet Callout */}
        <div className="p-6 sm:p-8 rounded-xl bg-[#F5F6F7] border border-[#EAECF0] mb-12 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-white border border-[#EAECF0] flex items-center justify-center shrink-0 text-[#B59A5A]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0B1F33] uppercase tracking-wider mb-1">
              ARUNA Tidak Sekadar Memasang Software
            </h4>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Edukasi dan pemahaman adalah bagian tak terpisahkan dari implementasi. Kami memastikan tim Anda memahami tidak hanya <em>“bagaimana menggunakan sistem”</em>, melainkan juga <strong>“mengapa proses bisnisnya berjalan seperti itu.”</strong>
            </p>
          </div>
        </div>

        {/* 7-Step Interactive Pipeline */}
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
            {steps.map((step, idx) => {
              const isSelected = selectedStep === idx;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setSelectedStep(idx)}
                  className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B1F33] text-white border-[#0B1F33] shadow-sm'
                      : 'bg-white text-[#0B1F33] border-[#EAECF0] hover:bg-[#F5F6F7]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono block mb-1 uppercase tracking-wider ${
                      isSelected ? 'text-[#B59A5A]' : 'text-[#667085]'
                    }`}
                  >
                    0{step.num}
                  </span>
                  <span className="text-xs font-bold block truncate">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Deep-Dive Card */}
          <div className="bg-[#F5F6F7] p-8 sm:p-10 rounded-xl border border-[#EAECF0] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EAECF0]">
              <div>
                <span className="text-xs font-mono font-bold text-[#B59A5A] uppercase tracking-wider block mb-1">
                  Tahap 0{steps[selectedStep].num} Dari 07
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F33]">
                  {steps[selectedStep].title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#667085]">
                {steps[selectedStep].subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-[#EAECF0]">
                <span className="text-xs font-bold text-[#0B1F33] uppercase tracking-wider block mb-2 font-mono">
                  Aktivitas di Lapangan:
                </span>
                <p className="text-sm text-[#667085] leading-relaxed">
                  {steps[selectedStep].action}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-[#EAECF0]">
                <span className="text-xs font-bold text-[#B59A5A] uppercase tracking-wider block mb-2 font-mono">
                  Hasil yang Dicapai (Output):
                </span>
                <p className="text-sm text-[#0B1F33] font-medium leading-relaxed">
                  {steps[selectedStep].output}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Advisory Action Callout */}
        {onOpenConsultation && (
          <div className="mt-10 p-6 rounded-xl bg-white border border-[#EAECF0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-[#0B1F33]">
                Ingin mengetahui bagaimana alur 7 langkah ini diterapkan pada bisnis Anda?
              </h4>
              <p className="text-xs text-[#667085] mt-0.5">
                Konsultasi awal kami berfokus pada memahami kondisi operasional Anda saat ini.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenConsultation}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-xs shrink-0"
            >
              Bicara dengan Advisor →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
