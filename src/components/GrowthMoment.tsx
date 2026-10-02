import React, { useState } from 'react';
import { Store, Network, Building2, AlertCircle, ChevronRight } from 'lucide-react';
import { Language } from '../types';

interface GrowthMomentProps {
  lang: Language;
  onOpenConsultation?: () => void;
}

export const GrowthMoment: React.FC<GrowthMomentProps> = ({
  lang,
  onOpenConsultation,
}) => {
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages = [
    {
      level: '1 OUTLET',
      label: 'Outlet Tunggal',
      tagline: 'Kontrol Langsung oleh Owner',
      desc: 'Supervisi fisik harian langsung oleh pemilik. Masalah operasional masih bisa diselesaikan di tempat, komunikasi lisan berjalan fleksibel, dan toleransi kebocoran masih tertutupi omzet.',
      reality: 'Owner masih dapat memantau laci kasir dan stok gudang dengan mata sendiri setiap saat.',
      risk: 'Bisnis bergantung penuh pada kehadiran fisik pemilik dan 1–2 staf kunci.',
      status: 'Terkendali secara manual',
    },
    {
      level: '2 OUTLETS',
      label: 'Cabang Kedua',
      tagline: 'Titik Friksi Pertama',
      desc: 'Owner tidak bisa berada di dua tempat sekaligus. Waktu habis untuk bolak-balik memeriksa stok, menagih laporan kasir, dan menengahi kebiasaan kerja yang berbeda antar-tim toko.',
      reality: 'Transfer stok antar-toko rawan selisih, PO tidak seragam, dan laporan keuangan mulai tertunda.',
      risk: 'Masalah di cabang pertama terduplikasi dan berlipat ganda di cabang kedua.',
      status: 'Momen kritis transisi',
    },
    {
      level: 'MULTI-OUTLET',
      label: 'Multi-Outlet Business',
      tagline: 'Kendali Berbasis Sistem',
      desc: 'Operasional tidak lagi bergantung pada kehadiran fisik siapapun. Standar kerja, otorisasi transaksi, dan visibilitas angka terhubung otomatis ke satu pusat kontrol manajerial.',
      reality: 'Seluruh outlet beroperasi dengan SOP dan sistem data yang terintegrasi, transparan, dan terukur.',
      risk: 'Hanya bisa tercapai jika proses dan struktur sistem telah dirapikan.',
      status: 'Kesiapan ekspansi berkelanjutan',
    },
  ];

  const complexityDrivers = [
    { label: 'More Transactions', desc: 'Volume transaksi harian melonjak dan mustahil direkonsiliasi manual satu per satu.' },
    { label: 'More Employees', desc: 'Staf baru bekerja dengan kebiasaan berbeda karena SOP belum terkunci dalam sistem.' },
    { label: 'More Suppliers', desc: 'Faktur vendor bertumpuk tanpa jadwal jatuh tempo dan alur PO yang baku.' },
    { label: 'More Inventory', desc: 'Stok antar-lokasi rawan selisih, retur hilang, dan valuasi persediaan buram.' },
    { label: 'More Approvals', desc: 'Persetujuan pengeluaran dana masih lewat chat personal yang rawan terlewat.' },
    { label: 'More Financial Activity', desc: 'Laporan laba rugi terlambat berminggu-minggu, mengaburkan margin riil tiap unit.' },
    { label: 'More Decisions', desc: 'Keputusan operasional mendesak tertahan karena menunggu arahan owner.' },
    { label: 'More Outlets', desc: 'Setiap penambahan lokasi baru menuntut konsistensi standar yang dapat direplikasi.' },
  ];

  return (
    <section id="growth-moment" className="py-20 md:py-28 bg-[#F5F6F7] border-t border-b border-[#EAECF0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>MOMEN KRITIS PERTUMBUHAN</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-5">
            Bisnis mulai tumbuh.
            <br />
            Cara kerjanya harus ikut tumbuh.
          </h2>

          <p className="text-base sm:text-lg text-[#667085] leading-relaxed mb-4">
            Ketika satu outlet masih bisa dikontrol langsung oleh owner, banyak hal terasa sederhana.
            Namun ketika bisnis mulai berkembang, proses yang belum tertata mulai menjadi masalah.
          </p>

          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            Membuka cabang kedua bukan hanya tentang mencari lokasi, merekrut orang, atau menyiapkan modal.
            Bisnis juga membutuhkan cara kerja yang bisa diulang, dipantau, dan dikontrol.
          </p>
        </div>

        {/* Strategic Reflection Card */}
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#EAECF0] shadow-xs border-l-4 border-l-[#B59A5A] mb-16 max-w-4xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#667085] block mb-2">
            Pertanyaan Kunci Pemilik Bisnis
          </span>
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#0B1F33] leading-relaxed">
            “Pertanyaannya bukan hanya: <em>‘Apakah bisnis saya bisa membuka cabang kedua?’</em>
            <br />
            Tetapi: <strong>‘Apakah sistem dan cara kerja bisnis saya siap mengelola cabang kedua?’</strong>”
          </p>
          <p className="text-xs text-[#667085] mt-3">
            Tujuan dari tahap ini bukan mengatakan setiap bisnis wajib memakai ERP, melainkan membangun kesadaran bahwa pertumbuhan menuntut kesiapan organisasi dan proses.
          </p>
        </div>

        {/* Visual Relationship: 1 OUTLET -> 2 OUTLETS -> MULTI-OUTLET BUSINESS */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EAECF0]">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B59A5A]">
                Evolusi Skala & Kendali
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
                Dinamika Operasional Berubah Seiring Pertumbuhan
              </h3>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono text-[#667085]">
              1 Outlet → Multi-Outlet
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stages.map((stg, idx) => {
              const isSelected = activeStage === idx;
              return (
                <div
                  key={stg.level}
                  onClick={() => setActiveStage(idx)}
                  className={`p-6 sm:p-7 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#0B1F33] shadow-md ring-1 ring-[#0B1F33]'
                      : 'bg-white/80 border-[#EAECF0] hover:bg-white hover:border-[#0B1F33]/30 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Store className="w-4 h-4 text-[#667085]" />}
                        {idx === 1 && <Network className="w-4 h-4 text-[#B59A5A]" />}
                        {idx === 2 && <Building2 className="w-4 h-4 text-[#0B1F33]" />}
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F33]">
                          {stg.level}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        idx === 1 ? 'bg-[#0B1F33]/5 text-[#B59A5A]' : 'bg-[#F5F6F7] text-[#667085]'
                      }`}>
                        {stg.status}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-[#0B1F33] mb-1">
                      {stg.tagline}
                    </h4>
                    <p className="text-xs font-semibold text-[#667085] mb-4">
                      {stg.label}
                    </p>

                    <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-5">
                      {stg.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EAECF0] space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-[#0B1F33] block">Realitas di Lapangan:</span>
                      <span className="text-[#667085]">{stg.reality}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#0B1F33] block">Tantangan Kunci:</span>
                      <span className="text-[#667085]">{stg.risk}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth Creates Complexity (8 items) */}
        <div>
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#667085]">
              Realitas Lapangan
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
              Pertumbuhan Selalu Membawa Kompleksitas Baru
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {complexityDrivers.map((item, idx) => (
              <div
                key={item.label}
                className="p-5 rounded-lg bg-white border border-[#EAECF0] shadow-2xs hover:border-[#0B1F33]/30 transition-colors"
              >
                <span className="text-xs font-mono font-bold text-[#B59A5A] uppercase block mb-1">
                  0{idx + 1} · {item.label}
                </span>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
