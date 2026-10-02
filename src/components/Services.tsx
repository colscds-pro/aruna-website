import React from 'react';
import { CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface ServicesProps {
  lang: Language;
  onOpenConsultation: () => void;
}

export const Services: React.FC<ServicesProps> = ({ lang, onOpenConsultation }) => {
  const readyServices = [
    {
      num: '01',
      title: 'ERP Implementation',
      subtitle: 'Menerjemahkan proses bisnis ke dalam sistem ERP yang tepat',
      outcome: 'Konfigurasi ERP yang ramping, tepat guna, dan selaras dengan cara kerja nyata tim Anda.',
      desc: 'Penerapan sistem ERP yang disesuaikan secara proporsional dengan skala bisnis retail, F&B, dan hospitality. Kami memastikan modul inventori, purchasing, invoicing, dan accounting berbicara dalam satu bahasa data.',
      deliverables: [
        'Konfigurasi modul ERP berbasis alur kerja nyata bisnis',
        'Penyelarasan alur faktur supplier (AP) dan piutang toko (AR)',
        'Mekanisme transfer barang antar-gudang dan cabang',
        'Penyusunan bagan akun (Chart of Accounts) standar industri',
      ],
    },
    {
      num: '02',
      title: 'Odoo Migration',
      subtitle: 'Memperbaiki implementasi lama yang macet atau terlalu rumit',
      outcome: 'Sistem Odoo yang bersih, stabil, dan kembali selaras dengan proses bisnis yang telah dirapikan.',
      desc: 'Bagi bisnis yang sebelumnya telah menggunakan Odoo namun implementasinya tersendat, modul kustom berlebihan, atau ditinggalkan oleh tim operasional, kami merapikan kembali arsitektur data dan alurnya.',
      deliverables: [
        'Audit konfigurasi modul yang membebani tim lapangan',
        'Pembersihan dan migrasi saldo awal persediaan yang valid',
        'Penyederhanaan antarmuka agar mudah dijalankan kasir dan gudang',
        'Pelatihan ulang staf agar disiplin input kembali terbentuk',
      ],
    },
    {
      num: '03',
      title: 'Business Process & System Advisory',
      subtitle: 'Menata alur kerja, peran, dan kontrol sebelum menyentuh software',
      outcome: 'Kejelasan alur kerja riil, identifikasi titik kebocoran kas/stok, dan eliminasi friksi operasional.',
      desc: 'Kami membedah alur operasional langsung di lapangan bersama pemilik dan tim pelaksana: bagaimana pembelian diorder, barang diterima, stok disimpan, pesanan diproses, dan mutasi dicatat.',
      deliverables: [
        'Pemetaan alur kerja operasional end-to-end (As-Is vs To-Be)',
        'Identifikasi titik rawan selisih persediaan & kebocoran kas',
        'Standardisasi batas wewenang persetujuan (approval matrix)',
        'Pembersihan dan standardisasi penamaan master data SKU',
      ],
    },
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-[#F5F6F7] border-t border-[#EAECF0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>LAYANAN KAMI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-4">
            Layanan Berbasis Hasil Bisnis, Bukan Modul Software
          </h2>

          <p className="text-base sm:text-lg text-[#667085] leading-relaxed">
            Kami tidak menjual software lepas. Setiap layanan ARUNA dirancang untuk menata cara bisnis Anda bekerja dan membangun kontrol nyata sebelum maupun sesudah teknologi diterapkan.
          </p>
        </div>

        {/* 3 Core Ready Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {readyServices.map((svc) => (
            <div
              key={svc.num}
              className="bg-white p-7 sm:p-8 rounded-xl border border-[#EAECF0] shadow-xs flex flex-col justify-between hover:border-[#0B1F33]/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#B59A5A]">
                    {svc.num}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#667085] uppercase tracking-wider bg-[#F5F6F7] px-2 py-0.5 rounded">
                    Layanan Siap
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0B1F33] mb-1.5 group-hover:text-[#0B1F33] transition-colors">
                  {svc.title}
                </h3>

                <p className="text-xs font-semibold text-[#667085] mb-4">
                  {svc.subtitle}
                </p>

                <div className="p-3.5 rounded-md bg-[#F5F6F7] border border-[#EAECF0] mb-5">
                  <span className="text-[10px] font-mono font-bold text-[#B59A5A] block uppercase tracking-wider mb-1">
                    Hasil yang Diharapkan:
                  </span>
                  <p className="text-xs font-medium text-[#0B1F33] leading-snug">
                    {svc.outcome}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-6">
                  {svc.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAECF0]">
                <span className="text-xs font-bold text-[#0B1F33] block mb-2.5 font-mono">
                  Cakupan Kerja:
                </span>
                <ul className="space-y-2">
                  {svc.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#667085]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B59A5A] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Clear & Honest Platform Positioning (Critical Odoo positioning) */}
        <div className="p-6 sm:p-7 rounded-xl bg-white border border-[#EAECF0] shadow-xs mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0B1F33]/5 text-[#0B1F33] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#B59A5A]" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-1 font-mono">
              Posisi Kemitraan & Independensi Teknologi
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Odoo adalah platform perangkat lunak yang kami gunakan sebagai enabler implementasi ERP dan transformasi bisnis. <strong>ARUNA adalah mitra penasihat transformasi bisnis independen—bukan mitra resmi (official partner) atau reseller software Odoo.</strong> Fokus utama kami adalah memastikan alur bisnis Anda berjalan benar, bebas dari dorongan penjualan lisensi yang tidak Anda butuhkan.
            </p>
          </div>
        </div>

        {/* Bottom Consultation Callout */}
        <div className="p-6 rounded-xl bg-white border border-[#EAECF0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h4 className="text-sm font-bold text-[#0B1F33]">
              Ingin memahami layanan mana yang paling tepat untuk skala bisnis Anda?
            </h4>
            <p className="text-xs text-[#667085] mt-0.5">
              Konsultasi awal kami berfokus pada memahami kondisi bisnis Anda—tanpa tekanan penjualan software.
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
      </div>
    </section>
  );
};
