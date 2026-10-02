import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface SymptomsSectionProps {
  lang: Language;
  onOpenConsultation?: () => void;
}

export const SymptomsSection: React.FC<SymptomsSectionProps> = ({
  lang,
  onOpenConsultation,
}) => {
  const symptoms = [
    {
      num: '01',
      title: 'Owner harus bertanya ke banyak orang untuk tahu kondisi bisnis',
      detail: 'Untuk mengetahui stok gudang, sisa kas, atau status faktur supplier, Anda harus mengirim pesan satu per satu ke kasir, kepala gudang, dan staf admin.',
    },
    {
      num: '02',
      title: 'Data penjualan, stok, pembelian, dan keuangan belum terhubung',
      detail: 'Setiap bagian memiliki catatan sendiri. Kasir mencatat di POS, gudang di buku mutasi, admin di spreadsheet, dan akunting di software terpisah.',
    },
    {
      num: '03',
      title: 'Cara kerja berbeda antar orang atau outlet',
      detail: 'Hasil dan kecepatan kerja bergantung pada siapa yang bertugas hari itu. Tidak ada standar baku yang otomatis membimbing staf baru.',
    },
    {
      num: '04',
      title: 'Banyak pekerjaan masih bergantung pada spreadsheet',
      detail: 'File Excel bertumpuk dengan berbagai versi revisi yang mudah terhapus, rentan salah rumus, dan lambat direkonsiliasi di akhir bulan.',
    },
    {
      num: '05',
      title: 'SOP ada, tetapi pelaksanaannya tidak konsisten',
      detail: 'Dokumen prosedur tersimpan di lemari atau file PDF, namun di lapangan staf tetap mengambil jalan pintas karena sistem tidak memvalidasi alur tersebut.',
    },
    {
      num: '06',
      title: 'Sulit mengetahui angka bisnis secara cepat dan akurat',
      detail: 'Laporan laba rugi dan posisi margin riil baru selesai berminggu-minggu setelah tutup buku, membuat keputusan penting terlambat diambil.',
    },
    {
      num: '07',
      title: 'Membuka cabang baru terasa seperti mengulang kekacauan yang sama',
      detail: 'Rencana ekspansi tertunda karena Anda khawatir masalah operasional di toko pertama akan berlipat ganda di unit baru.',
    },
  ];

  return (
    <section id="symptoms" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>DIAGNOSA KONDISI OPERASIONAL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-5">
            Apakah bisnis Anda mulai terasa sulit dikontrol?
          </h2>

          <p className="text-base sm:text-lg text-[#667085] leading-relaxed mb-3">
            Jika Anda mengenali situasi berikut, bisnis Anda tidak sedang gagal. Bisnis Anda sedang bertumbuh—hanya saja cara kerjanya belum mengikuti skala baru tersebut.
          </p>
          <p className="text-xs sm:text-sm text-[#667085]">
            Kenali gejala-gejala umum yang kerap dirasakan para pemilik bisnis saat bertransisi dari satu unit ke multi-unit:
          </p>
        </div>

        {/* 7 Concise Symptoms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {symptoms.map((item, idx) => (
            <div
              key={item.num}
              className={`p-6 rounded-xl border border-[#EAECF0] bg-white hover:border-[#0B1F33]/30 transition-all shadow-xs flex flex-col justify-between ${
                idx === 6 ? 'md:col-span-2 lg:col-span-1 bg-[#F5F6F7]/60' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#B59A5A]">
                    Gejala {item.num}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#B59A5A]/50" />
                </div>
                <h3 className="text-base font-bold text-[#0B1F33] leading-snug mb-2.5">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mt-2">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Reassurance & Gentle Action Banner */}
        <div className="p-6 sm:p-8 rounded-xl bg-[#F5F6F7] border border-[#EAECF0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h4 className="text-base sm:text-lg font-bold text-[#0B1F33] mb-1">
              Mengenali beberapa tanda di atas pada bisnis Anda?
            </h4>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Ini bukan kegagalan manajerial. Ini adalah penanda alami bahwa bisnis Anda telah mencapai titik di mana intuisi personal harus mulai bertransformasi menjadi sistem terstruktur.
            </p>
          </div>

          {onOpenConsultation && (
            <button
              type="button"
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors whitespace-nowrap shadow-xs cursor-pointer shrink-0"
            >
              <span>Diskusikan dengan Advisor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
