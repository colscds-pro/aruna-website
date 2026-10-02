import React from 'react';
import { ArrowDown, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface PhilosophyProps {
  lang: Language;
}

export const Philosophy: React.FC<PhilosophyProps> = ({ lang }) => {
  const understandingAreas = [
    {
      num: '01',
      title: 'Bagaimana bisnis beroperasi',
      subtitle: 'How the business operates',
      desc: 'Memahami model bisnis, alur pendapatan, margin riil, dan dinamika interaksi dengan pelanggan di setiap outlet.',
    },
    {
      num: '02',
      title: 'Bagaimana pekerjaan berpindah antar orang',
      subtitle: 'How work moves between people',
      desc: 'Menelusuri serah terima barang, nota pembelian, dan koordinasi harian dari staf lantai toko hingga kantor pusat.',
    },
    {
      num: '03',
      title: 'Di mana tanggung jawab berada',
      subtitle: 'Where responsibility sits',
      desc: 'Memetakan siapa yang berhak menyetujui diskon, siapa yang bertanggung jawab atas selisih stok, dan batas kewenangan tiap peran.',
    },
    {
      num: '04',
      title: 'Di mana informasi diciptakan',
      subtitle: 'Where information is created',
      desc: 'Mengidentifikasi titik pertama data dicatat: saat kasir scan barcode, nota supplier diterima di gudang, atau mutasi bank.',
    },
    {
      num: '05',
      title: 'Di mana keputusan diambil',
      subtitle: 'Where decisions are made',
      desc: 'Memahami dasar manajemen saat memesan barang, menentukan harga jual, dan merencanakan jadwal pembayaran vendor.',
    },
    {
      num: '06',
      title: 'Di mana kendali kerap hilang',
      subtitle: 'Where control is lost',
      desc: 'Menemukan titik friksi rawan kebocoran kas, stok tanpa kartu gantung, retur tak tercatat, dan piutang macet.',
    },
    {
      num: '07',
      title: 'Apa yang perlu distandardisasi',
      subtitle: 'What needs to be standardized',
      desc: 'Mengunci proses-proses yang membutuhkan disiplin mutlak: otorisasi PO, 3-way matching, dan rekonsiliasi kasir harian.',
    },
    {
      num: '08',
      title: 'Apa yang harus tetap fleksibel',
      subtitle: 'What needs to remain flexible',
      desc: 'Menjaga sentuhan khas pelayanan, keunikan racikan produk, dan kelincahan tim yang menjadi keunggulan kompetitif merek Anda.',
    },
  ];

  const hierarchy = [
    {
      level: '01',
      title: 'BUSINESS',
      tagline: 'Logika & Model Bisnis',
      desc: 'Model bisnis, strategi pertumbuhan, struktur pasar, dan keunikan nilai yang membuat pelanggan memilih Anda.',
      role: 'Fondasi utama yang menentukan apa yang ingin dicapai.',
    },
    {
      level: '02',
      title: 'PROCESS',
      tagline: 'Alur Kerja & Tanggung Jawab',
      desc: 'Bagaimana barang, uang, dan keputusan sesungguhnya bergerak di lapangan antar-orang dan antar-unit.',
      role: 'Aturan main operasional yang dirapikan sebelum menggunakan alat bantu.',
    },
    {
      level: '03',
      title: 'SYSTEM',
      tagline: 'Struktur Data & Kontrol',
      desc: 'Mekanisme integrasi antar-bagian, standarisasi master data produk/vendor, dan hierarki validasi otorisasi.',
      role: 'Arsitektur keterhubungan agar data saling berbicara satu bahasa.',
    },
    {
      level: '04',
      title: 'TECHNOLOGY',
      tagline: 'Platform Perangkat Lunak',
      desc: 'Platform ERP, modul operasional, database, dan aplikasi kasir yang menjalankan sistem yang telah tertata.',
      role: 'Enabler yang mengeksekusi alur secara otomatis dan konsisten.',
    },
  ];

  return (
    <section id="about-aruna" className="py-20 md:py-28 bg-[#F5F6F7] border-t border-[#EAECF0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-4xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
            <span>SUDUT PANDANG ARUNA</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-6">
            We start with the business.
            <br />
            Not the software.
          </h2>

          <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#EAECF0] shadow-xs mb-6 border-l-4 border-l-[#0B1F33]">
            <p className="text-lg sm:text-xl font-medium text-[#0B1F33] leading-relaxed">
              “ARUNA tidak memulai dari pertanyaan: <em>‘Software apa yang mau dipakai?’</em>
              <br />
              Kami memulai dari: <strong>‘Bagaimana bisnis ini sebenarnya bekerja?’</strong>”
            </p>
          </div>

          <p className="text-base sm:text-lg text-[#667085] leading-relaxed">
            Banyak implementasi sistem gagal bukan karena software-nya buruk, melainkan karena software langsung dipasang sebelum proses bisnisnya dipahami dan dirapikan. Teknologi harus mengikuti logika bisnis—bukan bisnis yang dipaksa tunduk pada software.
          </p>
        </div>

        {/* 8 Areas ARUNA Understands Before Software */}
        <div className="mb-20">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-1">
              Investigasi Menyeluruh
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F33]">
              Sebelum Memilih Software, Kami Memahami 8 Hal Ini
            </h3>
            <p className="text-xs sm:text-sm text-[#667085] mt-1.5">
              Setiap keputusan sistem harus berakar pada realitas operasional nyata, bukan asumsi di atas kertas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {understandingAreas.map((area) => (
              <div
                key={area.num}
                className="p-5 rounded-xl bg-white border border-[#EAECF0] shadow-xs hover:border-[#0B1F33]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-mono font-bold text-[#B59A5A]">
                      0{area.num}
                    </span>
                    <span className="text-[10px] font-mono text-[#667085] uppercase">
                      Pemahaman Riil
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#0B1F33] mb-1 leading-snug">
                    {area.title}
                  </h4>
                  <p className="text-[11px] font-mono text-[#667085] mb-3">
                    {area.subtitle}
                  </p>
                </div>
                <p className="text-xs text-[#667085] leading-relaxed pt-3 border-t border-[#EAECF0]">
                  {area.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hierarchy of Design: Business -> Process -> System -> Technology */}
        <div className="bg-white rounded-2xl border border-[#EAECF0] p-8 sm:p-12 shadow-xs">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-1">
              Hierarki Perancangan
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F33]">
              Teknologi Selalu Berada di Posisi Terakhir
            </h3>
            <p className="text-xs sm:text-sm text-[#667085] mt-2 leading-relaxed">
              Kami menyusun transformasi bisnis dengan urutan logis yang kokoh. Modul teknologi baru dipasang setelah bisnis, proses, dan sistemnya dipahami secara utuh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
            {hierarchy.map((item, idx) => (
              <div
                key={item.title}
                className={`p-6 rounded-xl border flex flex-col justify-between relative transition-all ${
                  idx === 0
                    ? 'bg-[#0B1F33] text-white border-[#0B1F33] shadow-sm'
                    : 'bg-[#F5F6F7] text-[#0B1F33] border-[#EAECF0]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-mono font-bold ${
                      idx === 0 ? 'text-[#B59A5A]' : 'text-[#667085]'
                    }`}>
                      Tingkat {item.level}
                    </span>
                    {idx < 3 && (
                      <span className={`text-xs font-bold hidden md:inline ${
                        idx === 0 ? 'text-white/60' : 'text-[#667085]'
                      }`}>
                        →
                      </span>
                    )}
                  </div>
                  <h4 className={`text-xl font-extrabold tracking-wider uppercase mb-1 font-mono ${
                    idx === 0 ? 'text-white' : 'text-[#0B1F33]'
                  }`}>
                    {item.title}
                  </h4>
                  <p className={`text-xs font-semibold mb-3 ${
                    idx === 0 ? 'text-[#B59A5A]' : 'text-[#667085]'
                  }`}>
                    {item.tagline}
                  </p>
                  <p className={`text-xs leading-relaxed mb-4 ${
                    idx === 0 ? 'text-white/80' : 'text-[#667085]'
                  }`}>
                    {item.desc}
                  </p>
                </div>
                <div className={`pt-3 border-t text-[11px] font-medium leading-snug ${
                  idx === 0 ? 'border-white/15 text-white/90' : 'border-[#EAECF0] text-[#0B1F33]'
                }`}>
                  {item.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
