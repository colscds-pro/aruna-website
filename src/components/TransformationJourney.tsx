import React, { useState } from 'react';
import { Eye, LayoutGrid, SlidersHorizontal, TrendingUp, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface TransformationJourneyProps {
  lang: Language;
  onOpenConsultation?: () => void;
}

export const TransformationJourney: React.FC<TransformationJourneyProps> = ({ lang, onOpenConsultation }) => {
  const [activeStage, setActiveStage] = useState(0);

  const principles = [
    {
      num: '01',
      title: 'BUSINESS FIRST',
      desc: 'Memahami bagaimana bisnis benar-benar bekerja.',
      detail: 'Model bisnis, dinamika margin riil, dan cara tim berinteraksi di lapangan dipelajari terlebih dahulu sebelum membicarakan software apapun.',
    },
    {
      num: '02',
      title: 'PROCESS FIRST',
      desc: 'Menata proses, tanggung jawab, dan alur kerja.',
      detail: 'Menetapkan siapa melakukan apa, batas wewenang persetujuan, dan standardisasi alur penerimaan barang serta kasir.',
    },
    {
      num: '03',
      title: 'CONTROL BEFORE GROWTH',
      desc: 'Membangun visibility dan control sebelum memperbesar kompleksitas bisnis.',
      detail: 'Memastikan satu atau beberapa outlet yang ada sudah rapi dan transparan sebelum menambah beban cabang baru.',
    },
    {
      num: '04',
      title: 'TECHNOLOGY ENABLES',
      desc: 'Menggunakan teknologi untuk menjalankan sistem bisnis yang sudah dipahami dan ditata.',
      detail: 'Software bukan pusat segalanya—ia adalah enabler yang mengunci alur tertata agar berjalan otomatis dan konsisten.',
    },
  ];

  const stages = [
    {
      step: '01',
      name: 'CLARITY',
      tagline: 'Memahami cara bisnis bekerja',
      description: 'Menyingkap bagaimana barang, uang, dan keputusan sesungguhnya bergerak di lapangan tanpa ada yang ditutup-tutupi.',
    },
    {
      step: '02',
      name: 'STRUCTURE',
      tagline: 'Merapikan proses & peran',
      description: 'Menstandarkan alur kerja, membersihkan master data produk dan vendor, serta menegaskan batas wewenang tiap peran.',
    },
    {
      step: '03',
      name: 'CONTROL',
      tagline: 'Memperoleh visibilitas penuh',
      description: 'Menghubungkan penjualan, inventori, pembelian, dan pembukuan dalam satu bahasa data yang akurat setiap hari.',
    },
    {
      step: '04',
      name: 'GROWTH',
      tagline: 'Fondasi siap ekspansi',
      description: 'Membuka cabang kedua dan seterusnya dengan percaya diri karena cara kerjanya sudah terbukti dan dapat direplikasi.',
    },
  ];

  const makeSensePoints = [
    'Proses kerja make sense',
    'Tanggung jawab make sense',
    'Data operasional make sense',
    'Sistem kerja make sense',
    'Standar baku make sense',
    'Penanganan anomali make sense',
    'Teknologi make sense',
    'Manajemen paham apa yang terjadi',
  ];

  return (
    <section id="principles" className="py-20 md:py-28 bg-[#0B1F33] text-white relative overflow-hidden">
      {/* Subtle architectural grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>PRINSIP & TRANSFORMASI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            Empat Prinsip Kerja ARUNA
          </h2>

          <p className="text-base sm:text-lg text-white/80 leading-relaxed">
            Kami tidak menawarkan jalan pintas instan. Kami memandu bisnis Anda melalui empat prinsip fundamental agar pertumbuhan bisnis diiringi dengan kendali nyata.
          </p>
        </div>

        {/* 4 Concise Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {principles.map((p) => (
            <div
              key={p.num}
              className="p-7 rounded-xl bg-[#132D47]/80 border border-white/10 hover:border-[#B59A5A]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#B59A5A] block mb-3">
                  PRINSIP {p.num}
                </span>
                <h3 className="text-xl font-extrabold tracking-wider text-white mb-2 uppercase font-mono">
                  {p.title}
                </h3>
                <p className="text-sm font-semibold text-[#B59A5A] mb-4">
                  {p.desc}
                </p>
              </div>
              <p className="text-xs text-white/70 leading-relaxed pt-3 border-t border-white/10">
                {p.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Core Progression: CLARITY -> STRUCTURE -> CONTROL -> GROWTH */}
        <div className="mb-20">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-1">
              Alur Transformasi
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Dari Keraguan Menuju Kendali Nyata
            </h3>
            <p className="text-xs sm:text-sm text-white/70 mt-1">
              Sebuah perkembangan bertahap yang menjaga stabilitas bisnis Anda di setiap langkah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stages.map((stage, idx) => {
              const isSelected = activeStage === idx;
              return (
                <div
                  key={stage.name}
                  onClick={() => setActiveStage(idx)}
                  className={`p-6 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#132D47] border-[#B59A5A] shadow-lg'
                      : 'bg-[#0E263E] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-semibold tracking-widest text-[#B59A5A]">
                        {stage.step}
                      </span>
                      {idx < 3 && (
                        <span className="text-xs font-bold text-white/40 hidden lg:inline">
                          →
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-bold tracking-tight text-white mb-1.5 font-mono">
                      {stage.name}
                    </h4>

                    <p className="text-xs font-semibold text-[#B59A5A] mb-3">
                      {stage.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-white/75 leading-relaxed pt-3 border-t border-white/10">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meaning of MAKE BUSINESS MAKE SENSE & Emotional Climax */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#132D47] to-[#0E263E] border border-white/15 max-w-4xl mx-auto shadow-xl">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59A5A] block mb-2 font-mono">
              Makna di Balik Tagline
            </span>
            <h4 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              MAKE BUSINESS MAKE SENSE
            </h4>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
              ARUNA tidak menjanjikan bisnis menjadi "mudah" secara instan. ARUNA membantu bisnis Anda menjadi masuk akal:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-2xl mx-auto">
            {makeSensePoints.map((point, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#B59A5A] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-white/90">{point}</span>
              </div>
            ))}
          </div>

          {/* Emotional focal quote */}
          <div className="pt-8 border-t border-white/10 text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B59A5A] block mb-2">
              Perasaan Utama yang Ingin Kami Capai
            </span>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
              “AKHIRNYA KAMI BISA KONTROL BISNIS KAMI.”
            </p>
            <p className="text-xs sm:text-sm text-white/75 max-w-md mx-auto mb-6">
              Ketenangan seorang pemilik bisnis saat stok, pergerakan kas, dan operasional tiap outlet tidak lagi menjadi misteri harian.
            </p>

            {onOpenConsultation && (
              <button
                type="button"
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-[#0B1F33] bg-white hover:bg-[#F5F6F7] rounded-md transition-colors shadow-sm cursor-pointer"
              >
                <span>Bicara dengan Advisor →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
