import React, { useState } from 'react';
import { Store, Network, AlertCircle, ArrowRight, CheckCircle2, ChevronRight, Layers, ShieldAlert } from 'lucide-react';
import { Language } from '../types';

interface BusinessMomentProps {
  lang: Language;
  onOpenConsultation: () => void;
}

export const BusinessMoment: React.FC<BusinessMomentProps> = ({
  lang,
  onOpenConsultation,
}) => {
  const [activeAspectIndex, setActiveAspectIndex] = useState(0);

  const complexityDrivers = [
    { label: 'More Transactions', desc: 'Volume transaksi harian meningkat pesat dan sulit direkonsiliasi manual.' },
    { label: 'More Employees', desc: 'Staf baru bekerja dengan kebiasaan berbeda karena SOP belum tersistemasi.' },
    { label: 'More Suppliers', desc: 'Faktur vendor bertumpuk tanpa jadwal jatuh tempo dan alur PO yang jelas.' },
    { label: 'More Inventory', desc: 'Stok antar-lokasi rawan selisih, retur hilang, dan valuasi gudang buram.' },
    { label: 'More Approvals', desc: 'Persetujuan pengeluaran uang masih mengandalkan chat personal yang rawan terlewat.' },
    { label: 'More Financial Activity', desc: 'Laporan laba rugi terlambat berminggu-minggu, mengaburkan margin riil.' },
  ];

  const comparisonItems = [
    {
      aspect: 'Kontrol Stok & Pergudangan',
      single: 'Bisa dicek fisik langsung oleh owner atau kepala toko setiap saat di satu lokasi.',
      multi: 'Stok antar-cabang rawan selisih, retur sulit dilacak, dan kebocoran barang baru disadari saat tutup buku bulanan.',
    },
    {
      aspect: 'Pengadaan & Pembelian (Purchasing)',
      single: 'Order bahan dilakukan via chat WhatsApp informal ke beberapa supplier langganan lama.',
      multi: 'Harga beli supplier sering tidak seragam antar-outlet, PO tidak terkontrol, dan overstock menumpuk modal kerja.',
    },
    {
      aspect: 'Monitoring Kas & Transaksi',
      single: 'Owner dapat memantau laci kasir dan mutasi rekening bank harian secara mandiri.',
      multi: 'Rekonsiliasi transaksi kasir antar-lokasi lambat, potensi fraud meningkat, dan arus kas harian tidak transparan.',
    },
    {
      aspect: 'Laporan Keuangan & Margin',
      single: 'Laporan keuangan manual yang terlambat 2–3 minggu masih dapat ditoleransi.',
      multi: 'Keterlambatan laporan membuat owner tidak tahu outlet mana yang sesungguhnya menyumbang profit dan mana yang bleeding.',
    },
    {
      aspect: 'Ketergantungan Individu & SOP',
      single: 'Toko tetap jalan karena ada 1–2 staf senior yang hafal seluruh seluk-beluk.',
      multi: 'Ketika staf senior tidak ada di cabang baru, operasional kacau karena proses belum terdokumentasi dan tersistemasi.',
    },
  ];

  const symptoms = [
    'Owner sulit mendapatkan gambaran kondisi bisnis secara cepat dan utuh.',
    'Proses kerja berbeda antar orang—bergantung pada siapa yang sedang bertugas.',
    'Data operasional tersebar di spreadsheet terpisah dan tidak konsisten.',
    'Stock, purchasing, sales, dan accounting tidak sepenuhnya terhubung.',
    'Banyak keputusan bisnis krusial masih bergantung pada tebak-tebakan atau informasi manual.',
    'Bisnis sulit distandardisasi ketika ingin menambah unit atau lokasi baru.',
    'Sistem yang digunakan belum mengikuti cara bisnis Anda sesungguhnya bekerja.',
  ];

  return (
    <section id="growth-moment" className="py-20 md:py-28 bg-[#F5F6F7] border-t border-b border-[#EAECF0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Core Growth Trigger Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>MOMEN KRITIS PERTUMBUHAN</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-6">
            Bisnis mulai tumbuh.
            <br />
            Cara kerjanya harus ikut tumbuh.
          </h2>

          <p className="text-base sm:text-lg text-[#667085] leading-relaxed mb-6 font-normal">
            Ketika satu outlet masih bisa dikontrol langsung oleh owner, banyak hal terasa sederhana.
            Namun ketika bisnis mulai berkembang, proses yang belum tertata mulai menjadi masalah.
          </p>

          <div className="p-6 rounded-xl bg-white border border-[#EAECF0] shadow-xs border-l-4 border-l-[#B59A5A]">
            <p className="text-xs uppercase font-mono font-bold tracking-wider text-[#667085] mb-2">
              Refleksi Strategis Pemilik Bisnis
            </p>
            <p className="text-lg sm:text-xl font-medium text-[#0B1F33] leading-relaxed">
              “Pertanyaannya bukan hanya: <em>‘Apakah bisnis saya bisa membuka cabang kedua?’</em>
              <br className="hidden sm:inline" />
              Tetapi: <strong>‘Apakah sistem dan cara kerja bisnis saya siap mengelola cabang kedua?’</strong>”
            </p>
          </div>
        </div>

        {/* Growth Creates Complexity Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#667085]">
                Fakta Lapangan
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
                Pertumbuhan Selalu Menciptakan Kompleksitas
              </h3>
            </div>
            <span className="hidden sm:inline-block text-xs text-[#667085]">
              Eskalasi Volume & Friksi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {complexityDrivers.map((item, idx) => (
              <div
                key={idx}
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

        {/* Section 5: Concise Business Symptoms (Make the Problem Real) */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#EAECF0] shadow-xs mb-16">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-1">
              Diagnosa Gejala Operasional
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] leading-tight mb-2">
              Bisnisnya jalan.
              <br />
              Tapi apakah Anda benar-benar bisa melihat dan mengontrolnya?
            </h3>
            <p className="text-xs sm:text-sm text-[#667085]">
              Jika Anda mengenali situasi berikut, masalahnya bukan pada kerja keras Anda—melainkan sistem kerja yang belum terhubung:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {symptoms.map((symptom, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-lg bg-[#F5F6F7] border border-[#EAECF0]"
              >
                <div className="w-5 h-5 rounded-full bg-white border border-[#EAECF0] text-[#0B1F33] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-[#0B1F33] leading-relaxed font-medium">
                  {symptom}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Comparison Container: 1 Outlet vs Multi-Outlet */}
        <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm overflow-hidden mb-12">
          {/* Top Bar Indicator */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#EAECF0] bg-[#F5F6F7]">
            <div className="md:col-span-4 p-4 sm:p-5 flex items-center justify-between border-b md:border-b-0 md:border-r border-[#EAECF0]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Titik Friksi Operasional
              </span>
              <span className="text-xs text-[#667085] font-mono">
                {activeAspectIndex + 1} / {comparisonItems.length}
              </span>
            </div>
            <div className="md:col-span-4 p-4 sm:p-5 flex items-center gap-2 border-b md:border-b-0 md:border-r border-[#EAECF0]">
              <Store className="w-4 h-4 text-[#667085]" />
              <span className="text-sm font-bold text-[#0B1F33]">
                Realitas 1 Outlet
              </span>
            </div>
            <div className="md:col-span-4 p-4 sm:p-5 flex items-center gap-2 bg-[#0B1F33]/5">
              <Network className="w-4 h-4 text-[#B59A5A]" />
              <span className="text-sm font-bold text-[#0B1F33]">
                Tantangan Multi-Outlet
              </span>
            </div>
          </div>

          {/* Desktop & Tablet Side-by-Side Breakdown */}
          <div className="divide-y divide-[#EAECF0]">
            {comparisonItems.map((item, idx) => {
              const isSelected = activeAspectIndex === idx;
              return (
                <div
                  key={item.aspect}
                  onClick={() => setActiveAspectIndex(idx)}
                  className={`grid grid-cols-1 md:grid-cols-12 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#F5F6F7]' : 'hover:bg-[#F5F6F7]/50'
                  }`}
                >
                  {/* Aspect Title Button */}
                  <div className="md:col-span-4 p-5 md:border-r border-[#EAECF0] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#B59A5A] block mb-0.5">
                        Area 0{idx + 1}
                      </span>
                      <h4 className="text-base font-bold text-[#0B1F33]">
                        {item.aspect}
                      </h4>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-[#667085] transition-transform hidden md:block ${
                        isSelected ? 'transform translate-x-1 text-[#0B1F33]' : 'opacity-40'
                      }`}
                    />
                  </div>

                  {/* Single Outlet Scenario */}
                  <div className="md:col-span-4 p-5 md:border-r border-[#EAECF0] bg-white">
                    <p className="text-sm text-[#667085] leading-relaxed">
                      {item.single}
                    </p>
                  </div>

                  {/* Multi Outlet Friction Scenario */}
                  <div
                    className={`md:col-span-4 p-5 ${
                      isSelected ? 'bg-[#0B1F33]/5' : 'bg-[#F5F6F7]/60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-[#B59A5A] shrink-0 mt-0.5" />
                      <p className="text-sm text-[#0B1F33] font-medium leading-relaxed">
                        {item.multi}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Diagnostic Callout */}
          <div className="p-6 bg-[#0B1F33] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Merasakan salah satu atau beberapa friksi di atas?
              </p>
              <p className="text-xs text-white/80 mt-0.5">
                Ini adalah fase wajar bagi setiap bisnis yang bersiap melompat dari level outlet tunggal ke multi-unit.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenConsultation}
              className="px-5 py-2.5 text-xs font-semibold text-[#0B1F33] bg-white hover:bg-[#F5F6F7] rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              Bicara dengan Advisor →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
