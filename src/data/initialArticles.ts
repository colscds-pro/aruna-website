import { Article, Author } from '../types';
import { BUNDLED_IMAGES } from '../assets/bundledImages';

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 'muhammad-nurcholish',
    name: 'Muhammad Nurcholish',
    role: 'Founder, ARUNA',
    bio: 'Founder ARUNA. Praktisi transformasi bisnis dan implementasi ERP untuk industri retail, F&B, dan hospitality di Indonesia. Berfokus membantu para pemilik bisnis membangun struktur operasional yang masuk akal sebelum menyentuh konfigurasi sistem teknologi.',
    photoUrl: BUNDLED_IMAGES.authorNurcholish,
    avatarUrl: 'authors/author_nurcholish.jpg',
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'ERP Tidak Akan Memperbaiki Proses Bisnis yang Berantakan',
    slug: 'erp-tidak-akan-memperbaiki-proses-bisnis-yang-berantakan',
    excerpt: 'Banyak pemilik bisnis berharap software ERP akan secara otomatis menyelesaikan kebocoran persediaan dan kesemrawutan kas. Realitasnya: software hanya mempercepat alur yang ada—jika alurnya belum ditata, teknologi hanya akan mengotomatisasi kekacauan.',
    category: 'ERP & TECHNOLOGY',
    authorId: 'muhammad-nurcholish',
    status: 'published',
    featured: true,
    publishedAt: '2026-09-18',
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-18T10:30:00Z',
    readingTime: 6,
    coverImage: BUNDLED_IMAGES.erpInsight,
    coverImageUrl: 'insights/insight_erp_foundation.jpg',
    seoTitle: 'ERP Tidak Akan Memperbaiki Proses Bisnis yang Berantakan | ARUNA Insights',
    seoDescription: 'Mengapa software ERP tidak bisa menyelesaikan masalah bisnis sebelum alur proses dan otorisasi dirapikan terlebih dahulu.',
    content: `Setiap beberapa bulan, kami bertemu dengan pemilik bisnis yang merasa lelah dengan operasionalnya.

Ceritanya hampir selalu serupa:
Stok barang sering selisih tanpa ada yang tahu letak kebocorannya. Faktur pembelian dari supplier menumpuk di meja admin tanpa kepastian jatuh tempo. Kasir di outlet sering mengalami selisih settlement kartu di akhir shift.

Dan kesimpulan yang kerap diambil oleh sang pemilik:
*"Bisnis gue butuh ERP secepatnya."*

Namun di ARUNA, kami selalu mengawali pertemuan dengan sebuah pengingat yang penting:

> **"ERP bukan obat untuk proses bisnis yang belum tertata. Jika alur kerja Anda hari ini berantakan, memasang ERP hanya akan mengotomatisasi kekacauan tersebut dengan biaya yang jauh lebih mahal."**

---

### Software Tidak Mengambil Keputusan Operasional

Software—apakah itu Odoo atau sistem lainnya—hanyalah alat pencatat yang patuh. Ia tidak bisa menegur staf gudang yang menerima barang tanpa surat jalan resmi. Ia tidak bisa melarang staf mengambil bahan tanpa memo otorisasi.

Jika di lapangan:
1. Alur persetujuan Purchase Order (PO) masih berupa chat WhatsApp informal,
2. Penerimaan barang fisik tidak dicocokkan dengan PO (3-way matching),
3. Pemilik bisnis masih sering mengambil uang kas toko tanpa memo pencatatan resmi,

maka sistem ERP secanggih apa pun akan ditolak oleh tim lapangan dalam beberapa bulan.

Alasannya sederhana: tim lapangan akan merasa sistem baru hanya memperlambat pekerjaan mereka. Mereka akan mencari jalan pintas manual, kembali menggunakan spreadsheet terpisah, dan software hanya menjadi beban administratif.

---

### Urutan yang Benar: Bisnis Dulu, Baru Software

Di ARUNA, filosofi kami tegas: **Business first. Software second.**

Kami merapikan alur kerjanya terlebih dahulu:
1. Menata batas wewenang persetujuan pembelian.
2. Memastikan dokumen serah terima barang antar-toko berjalan tertib.
3. Membersihkan master data produk dan menyusun bagan akun yang masuk akal.

Baru setelah alur bisnisnya masuk akal, kita konfigurasikan software untuk mengunci disiplin tersebut secara otomatis.

Ketika fondasinya sudah rapi, sistem ERP bukan lagi beban yang menyiksa tim, melainkan sayap yang memungkinkan bisnis Anda berkembang dengan ketenangan pikiran.`,
  },
  {
    id: 'art-2',
    title: 'Buka Cabang Kedua Bukan Cuma Soal Modal',
    slug: 'buka-cabang-kedua-bukan-cuma-soal-modal',
    excerpt: 'Saat masih satu outlet, bisnis bisa bertahan berkat pengawasan fisik langsung dari pemilik. Namun saat cabang kedua dibuka, kompleksitas melipatgandakan risiko. Kenali tanda-tanda sistem Anda belum siap sebelum menandatangani sewa baru.',
    category: 'BUSINESS',
    authorId: 'muhammad-nurcholish',
    status: 'published',
    featured: true,
    publishedAt: '2026-09-24',
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-09-24T14:15:00Z',
    readingTime: 5,
    coverImage: BUNDLED_IMAGES.branchInsight,
    coverImageUrl: 'insights/insight_second_branch.jpg',
    seoTitle: 'Buka Cabang Kedua Bukan Cuma Soal Modal | ARUNA Insights',
    seoDescription: 'Tanda-tanda krusial bahwa operasional dan sistem bisnis Anda belum siap untuk ekspansi cabang kedua.',
    content: `Membuka cabang kedua adalah momen yang sangat membanggakan bagi setiap pemilik bisnis retail atau F&B. Itu adalah tanda bahwa produk Anda diterima pasar dan unit pertama menghasilkan keuntungan.

Namun, di balik kegembiraan menyiapkan lokasi baru, ada pertanyaan yang kerap muncul:

> *"Kalau bisnis gue tambah besar dan gue nggak bisa nongkrong di sana setiap hari, toko kedua bakal jalan bener nggak ya?"*

---

### Ilusi Kontrol di Outlet Pertama

Banyak pengusaha tidak menyadari bahwa keberhasilan outlet pertama mereka sering kali ditopang oleh dua faktor yang tidak otomatis terbawa ke cabang baru:

1. **Pengawasan fisik langsung oleh pemilik:**
Owner bisa melihat langsung laci kasir saat closing, menegur staf gudang seketika saat ada tumpukan barang rusak, dan memastikan pelayanan berjalan sesuai standar.

2. **Ketergantungan pada 1–2 personil kunci:**
Ada satu kepala toko atau manajer senior yang sudah hafal luar kepala harga beli supplier, nomor kontak langganan, hingga cara mengatasi register kasir yang macet.

Masalahnya: tubuh Anda hanya satu. Manajer senior Anda tidak bisa berada di dua tempat sekaligus.

Ketika cabang kedua dibuka, kompleksitas bertambah pesat:
* Transfer stok antar-cabang mulai memicu selisih yang sulit ditelusuri.
* Harga beli dari supplier yang diorder cabang B kerap berbeda dengan cabang A.
* Arus kas terbagi dua, dan pemilik mulai kesulitan memastikan cabang mana yang sesungguhnya menyumbang laba riil.

---

### Pertanyaan yang Harus Dijawab

Pertanyaannya bukan hanya: *“Apakah bisnis saya punya modal untuk membuka cabang kedua?”*

Tetapi: **“Apakah sistem dan cara kerja bisnis saya siap mengelola cabang kedua?”**

Pastikan:
- Alur pemesanan barang ke supplier memiliki dokumen PO resmi dengan alur otorisasi yang jelas.
- Prosedur transfer stok antar-cabang memiliki bukti serah terima digital yang tercatat di hari yang sama.
- Laporan penjualan dan pergerakan kas harian dapat dilihat dari jarak jauh tanpa perlu menelepon kasir satu per satu.

Ekspansi yang berkelanjutan bukan tentang seberapa cepat Anda membuka cabang, melainkan seberapa kokoh sistem yang menopang cabang tersebut agar tidak membebani bisnis utama Anda.`,
  },
  {
    id: 'art-3',
    title: 'Kalau Owner Harus Tanya Satu-Satu untuk Tahu Kondisi Bisnis, Ada Masalah di Sistemnya',
    slug: 'kalau-owner-harus-tanya-satu-satu-untuk-tahu-kondisi-bisnis-ada-masalah-di-sistemnya',
    excerpt: 'Jika untuk mengetahui sisa stok, status hutang supplier, atau laba bulanan Anda masih harus mengontak admin, kasir, dan akuntan satu per satu—itu tanda jelas bahwa bisnis bekerja secara terfragmentasi.',
    category: 'FIELD NOTES',
    authorId: 'muhammad-nurcholish',
    status: 'published',
    featured: true,
    publishedAt: '2026-09-28',
    createdAt: '2026-09-25T08:30:00Z',
    updatedAt: '2026-09-28T16:00:00Z',
    readingTime: 6,
    coverImage: BUNDLED_IMAGES.hero,
    coverImageUrl: 'homepage/hero_consulting_meeting.jpg',
    seoTitle: 'Ketergantungan Informasi Manual pada Bisnis Berkembang | ARUNA Insights',
    seoDescription: 'Mengapa fragmented information mengikis kendali manajemen dan memperlambat pengambilan keputusan bisnis.',
    content: `Bayangkan skenario yang sering dialami oleh pemilik bisnis beromzet belasan miliar rupiah ini:

Pukul 16:00 sore, Anda ingin mengetahui apakah stok produk terlaris di gudang masih cukup untuk akhir pekan.
Anda membuka WhatsApp dan mengirim pesan ke staf gudang: *"Stok kemeja ukuran L sisa berapa?"*
Dua puluh menit kemudian, staf gudang membalas: *"Tadi siang ada 40 pcs, Pak. Tapi belum tahu yang keluar ke toko tadi sore."*

Lalu Anda ingin tahu apakah tagihan supplier kain sudah jatuh tempo. Anda mengirim chat lagi ke staf admin: *"Faktur PT Maju Jaya sudah dibayar belum?"*
Admin menjawab: *"Nota fisiknya masih di laci meja kasir, Pak. Nanti saya cari dulu."*

---

### Fragmentasi Informasi Mengikis Kendali

Ketika bisnis masih kecil, kebiasaan bertanya satu per satu terasa lumrah. Namun seiring bertambahnya volume transaksi dan cabang, cara ini menciptakan hambatan besar:

1. **Informasi Terlambat & Tidak Konsisten:**
Setiap orang memegang spreadsheet versinya masing-masing. Angka stok di catatan gudang berbeda dengan catatan kasir dan pembukuan.

2. **Ketergantungan Total pada Kehadiran Fisik Staf:**
Jika staf admin cuti atau sakit, proses verifikasi faktur terhenti. Bisnis tersandera oleh rutinitas manual.

3. **Keputusan Diambil Berdasarkan Perasaan (Feeling):**
Karena angka akurat membutuhkan waktu berhari-hari untuk direkap, pemilik akhirnya memesan barang atau menentukan diskon berdasarkan intuisi daripada data riil.

---

### Solusi: Membangun Sistem Terhubung

Bisnis yang matang tidak berjalan dengan cara menanyai orang satu per satu.

Sistem yang tepat menghubungkan:
* Input kasir langsung memotong stok di sistem saat barang discan.
* Penerimaan barang di gudang otomatis memperbarui kartu stok dan mencocokkan nota supplier dengan PO.
* Pembukuan merangkum mutasi tersebut menjadi laporan laba rugi dan posisi hutang-piutang harian.

Hasil akhirnya: pemilik bisnis cukup membuka satu layar untuk melihat kondisi operasional secara jernih kapan saja dibutuhkan.`,
  },
  {
    id: 'art-4',
    title: 'SOP Bukan Dokumen. SOP Adalah Cara Bisnis Bekerja.',
    slug: 'sop-bukan-dokumen-sop-adalah-cara-bisnis-bekerja',
    excerpt: 'Banyak bisnis memiliki binder tebal berisi dokumen SOP yang rapi, namun di lantai toko tidak ada staf yang menjalankannya. Standarisasi sejati tertanam di dalam alur sistem harian, bukan di atas lembaran kertas.',
    category: 'OPINION',
    authorId: 'muhammad-nurcholish',
    status: 'published',
    featured: false,
    publishedAt: '2026-09-30',
    createdAt: '2026-09-28T10:00:00Z',
    updatedAt: '2026-09-30T09:00:00Z',
    readingTime: 5,
    coverImage: BUNDLED_IMAGES.retail,
    coverImageUrl: 'industries/industry_retail_store.jpg',
    seoTitle: 'SOP Bukan Dokumen, Tapi Cara Bisnis Bekerja | ARUNA Insights',
    seoDescription: 'Menemukan titik temu antara disiplin tata kelola ERP dengan fleksibilitas yang menjaga keunikan merek bisnis.',
    content: `Kami sering melihat perusahaan yang bangga menunjukkan buku Standard Operating Procedure (SOP) ratusan halaman yang ditandatangani oleh konsultan manajemen terkemuka.

Namun saat kami observasi ke gudang atau dapur outlet, para pekerja bekerja dengan cara yang sama sekali berbeda dari apa yang tertulis di buku tersebut.

Mengapa?
Karena SOP yang hanya berbentuk dokumen statis akan selalu kalah oleh kebiasaan dan kemudahan jalan pintas manusia.

SOP sejati bukan dokumen yang tersimpan di lemari arsip. SOP adalah cara bisnis Anda sesungguhnya bergerak setiap hari:
* Jika kasir tidak bisa menutup transaksi tanpa memasukkan data pelanggan atau diskon yang disetujui, itulah SOP.
* Jika staf pembelian tidak bisa menerbitkan PO tanpa validasi limit anggaran di sistem, itulah SOP.
* Jika barang masuk tidak bisa diakui di sistem sebelum dicocokkan dengan fisik, itulah SOP.

Di ARUNA, kami tidak membuat tumpukan dokumen tebal yang tidak dibaca. Kami membantu Anda merumuskan alur kerja yang sederhana dan masuk akal, lalu menguncinya ke dalam hak akses dan validasi sistem ERP.

Ketika sistem secara alami membimbing tim bekerja sesuai alur yang benar, disiplin operasional tercipta tanpa perlu pengawasan fisik yang melelahkan.`,
  },
  {
    id: 'art-5',
    title: 'Bisnis Anda Tidak Berantakan. Mungkin Prosesnya yang Belum Ditata.',
    slug: 'bisnis-anda-tidak-berantakan-mungkin-prosesnya-yang-belum-ditata',
    excerpt: 'Banyak pemilik bisnis merasa frustrasi dan menganggap timnya tidak kompeten. Padahal, masalah sebenarnya adalah ketiadaan struktur alur kerja yang jelas dan data master yang bersih.',
    category: 'BUSINESS',
    authorId: 'muhammad-nurcholish',
    status: 'published',
    featured: false,
    publishedAt: '2026-10-01',
    createdAt: '2026-09-29T15:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
    readingTime: 5,
    coverImage: BUNDLED_IMAGES.fb,
    coverImageUrl: 'industries/industry_fb_operations.jpg',
    seoTitle: 'Bisnis Anda Tidak Berantakan, Prosesnya yang Belum Ditata | ARUNA',
    seoDescription: 'Mengapa kegagalan operasional sering kali bukan karena tim yang buruk, melainkan ketiadaan struktur proses kerja.',
    content: `Ketika seorang pemilik bisnis datang kepada kami dengan keluhan:
*"Staf gudang saya sering teledor, kasir sering salah hitung, dan tim purchasing tidak bisa dipercaya,"*
langkah pertama kami adalah tidak langsung menyalahkan orang-orang tersebut.

Sering kali, setelah kami bedah alurnya di lapangan, akar masalahnya sangat jelas:
* Staf gudang salah hitung karena penamaan barang (SKU) tidak terstandarisasi—satu jenis barang memiliki 4 nama berbeda di gudang.
* Kasir salah hitung karena promosi diskon berubah-ubah setiap minggu tanpa aturan parameter sistem yang baku.
* Tim purchasing telat order karena tidak pernah ada batasan minimum stock alert yang otomatis mengingatkan mereka.

Bisnis Anda tidak berantakan. Tim Anda sesungguhnya ingin bekerja dengan baik. Yang belum ada adalah **struktur alur kerja yang logis dan sistem yang mendukungnya**.

Ketika proses dirapikan:
1. Tanggung jawab setiap orang menjadi jelas.
2. Data master menjadi bersih dan konsisten.
3. Kesalahan manusia (human error) terminimalisir secara drastis.

Itulah esensi dari **MAKE BUSINESS MAKE SENSE.**`,
  },
];
