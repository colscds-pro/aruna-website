import { IndustryItem, MethodologyStage, ImplementationStep, ServiceItem, DiagnosticQuestion } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_consulting_meeting_1790916424867.jpg';
export const RETAIL_IMAGE = '/src/assets/images/industry_retail_store_1790916438753.jpg';
export const FB_IMAGE = '/src/assets/images/industry_fb_operations_1790916451581.jpg';
export const HOSPITALITY_IMAGE = '/src/assets/images/industry_hospitality_1790916463500.jpg';

export const CONTENT = {
  id: {
    nav: {
      services: 'Layanan',
      moment: 'Kesiapan Tumbuh',
      framework: 'Cara Kerja',
      industries: 'Industri',
      why: 'Mengapa ARUNA',
      caseStudy: 'Studi Kasus',
      diagnostic: 'Self-Diagnostic',
      cta: 'Bicara dengan Advisor',
    },
    hero: {
      kicker: 'ERP Consulting & Business Transformation',
      tagline: 'MAKE BUSINESS MAKE SENSE.',
      subtitle: 'ARUNA membantu pemilik bisnis yang sedang bertumbuh memahami, merapikan, dan mengontrol operasional mereka melalui proses bisnis yang terstruktur dan sistem teknologi yang tepat.',
      primaryCta: 'Bicara dengan Advisor',
      secondaryCta: 'Pelajari Cara Kerja Kami',
      statLabel: 'Fokus Kemitraan',
      statValue: 'Bisnis Beromzet Rp5–20 Miliar / Unit',
      statSub: 'Mempersiapkan cabang ke-2 dan ekspansi unit berikutnya',
    },
    moment: {
      kicker: 'Momen Kritis Pertumbuhan',
      title: 'Bisnis Anda sedang bertumbuh. Apakah sistem Anda siap mengimbanginya?',
      quote: '“Kalau bisnis gue tambah besar, sistem yang sekarang masih sanggup nggak?”',
      description: 'Ketika bisnis masih memiliki satu outlet, operasional sering kali bertahan berkat koordinasi manual dan pengawasan langsung dari pemilik. Namun ketika outlet kedua dibuka, kompleksitas meningkat secara eksponensial—bukan linear.',
      comparison: {
        singleOutletTitle: 'Realitas 1 Outlet',
        multiOutletTitle: 'Tantangan Multi-Outlet',
        items: [
          {
            aspect: 'Kontrol Stok & Pergudangan',
            single: 'Bisa dicek fisik langsung oleh owner atau kepala toko setiap saat.',
            multi: 'Stok antar-cabang rawan selisih, retur sulit dilacak, dan kebocoran barang baru disadari di akhir bulan.'
          },
          {
            aspect: 'Pengadaan & Pembelian (Purchasing)',
            single: 'Order bahan dilakukan via chat WhatsApp informal ke beberapa supplier langganan.',
            multi: 'Harga beli dari supplier sering tidak seragam antar-outlet, PO tidak terkontrol, dan overstock menumpuk modal kerja.'
          },
          {
            aspect: 'Monitoring Kas & Transaksi',
            single: 'Owner dapat memantau laci kasir dan mutasi rekening harian secara mandiri.',
            multi: 'Rekonsiliasi transaksi kasir antar-lokasi lambat, potensi fraud meningkat, dan arus kas harian buram.'
          },
          {
            aspect: 'Laporan Keuangan & Margin',
            single: 'Laporan keuangan manual terlambat 2–3 minggu masih dapat ditoleransi.',
            multi: 'Keterlambatan laporan membuat owner tidak tahu outlet mana yang sesungguhnya menyumbang profit dan mana yang bleeding.'
          },
          {
            aspect: 'Ketergantungan Individu & SOP',
            single: 'Toko tetap jalan karena ada 1–2 staf senior yang hafal seluruh seluk-beluk.',
            multi: 'Ketika staf senior tidak ada di cabang baru, operasional kacau karena proses belum terdokumentasi dan tersistemasi.'
          }
        ]
      }
    },
    philosophy: {
      kicker: 'Prinsip Dasar',
      title: 'Business first. Software second.',
      lead: 'Kami percaya bahwa teknologi harus mengikuti logika bisnis—bukan bisnis yang dipaksa tunduk pada software.',
      paragraphs: [
        'Banyak implementasi ERP gagal bukan karena software-nya buruk, melainkan karena software langsung dipasang sebelum proses bisnisnya dipahami dan dirapikan.',
        'ARUNA tidak memulai dari menu software atau fitur teknis. Kami duduk bersama Anda untuk memetakan bagaimana bisnis Anda sesungguhnya bergerak: dari pembelian, pergerakan barang, penjualan, hingga pencatatan keuangan.',
        'Kami tidak menjanjikan bisnis menjadi serba "mudah" secara instan. Kami membantu bisnis Anda make sense—memiliki struktur yang logis, alur yang jelas, dan data yang dapat dipercaya.'
      ],
      principles: [
        {
          title: 'Standardize what should be standard',
          desc: 'Standarisasikan proses yang membutuhkan disiplin mutlak, seperti alur otorisasi PO, penerimaan barang, dan rekonsiliasi kas.'
        },
        {
          title: 'Adapt what should be adapted',
          desc: 'Sesuaikan konfigurasi sistem dengan kebiasaan operasional nyata di lapangan agar tim tidak merasa terbebani secara berlebihan.'
        },
        {
          title: 'Preserve what makes the business unique',
          desc: 'Pertahankan keunggulan kompetitif, sentuhan pelayanan, atau keunikan rasa yang menjadi identitas utama bisnis Anda.'
        }
      ]
    },
    journey: {
      kicker: 'Alur Transformasi',
      title: 'Bagaimana ARUNA Membantu Bisnis Anda',
      subtitle: 'Sebuah perjalanan bertahap dari operasional yang kabur menuju kesiapan ekspansi yang terukur.',
      stages: [
        {
          id: 'clarity',
          step: '01',
          name: 'CLARITY',
          tagline: 'Memahami bagaimana bisnis sesungguhnya berjalan',
          description: 'Mengurai alur kerja riil di lapangan, mengidentifikasi titik kebocoran data atau stok, dan menyelaraskan pemahaman antara manajemen dan tim pelaksana.'
        },
        {
          id: 'structure',
          step: '02',
          name: 'STRUCTURE',
          tagline: 'Merapikan proses, peran, dan data induk',
          description: 'Membangun standard operating procedure yang terintegrasi, membersihkan master data produk dan vendor, serta menetapkan batas tanggung jawab setiap peran.'
        },
        {
          id: 'control',
          step: '03',
          name: 'CONTROL',
          tagline: 'Memberikan manajemen visibilitas penuh',
          description: 'Menghubungkan data penjualan, persediaan, hutang, dan piutang dalam satu sistem terintegrasi sehingga pemilik memiliki kontrol kapan saja.'
        },
        {
          id: 'growth',
          step: '04',
          name: 'GROWTH',
          tagline: 'Membangun fondasi kokoh untuk ekspansi',
          description: 'Mempersiapkan bisnis agar siap membuka cabang kedua, ketiga, atau unit baru tanpa khawatir sistem operasional akan runtuh.'
        }
      ],
      emotionalQuote: '“Akhirnya kami bisa kontrol bisnis kami.”',
      quoteContext: 'Perasaan tenang seorang pemilik bisnis saat operasional, stok, dan keuangan tidak lagi menjadi misteri harian.'
    },
    services: {
      kicker: 'Layanan Kami',
      title: 'Layanan Terstruktur Berbasis Kebutuhan Riil',
      subtitle: 'Kami tidak menjual software lepas. Setiap keterlibatan ARUNA dirancang untuk mentransformasi cara bisnis Anda bekerja.',
      coreTitle: 'Layanan Inti',
      futureTitle: 'Rencana Kapabilitas Masa Depan',
      futureNote: 'Layanan di bawah ini sedang dalam tahap perancangan portofolio lanjutan dan disiapkan untuk melengkapi ekosistem konsultasi ARUNA secara bertahap.',
      items: [
        {
          id: 'bpa',
          number: '01',
          title: 'Business Process Analysis',
          subtitle: 'Audit Alur Operasional Sebelum Menyentuh Sistem',
          outcome: 'Kejelasan peta proses bisnis riil dan eliminasi friksi kerja sebelum teknologi dipasang.',
          description: 'Kami menganalisis secara mendalam bagaimana tim Anda melakukan pembelian, menerima stok, memproses pesanan pelanggan, dan mencatat keuangan harian untuk menemukan bottleneck.',
          deliverables: [
            'Pemetaan alur kerja end-to-end (as-is vs to-be)',
            'Identifikasi titik rawan selisih stok & kebocoran kas',
            'Rekomendasi standardisasi alur otorisasi'
          ]
        },
        {
          id: 'erp-impl',
          number: '02',
          title: 'ERP Implementation (Odoo)',
          subtitle: 'Konfigurasi Sistem Berdasarkan Logika Operasional',
          outcome: 'Sistem ERP Odoo yang terkonfigurasi sesuai realitas bisnis, bukan template bawaan yang kaku.',
          description: 'Penerapan Odoo ERP yang disesuaikan secara presisi dengan kebutuhan bisnis retail, F&B, dan hospitality. Kami memastikan modul inventori, purchasing, invoicing, dan accounting berbicara dalam satu bahasa data.',
          deliverables: [
            'Arsitektur modul Odoo yang ramping & terarah',
            'Konfigurasi multi-lokasi & alur transfer gudang',
            'Penyelarasan alur faktur supplier (AP) dan piutang (AR)'
          ]
        },
        {
          id: 'odoo-mig',
          number: '03',
          title: 'Odoo Migration',
          subtitle: 'Restrukturisasi Lingkungan ERP yang Terlanjur Kusut',
          outcome: 'Sistem Odoo yang bersih, stabil, dan kembali selaras dengan proses bisnis yang telah diperbarui.',
          description: 'Bagi bisnis yang sebelumnya telah menggunakan Odoo namun implementasinya bermasalah, terlalu rumit, atau tidak digunakan oleh tim, kami merapikan kembali data dan arsitektur alurnya.',
          deliverables: [
            'Audit konfigurasi dan modul kustom yang berlebihan',
            'Migrasi data transaksi dan saldo awal yang terverifikasi',
            'Penyederhanaan alur kerja antarmuka pengguna'
          ]
        },
        {
          id: 'master-data',
          number: '04',
          title: 'Business Organization & Master Data',
          subtitle: 'Fondasi Data Induk yang Bersih dan Terstandarisasi',
          outcome: 'Data produk, harga, supplier, dan bagan akun (COA) yang akurat dan bebas duplikasi.',
          description: 'Sistem ERP sebaik apa pun akan gagal jika data yang dimasukkan berantakan. Kami membantu merapikan penamaan barang (SKU), satuan unit (UoM), struktur harga beli/jual, dan pengelompokan akun.',
          deliverables: [
            'Standardisasi nomenklatur SKU dan barcode',
            'Pengelompokan kategori produk & metode valuasi persediaan',
            'Struktur bagan akun (Chart of Accounts) standar industri'
          ]
        },
        {
          id: 'enablement',
          number: '05',
          title: 'Training & Enablement',
          subtitle: 'Edukasi Tim: Memahami "Mengapa", Bukan Sekadar "Apa"',
          outcome: 'Tim lapangan yang disiplin menjalankan sistem karena memahami dampak pekerjaannya terhadap angka bisnis.',
          description: 'Kami tidak sekadar memberikan tutorial tombol mana yang harus ditekan. Kami melatih staf gudang, kasir, admin pembelian, dan akuntan memahami konsekuensi logis dari setiap input transaksi.',
          deliverables: [
            'Panduan kerja operasional ringkas per divisi',
            'Sesi pelatihan interaktif berbasis skenario kerja nyata',
            'Simulasi penanganan kendala transaksi harian'
          ]
        },
        {
          id: 'go-live',
          number: '06',
          title: 'Go-Live & Onsite Support',
          subtitle: 'Pengawalan Transisi Menuju Operasional Nyata',
          outcome: 'Masa transisi yang tenang dan minim disrupsi terhadap pelayanan pelanggan harian.',
          description: 'Momen cutover sistem sering kali menjadi masa yang paling menegangkan. Tim ARUNA hadir mendampingi secara langsung untuk mengawasi input saldo awal dan membimbing staf pada hari-hari pertama go-live.',
          deliverables: [
            'Manajemen cutover dan verifikasi saldo awal stok/kas',
            'Pendampingan langsung saat sistem mulai digunakan',
            'Evaluasi stabilitas data pasca 30 hari operasional'
          ]
        }
      ],
      futureItems: [
        {
          title: 'ERP Maintenance & Continuous Optimization',
          desc: 'Dukungan berkala untuk memastikan konsistensi pemakaian dan penyesuaian sistem seiring penambahan cabang baru.'
        },
        {
          title: 'Master Data Hygiene & Periodic Audits',
          desc: 'Layanan pembersihan dan audit berkala terhadap integritas data transaksi dan persediaan.'
        },
        {
          title: 'Tax Consulting & Financial Statement Advisory',
          desc: 'Penyelarasan laporan keuangan Odoo dengan kepatuhan perpajakan Indonesia dan standar akuntansi bisnis lokal.'
        }
      ]
    },
    methodology: {
      kicker: 'Metodologi Kami',
      title: 'Bagaimana ARUNA Bekerja',
      lead: 'Kami tidak langsung membuka laptop dan mengonfigurasi modul. Transformasi bisnis yang kokoh selalu dibangun melalui tahapan yang berurutan dan disiplin.',
      strategicFrameworkTitle: 'Kerangka Kerja Strategis',
      stages: [
        {
          stage: 'Stage 01',
          name: 'UNDERSTAND',
          description: 'Mendengarkan visi pemilik bisnis, tantangan operasional harian, dan rencana ekspansi ke depan.',
          action: 'Wawancara mendalam bersama pemilik bisnis dan kepala operasional.',
          output: 'Dokumen pemahaman konteks bisnis & prioritas sasaran.'
        },
        {
          stage: 'Stage 02',
          name: 'DIAGNOSE',
          description: 'Membedah titik friksi: letak kebocoran stok, keterlambatan laporan, dan ketergantungan pada personil tertentu.',
          action: 'Observasi alur fisik barang dan pencatatan transaksi di lapangan.',
          output: 'Diagnosa kesenjangan proses & peta risiko operasional.'
        },
        {
          stage: 'Stage 03',
          name: 'ORGANIZE',
          description: 'Merapikan alur kerja, mendefinisikan pembagian tanggung jawab, dan menyiapkan standardisasi master data.',
          action: 'Perancangan alur kerja target dan pembersihan basis data master.',
          output: 'Blueprint operasional & template data siap migrasi.'
        },
        {
          stage: 'Stage 04',
          name: 'DESIGN',
          description: 'Merancang arsitektur sistem ERP yang ramping—hanya menggunakan apa yang benar-benar dibutuhkan bisnis.',
          action: 'Pemetaan proses bisnis target ke dalam konfigurasi sistem.',
          output: 'Spesifikasi fungsional sistem & skema integrasi.'
        },
        {
          stage: 'Stage 05',
          name: 'IMPLEMENT',
          description: 'Melakukan konfigurasi Odoo ERP, input master data yang telah bersih, dan verifikasi alur transaksi.',
          action: 'Pengaturan environment sistem, pengujian alur, dan validasi data awal.',
          output: 'Sistem ERP siap uji pakai dengan data operasional riil.'
        },
        {
          stage: 'Stage 06',
          name: 'ENABLE',
          description: 'Melatih seluruh lini tim pengguna dan mengawal masa transisi hingga go-live berjalan stabil.',
          action: 'Pelatihan bertingkat berbasis peran dan pendampingan di lokasi.',
          output: 'Tim mandiri dan sistem beroperasi dalam kegiatan harian.'
        },
        {
          stage: 'Stage 07',
          name: 'OPTIMIZE',
          description: 'Mengevaluasi penggunaan sistem pasca go-live untuk memastikan data tetap akurat dan siap mendukung cabang baru.',
          action: 'Review berkala laporan keuangan, akurasi stok, dan kepatuhan SOP.',
          output: 'Kesiapan operasional penuh menyongsong pertumbuhan cabang.'
        }
      ],
      roadmapTitle: 'Alur Nyata Implementasi (9 Langkah Lapangan)',
      roadmapSubtitle: 'Apa yang sesungguhnya terjadi dari hari pertama Anda menghubungi ARUNA hingga operasional berjalan stabil.',
      roadmapSteps: [
        {
          step: 1,
          title: 'Kontak & Diskusi Eksplorasi Awal',
          summary: 'Pemilik bisnis menghubungi ARUNA untuk mendiskusikan kendala operasional dan rencana ekspansi.',
          detail: 'Sesi konsultasi awal untuk memahami skala bisnis (omzet, unit, jumlah staf) dan memverifikasi apakah pendekatan ARUNA sesuai dengan situasi Anda.'
        },
        {
          step: 2,
          title: 'Analisis Proses Bisnis Menyeluruh',
          summary: 'ARUNA membedah alur operasional langsung di lapangan bersama para penanggung jawab.',
          detail: 'Kami menelusuri bagaimana barang dibeli dari supplier, diterima di gudang, dijual di kasir, dan dicatat di pembukuan.'
        },
        {
          step: 3,
          title: 'Persiapan Blueprint & Arsitektur Sistem',
          summary: 'Menyusun rancangan alur kerja baru yang lebih rapi dan menentukan modul sistem yang relevan.',
          detail: 'Menghindari modul yang berlebihan. Kami hanya merancang sistem yang proporsional dengan skala dan kapabilitas tim Anda.'
        },
        {
          step: 4,
          title: 'Pertemuan Penyelarasan Alur & Organisasi',
          summary: 'Mendiskusikan rancangan proses bisnis dan pembagian peran bersama manajemen.',
          detail: 'Memastikan pemilik bisnis dan manajemen sepakat mengenai alur persetujuan, batas wewenang, dan standar pencatatan.'
        },
        {
          step: 5,
          title: 'Demonstrasi Prototipe Sistem Terarah',
          summary: 'Menunjukkan bagaimana Odoo bekerja menggunakan skenario nyata dari bisnis Anda.',
          detail: 'Bukan demo fitur generik, melainkan simulasi alur kerja Anda sendiri dari transaksi beli hingga keluar laporan laba rugi.'
        },
        {
          step: 6,
          title: 'Konfigurasi Sistem Berbasis Kebutuhan Riil',
          summary: 'Mengatur parameter sistem, format dokumen penagihan, dan hak akses staf.',
          detail: 'Mengonfigurasi Odoo agar siap menerima transaksi tanpa friksi yang tidak perlu bagi petugas di lapangan.'
        },
        {
          step: 7,
          title: 'Persiapan & Input Master Data Bersih',
          summary: 'Merapikan data SKU barang, harga pokok, data pemasok, dan pelanggan.',
          detail: 'Tahap krusial agar sistem tidak tercemar oleh data ganda atau nama produk yang ambigu peninggalan sistem lama.'
        },
        {
          step: 8,
          title: 'Pelatihan Pengguna Berbasis Alur Nyata',
          summary: 'Melatih staf memahami alur kerja mereka dan tanggung jawab input harian.',
          detail: 'Pelatihan fokus pada pemahaman mengapa setiap langkah penting, sehingga meminimalisir jalan pintas manual yang membahayakan data.'
        },
        {
          step: 9,
          title: 'Go-Live & Pengawalan Transisi Operasional',
          summary: 'Peluncuran operasional dengan pendampingan langsung tim ARUNA di lapangan.',
          detail: 'Mengawal pencatatan cutover saldo awal dan memastikan tim merasa aman dan terbantu pada hari pertama bertransaksi.'
        }
      ]
    },
    industries: {
      kicker: 'Fokus Industri',
      title: 'Dirancang untuk Industri dengan Dinamika Operasional Tinggi',
      subtitle: 'Setiap industri memiliki denyut nadi yang berbeda. Kami memahami letak friksi spesifik dalam rantai operasional retail, F&B, dan hospitality.',
      items: [
        {
          id: 'retail' as const,
          name: 'Retail & Multi-Store',
          headline: 'Visibilitas Stok Presisi & Penyelarasan Kas Antar-Toko',
          description: 'Bisnis retail menghadapi tantangan perputaran inventori yang cepat, variasi SKU yang tinggi, dan pengelolaan hutang dagang (AP) ke banyak supplier. Tanpa sistem yang terhubung, pemilik sering kali tidak mengetahui nilai riil stok di setiap toko.',
          frictionPoints: [
            'Selisih stok fisik vs catatan sistem yang baru ketahuan saat stock opname tahunan',
            'Faktur hutang supplier yang menumpuk tanpa jadwal jatuh tempo yang jelas',
            'Kesulitan memantau performa penjualan dan margin kotor antar-outlet secara real-time',
            'Harga jual dan promosi yang kerap tidak sinkron antar-lokasi'
          ],
          systemFocus: [
            'Valuasi persediaan otomatis (FIFO / Weighted Average)',
            'Pencatatan akun hutang dagang (AP) dan piutang toko (AR) terstruktur',
            'Alur transfer barang antar-gudang dan toko dengan dokumen serah terima resmi',
            'Laporan kinerja penjualan dan perputaran stok per SKU'
          ],
          imageSrc: RETAIL_IMAGE
        },
        {
          id: 'fb' as const,
          name: 'Food & Beverage (F&B)',
          headline: 'Konsistensi Resep, Dapur Terpusat & Pengendalian Waste',
          description: 'Dalam bisnis kuliner yang bersiap membuka cabang kedua, tantangan terbesarnya adalah menjaga konsistensi rasa dan mengontrol biaya bahan baku (COGS). Central kitchen dan outlet harus memiliki alur pemesanan bahan yang disiplin.',
          frictionPoints: [
            'Pemborosan bahan segar dan waste harian yang tidak terdokumentasi dengan baik',
            'Order bahan baku dari outlet ke dapur pusat masih mengandalkan pesan teks acak',
            'HPP aktual makanan melenceng jauh dari resep standar (Bill of Materials)',
            'Kas kasir dan selisih settlement EDC yang lambat direkonsiliasi setiap shift'
          ],
          systemFocus: [
            'Standardisasi Bill of Materials (BOM) dan kalkulasi HPP otomatis',
            'Manajemen internal order dari cabang ke Central Kitchen',
            'Pencatatan waste dan susut bahan dengan otorisasi kepala dapur',
            'Rekonsiliasi closing kasir per shift yang terhubung ke buku besar'
          ],
          imageSrc: FB_IMAGE
        },
        {
          id: 'hospitality' as const,
          name: 'Hospitality & Boutique Stays',
          headline: 'Penyatuan Operasional Reservasi, Resto & Pengadaan Properti',
          description: 'Hotel butik dan resort mengelola beberapa lini pendapatan sekaligus: kamar, restoran, banquet, dan fasilitas tambahan. Sering kali sistem operasional terpecah-pecah, menyulitkan pemilik melihat angka keuangan konsolidasi.',
          frictionPoints: [
            'Pendapatan F&B di dalam properti terpisah dari sistem pembukuan utama kamar',
            'Pengadaan perlengkapan operasional (linen, amenities) rawan overspending',
            'Keterlambatan penyusunan laporan laba rugi bulanan properti',
            'Pencatatan aset tetap dan depresiasi perlengkapan hotel belum terstruktur'
          ],
          systemFocus: [
            'Integrasi pencatatan pendapatan seluruh unit bisnis properti ke dalam satu buku',
            'Kontrol anggaran purchasing departemen operasional (Housekeeping, F&B, Maintenance)',
            'Manajemen aset tetap dan pemeliharaan inventaris kamar',
            'Laporan keuangan properti harian dan bulanan yang terstandarisasi'
          ],
          imageSrc: HOSPITALITY_IMAGE
        }
      ]
    },
    whyAruna: {
      kicker: 'Diferensiasi Strategis',
      title: 'Mengapa Memilih ARUNA?',
      lead: 'Kami bukan sekadar implementer software. Kami adalah partner transformasi bisnis yang memprioritaskan logika operasional Anda.',
      tenets: [
        {
          title: 'Business Before Software',
          description: 'Kami tidak memulai percakapan dari modul teknologi. Kami mempelajari model bisnis, struktur biaya, dan alur pergerakan barang Anda terlebih dahulu.'
        },
        {
          title: 'Built Around Your Reality',
          description: 'Kami tidak memaksakan template korporat yang kaku. Solusi yang kami rancang selalu mempertimbangkan kapasitas riil tim Anda di lapangan.'
        },
        {
          title: 'Clarity Over Complexity',
          description: 'Kami menghindari jargon IT yang membingungkan. Kami menjelaskan logika sistem dengan bahasa bisnis yang jernih dan dapat dipahami semua pihak.'
        },
        {
          title: 'Long-Term Thinking',
          description: 'Tujuan kami bukan sekadar software terpasang, melainkan membangun fondasi operasional yang siap menopang pembukaan cabang-cabang berikutnya.'
        }
      ],
      comparison: {
        title: 'Perbedaan Pendekatan ARUNA',
        vendorLabel: 'Vendor IT / Reseller Biasa',
        arunaLabel: 'ARUNA Business Transformation',
        rows: [
          {
            topic: 'Titik Awal Percakapan',
            vendor: 'Menjual lisensi software dan mendemokan fitur teknis.',
            aruna: 'Mendiagnosa alur proses bisnis riil dan titik kebocoran operasional.'
          },
          {
            topic: 'Perlakuan Terhadap Sistem',
            vendor: 'Memasang template Odoo bawaan tanpa memedulikan kebiasaan tim.',
            aruna: 'Menyelaraskan konfigurasi dengan alur kerja nyata: menstandarkan yang perlu, menjaga yang unik.'
          },
          {
            topic: 'Data Induk (Master Data)',
            vendor: 'Memasukkan apa pun data yang diberikan klien tanpa proses kurasi.',
            aruna: 'Mendampingi proses pembersihan SKU, struktur akun, dan metode valuasi persediaan.'
          },
          {
            topic: 'Pelatihan Tim',
            vendor: 'Hanya mengajarkan tombol apa yang harus diklik di layar.',
            aruna: 'Mengedukasi mengapa alur tersebut harus dijalankan dan dampaknya pada laporan bisnis.'
          },
          {
            topic: 'Ukuran Keberhasilan',
            vendor: 'Sistem ter-install dan serah terima dokumen selesai.',
            aruna: 'Pemilik bisnis memiliki kontrol penuh dan angka keuangan/stok yang dapat dipercaya.'
          }
        ]
      }
    },
    caseStudy: {
      kicker: 'Bukti Lapangan Riil',
      title: 'Studi Kasus: Dari Informasi yang Tercecer Menuju Kontrol Penuh',
      badgeStatus: 'Proyek Sedang Berjalan (Ongoing)',
      subtitle: '“Sebuah bisnis dalam proses mendapatkan visibilitas dan kontrol yang lebih jernih.”',
      clientContext: {
        sector: 'Retail Multi-Store',
        location: 'Indonesia',
        scale: 'Toko retail berkembang dengan ribuan SKU dan persiapan ekspansi cabang baru.',
        status: 'Sedang Berjalan (Tahap Penyelarasan Master Data & Konfigurasi Odoo)'
      },
      problem: {
        title: 'Kondisi Lapangan Sebelum Keterlibatan ARUNA',
        points: [
          'Pemilik bisnis tidak memiliki kepastian mengenai nilai riil stok barang (inventory valuation) yang tersimpan di toko dan gudang.',
          'Pencatatan hutang dagang (Accounts Payable) ke supplier masih tercampur antara nota fisik dan ingatan staf pembelian.',
          'Piutang pelanggan retail (Accounts Receivable) sulit direkonsiliasi dengan mutasi rekening bank.',
          'Pemilik merasa waswas untuk membuka cabang berikutnya karena operasional toko pertama masih terlalu bergantung pada 1–2 personil kunci.'
        ]
      },
      intervention: {
        title: 'Peran & Intervensi Strategis ARUNA',
        points: [
          'Memetakan ulang alur penerimaan barang dari supplier agar seluruh nota fisik wajib dicocokkan dengan Purchase Order sebelum masuk pembukuan.',
          'Membantu merapikan ribuan SKU ke dalam kategori produk yang terstruktur dengan metode valuasi persediaan yang jelas.',
          'Mengonfigurasi Odoo ERP untuk mengotomatisasi pencatatan hutang supplier dan jadwal jatuh tempo pembayaran.',
          'Melatih staf admin dan toko agar memahami pentingnya kedisiplinan input transaksi secara real-time.'
        ]
      },
      outcomeReflection: {
        title: 'Refleksi Perubahan yang Sedang Terjadi',
        quote: '“Kami tidak lagi menebak-nebak berapa stok yang kami miliki dan berapa kewajiban hutang yang harus dibayar minggu depan. Untuk pertama kalinya, gambaran bisnis kami mulai masuk akal.”',
        note: 'ARUNA memilih untuk menampilkan proyek riil yang sedang bertransformasi daripada mengklaim angka keberhasilan fiktif. Karena transformasi bisnis sejati adalah proses disiplin yang dibangun hari demi hari.'
      }
    },
    diagnostic: {
      kicker: 'Alat Evaluasi Mandiri',
      title: 'Multi-Outlet Growth Readiness Diagnostic',
      subtitle: 'Evaluasi kesiapan operasional bisnis Anda sebelum melangkah ke cabang berikutnya dalam 2 menit.',
      instructions: 'Pilihlah opsi yang paling mencerminkan kondisi operasional bisnis Anda hari ini. Di akhir evaluasi, Anda akan menerima ringkasan kesiapan dan rekomendasi area pembenahan.',
      ctaSubmit: 'Lihat Analisis Kesiapan',
      reset: 'Mulai Ulang Evaluasi',
      advisorCta: 'Diskusikan Hasil Diagnostic dengan Advisor ARUNA'
    },
    ctaSection: {
      kicker: 'Langkah Berikutnya',
      title: 'Ready to make your business make sense?',
      subtitle: 'Mari pahami di mana posisi bisnis Anda hari ini, apa yang perlu dirapikan, dan sistem seperti apa yang dapat menopang ke mana Anda ingin melangkah.',
      primaryBtn: 'Bicara dengan Advisor',
      secondaryBtn: 'Konsultasi Cepat via WhatsApp',
      reassurance: 'Percakapan awal kami berfokus pada memahami bisnis Anda—tanpa tekanan penjualan software.'
    },
    footer: {
      brand: 'ARUNA',
      category: 'ERP Consulting & Business Transformation',
      tagline: 'MAKE BUSINESS MAKE SENSE.',
      description: 'Partner transformasi bisnis yang membantu pemilik retail, F&B, dan hospitality membangun proses kerja terstruktur dan sistem ERP yang proporsional.',
      contactHeading: 'Hubungi Kami',
      office: 'Jakarta, Indonesia',
      workingHours: 'Senin – Jumat | 09:00 – 18:00 WIB',
      email: 'advisory@aruna-consulting.id',
      phone: '+62 812-8800-4560',
      whatsapp: 'https://wa.me/6281288004560?text=Halo%20ARUNA,%20saya%20ingin%20berkonsultasi%20mengenai%20kesiapan%20proses%20bisnis%20dan%20sistem%20ERP%20kami.',
      quickLinksHeading: 'Navigasi',
      legalHeading: 'Prinsip Integritas',
      disclaimer: 'ARUNA berkomitmen pada kejujuran kapabilitas: kami menyajikan bukti kerja riil tanpa fabrikasi statistik atau testimoni semu. Odoo adalah merek dagang terdaftar milik Odoo S.A.',
      copyright: '© 2026 ARUNA. Seluruh hak cipta dilindungi undang-undang.'
    },
    modal: {
      title: 'Ceritakan Kondisi Bisnis Anda',
      subtitle: 'Sesi konsultasi awal bersama Senior Business Advisor ARUNA untuk memahami bagaimana bisnis Anda bekerja dan di mana letak friksi yang perlu ditata.',
      fields: {
        name: 'Nama Lengkap',
        businessName: 'Nama Bisnis / Brand',
        sector: 'Sektor Bisnis',
        outlets: 'Jumlah Outlet / Unit Saat Ini',
        challenge: 'Tantangan Operasional Utama yang Sedang Dihadapi',
        contact: 'Nomor WhatsApp / Email Aktif',
      },
      options: {
        sectors: ['Retail / Multi-Store', 'Food & Beverage (F&B)', 'Hospitality / Resort / Hotel', 'Distribusi / Wholesale', 'Lainnya'],
        outlets: ['1 Outlet (Persiapan Cabang ke-2)', '2–3 Outlet', '4–7 Outlet', '8+ Outlet']
      },
      submitButton: 'Bicara dengan Advisor →',
      submitting: 'Menghubungkan ke Advisor...',
      successTitle: 'Permintaan Anda Telah Diterima',
      successMessage: 'Seorang Senior Business Advisor dari ARUNA akan meninjau profil bisnis Anda dan menghubungi Anda via WhatsApp dalam waktu maksimal 1 hari kerja.',
      orWhatsApp: 'Atau langsung chat WhatsApp sekarang dengan konteks:',
      close: 'Tutup'
    }
  },
  en: {
    nav: {
      services: 'Services',
      moment: 'Growth Readiness',
      framework: 'How We Work',
      industries: 'Industries',
      why: 'Why ARUNA',
      caseStudy: 'Case Study',
      diagnostic: 'Self-Diagnostic',
      cta: 'Talk to an Advisor',
    },
    hero: {
      kicker: 'ERP Consulting & Business Transformation',
      tagline: 'MAKE BUSINESS MAKE SENSE.',
      subtitle: 'ARUNA helps growing businesses understand, organize, and control their operations through structured business processes and fitting technology systems.',
      primaryCta: 'Talk to an Advisor',
      secondaryCta: 'Explore How We Work',
      statLabel: 'Client Focus',
      statValue: 'Rp5–20 Billion Annual Turnover / Unit',
      statSub: 'Preparing for the second outlet and multi-unit expansion',
    },
    moment: {
      kicker: 'The Business Moment',
      title: 'Your business is growing. Can your system grow with it?',
      quote: '“If my business gets bigger, can our current setup still handle it?”',
      description: 'With one outlet, a business often survives through manual coordination and direct owner oversight. But when the second branch opens, operational complexity multiplies exponentially—not linearly.',
      comparison: {
        singleOutletTitle: '1 Outlet Reality',
        multiOutletTitle: 'Multi-Outlet Friction',
        items: [
          {
            aspect: 'Stock & Inventory Control',
            single: 'Can be visually inspected by the owner or store head at any moment.',
            multi: 'Inter-branch stock drifts, returns get lost, and inventory leakage is only discovered at month-end.'
          },
          {
            aspect: 'Purchasing & Procurement',
            single: 'Informal WhatsApp ordering with a few trusted local suppliers.',
            multi: 'Vendor pricing differs across branches, POs lack approval trails, and overstock ties up working capital.'
          },
          {
            aspect: 'Cash & Transaction Monitoring',
            single: 'Owner directly balances register cash drawers and daily bank deposits.',
            multi: 'Register reconciliation across locations is slow, fraud risk escalates, and daily cash visibility fogs up.'
          },
          {
            aspect: 'Financial Reporting & Margins',
            single: 'Manual monthly reports delayed by 2–3 weeks are still tolerable.',
            multi: 'Delays leave the owner blind to which branches are actually generating profit and which are bleeding.'
          },
          {
            aspect: 'Key-Person Dependency & SOPs',
            single: 'Stores run because 1–2 senior staff hold every nuance in their heads.',
            multi: 'When senior staff are not present at the new branch, operations stall due to uncodified processes.'
          }
        ]
      }
    },
    philosophy: {
      kicker: 'Guiding Principle',
      title: 'Business first. Software second.',
      lead: 'We believe technology must follow the logic of the business—not the other way around.',
      paragraphs: [
        'Most ERP failures occur not because the software was flawed, but because it was deployed before the business processes were understood and organized.',
        'ARUNA does not begin with software menus or technical feature checklists. We sit with you to understand how your business genuinely functions: from procurement and material flows to sales and financial settlement.',
        'We do not promise to make business effortlessly "easy." We help your business make sense—with logical structure, clear workflows, and trustworthy numbers.'
      ],
      principles: [
        {
          title: 'Standardize what should be standard',
          desc: 'Establish disciplined consistency across workflows that demand governance, such as PO approvals, receipt verification, and cash reconciliations.'
        },
        {
          title: 'Adapt what should be adapted',
          desc: 'Configure system interactions to fit realistic floor workflows so operational teams are not unnecessarily burdened.'
        },
        {
          title: 'Preserve what makes the business unique',
          desc: 'Protect your true competitive moat, customer hospitality rituals, and distinctive brand signatures.'
        }
      ]
    },
    journey: {
      kicker: 'Transformation Journey',
      title: 'What ARUNA Helps You Achieve',
      subtitle: 'A grounded progression from operational ambiguity to confident expansion readiness.',
      stages: [
        {
          id: 'clarity',
          step: '01',
          name: 'CLARITY',
          tagline: 'Understand how the business actually works',
          description: 'Mapping real-world operational workflows, identifying inventory leakage points, and aligning management with floor execution.'
        },
        {
          id: 'structure',
          step: '02',
          name: 'STRUCTURE',
          tagline: 'Organize processes, roles, data, and systems',
          description: 'Instituting standard operating procedures, cleansing product and vendor master data, and defining clear boundaries of authority.'
        },
        {
          id: 'control',
          step: '03',
          name: 'CONTROL',
          tagline: 'Give management reliable visibility and governance',
          description: 'Unifying sales, stock valuation, payables, and receivables in one coherent system accessible whenever needed.'
        },
        {
          id: 'growth',
          step: '04',
          name: 'GROWTH',
          tagline: 'Build a durable foundation for expansion',
          description: 'Preparing the operational core so opening a 2nd, 3rd, or 5th outlet does not threaten to break operational stability.'
        }
      ],
      emotionalQuote: '“Akhirnya kami bisa kontrol bisnis kami.”',
      quoteContext: 'The calm of an owner when inventory, payables, and outlet performance cease to be a daily mystery.'
    },
    services: {
      kicker: 'Our Services',
      title: 'Services Built Around Real Operational Needs',
      subtitle: 'We do not sell software off the shelf. Every engagement is engineered to transform how your organization runs.',
      coreTitle: 'Core Capabilities',
      futureTitle: 'Future Capability Roadmap',
      futureNote: 'The following capabilities are in active development to round out ARUNA’s enterprise consulting ecosystem over time.',
      items: [
        {
          id: 'bpa',
          number: '01',
          title: 'Business Process Analysis',
          subtitle: 'Operational Flow Audit Before Touching Software',
          outcome: 'End-to-end operational clarity and friction elimination before technology is deployed.',
          description: 'We rigorously examine how your team purchases, receives stock, processes customer sales, and reconciles cash to pinpoint bottlenecks.',
          deliverables: [
            'End-to-end workflow documentation (as-is vs to-be)',
            'Identification of inventory leakage and reconciliation gaps',
            'Standardized authorization thresholds'
          ]
        },
        {
          id: 'erp-impl',
          number: '02',
          title: 'ERP Implementation (Odoo)',
          subtitle: 'Configured Around Real Business Requirements',
          outcome: 'An Odoo ERP setup tailored to operational reality rather than rigid default templates.',
          description: 'Precise Odoo deployment for retail, F&B, and hospitality operations. We ensure inventory, purchasing, invoicing, and accounting share one clean ledger.',
          deliverables: [
            'Lean, purpose-built Odoo architecture',
            'Multi-location & warehouse transfer workflows',
            'Synchronized supplier payables (AP) and receivables (AR)'
          ]
        },
        {
          id: 'odoo-mig',
          number: '03',
          title: 'Odoo Migration',
          subtitle: 'Restructuring Overly Tangled ERP Environments',
          outcome: 'A clean, stable Odoo environment re-aligned with cleaned business processes.',
          description: 'For businesses with existing Odoo instances that were poorly implemented, over-customized, or abandoned by teams, we untangle and restore the system.',
          deliverables: [
            'Audit of superfluous custom modules and data bloat',
            'Clean data migration with verified opening balances',
            'Simplified user interfaces for floor staff'
          ]
        },
        {
          id: 'master-data',
          number: '04',
          title: 'Business Organization & Master Data',
          subtitle: 'Clean, Standardized Master Data Foundation',
          outcome: 'Accurate product SKUs, supplier ledgers, and Chart of Accounts without duplication.',
          description: 'Even the finest ERP collapses if bad data is fed in. We clean nomenclature, units of measure (UoM), pricing tiers, and account groupings.',
          deliverables: [
            'Standardized SKU and barcode nomenclature',
            'Category hierarchies and inventory valuation rules',
            'Industry-standard Chart of Accounts (COA)'
          ]
        },
        {
          id: 'enablement',
          number: '05',
          title: 'Training & Enablement',
          subtitle: 'Teaching the "Why", Not Just the "What"',
          outcome: 'A floor team that adheres to systems because they understand how their inputs impact financial reality.',
          description: 'We do not simply train which buttons to click. We educate warehouse staff, cashiers, purchasing officers, and accountants on the downstream ripple effects of each transaction.',
          deliverables: [
            'Role-specific operational reference guides',
            'Scenario-driven hands-on training sessions',
            'Troubleshooting drills for daily transaction friction'
          ]
        },
        {
          id: 'go-live',
          number: '06',
          title: 'Go-Live & Onsite Support',
          subtitle: 'Escorted Transition to Live Operational Execution',
          outcome: 'A calm cutover with minimal disruption to customer-facing service.',
          description: 'Cutover days can be volatile. ARUNA advisors are on the ground overseeing opening stock cutover and guiding personnel through their first live transactions.',
          deliverables: [
            'Cutover coordination and opening balance verification',
            'Direct on-site support during the initial go-live days',
            '30-day post-launch operational stability review'
          ]
        }
      ],
      futureItems: [
        {
          title: 'ERP Maintenance & Continuous Optimization',
          desc: 'Ongoing advisory and tuning to preserve operational integrity as additional branches launch.'
        },
        {
          title: 'Master Data Hygiene & Periodic Audits',
          desc: 'Scheduled data hygiene checks to protect inventory accuracy and ledger consistency.'
        },
        {
          title: 'Tax Consulting & Financial Statement Advisory',
          desc: 'Harmonizing ERP ledgers with Indonesian fiscal compliance and statutory reporting standards.'
        }
      ]
    },
    methodology: {
      kicker: 'Our Methodology',
      title: 'How ARUNA Works',
      lead: 'We do not immediately open software and fiddle with settings. Enduring business transformation follows disciplined, sequenced stages.',
      strategicFrameworkTitle: 'Strategic Transformation Framework',
      stages: [
        {
          stage: 'Stage 01',
          name: 'UNDERSTAND',
          description: 'Listening to the founder’s vision, daily operational hurdles, and future multi-outlet plans.',
          action: 'Deep-dive interviews with owners and operational leads.',
          output: 'Contextual briefing document and core priorities.'
        },
        {
          stage: 'Stage 02',
          name: 'DIAGNOSE',
          description: 'Auditing friction points: inventory shrinkage, delayed reports, and single-person bottlenecks.',
          action: 'On-site floor observation of material and transaction movement.',
          output: 'Process gap diagnostic and operational risk matrix.'
        },
        {
          stage: 'Stage 03',
          name: 'ORGANIZE',
          description: 'Restructuring workflows, assigning clear authority thresholds, and organizing master data.',
          action: 'Target workflow blueprinting and master data cleansing.',
          output: 'Standardized operational blueprint and migration templates.'
        },
        {
          stage: 'Stage 04',
          name: 'DESIGN',
          description: 'Crafting a lean ERP architecture—utilizing strictly what the business truly requires.',
          action: 'Mapping target workflows into software configuration schemas.',
          output: 'Functional specifications and integration roadmap.'
        },
        {
          stage: 'Stage 05',
          name: 'IMPLEMENT',
          description: 'Configuring Odoo, loading pristine master data, and validating transactional flows.',
          action: 'Environment configuration, user testing, and cutover rehearsals.',
          output: 'Validated ERP environment populated with real operational data.'
        },
        {
          stage: 'Stage 06',
          name: 'ENABLE',
          description: 'Empowering teams through role-based enablement and escorting live cutover.',
          action: 'Role-specific simulations and on-site go-live presence.',
          output: 'Autonomous operational teams and stable daily system execution.'
        },
        {
          stage: 'Stage 07',
          name: 'OPTIMIZE',
          description: 'Reviewing post-launch data to ensure ongoing accuracy and readiness for subsequent outlets.',
          action: 'Monthly financial reviews, stock audits, and SOP compliance assessments.',
          output: 'A verified operational launchpad primed for multi-unit scale.'
        }
      ],
      roadmapTitle: 'Real-World 9-Step Implementation Roadmap',
      roadmapSubtitle: 'What genuinely happens from your first inquiry to stable everyday operations.',
      roadmapSteps: [
        {
          step: 1,
          title: 'Initial Discovery Conversation',
          summary: 'Owner reaches out to ARUNA to outline current bottlenecks and growth goals.',
          detail: 'A confidential briefing to evaluate scale (turnover, outlets, headcount) and verify mutual fit.'
        },
        {
          step: 2,
          title: 'Comprehensive Business Process Analysis',
          summary: 'ARUNA audits floor operations directly alongside division leads.',
          detail: 'Tracing goods from vendor delivery and warehouse intake through POS checkout and ledger posting.'
        },
        {
          step: 3,
          title: 'System Blueprint & Architecture',
          summary: 'Formulating cleaned target workflows and determining lean module scope.',
          detail: 'Eliminating bloated features to ensure the platform remains proportional to team capability.'
        },
        {
          step: 4,
          title: 'Organizational Alignment Meeting',
          summary: 'Reviewing workflow blueprints and role divisions with leadership.',
          detail: 'Securing consensus on authorization thresholds, approvals, and data hygiene expectations.'
        },
        {
          step: 5,
          title: 'Tailored Prototype Demonstration',
          summary: 'Demonstrating Odoo in action using your actual business scenarios.',
          detail: 'Not generic feature demos, but your real purchasing and sales cycles simulated in the system.'
        },
        {
          step: 6,
          title: 'Needs-Based System Configuration',
          summary: 'Configuring system logic, invoice layouts, and user access permissions.',
          detail: 'Structuring Odoo to support smooth floor transactions without unnecessary administrative friction.'
        },
        {
          step: 7,
          title: 'Master Data Preparation & Cleansing',
          summary: 'Scrubbing SKU catalogs, cost bases, vendor records, and customer groups.',
          detail: 'Ensuring historical inconsistencies or duplicate naming do not contaminate the new platform.'
        },
        {
          step: 8,
          title: 'Workflow-Driven User Enablement',
          summary: 'Training floor teams on their exact daily operational routines.',
          detail: 'Instilling the reasoning behind every entry so staff avoid precarious manual shortcuts.'
        },
        {
          step: 9,
          title: 'Go-Live & Escorted Transition',
          summary: 'Live launch guided by ARUNA advisors on-site.',
          detail: 'Verifying opening balances and providing confidence to floor staff on day one.'
        }
      ]
    },
    industries: {
      kicker: 'Focus Sectors',
      title: 'Engineered for High-Velocity Operational Environments',
      subtitle: 'Every industry possesses a unique operational rhythm. We understand the specific friction points across retail, F&B, and hospitality.',
      items: [
        {
          id: 'retail' as const,
          name: 'Retail & Multi-Store',
          headline: 'Precise Inventory Visibility & Multi-Store Financial Control',
          description: 'Retail businesses face rapid stock turns, extensive SKU catalogs, and hundreds of supplier payables. Without an integrated system, owners remain uncertain of the true asset value sitting on store shelves.',
          frictionPoints: [
            'Physical stock variances discovered only during annual stock-takes',
            'Supplier invoices piling up without clear maturity tracking',
            'Inability to inspect real-time gross margins across separate store locations',
            'Pricing and promotional discrepancies between outlets'
          ],
          systemFocus: [
            'Automated inventory valuation (FIFO / Weighted Average)',
            'Structured Accounts Payable (AP) and Accounts Receivable (AR) ledgers',
            'Formal inter-store stock transfers with digital verification trails',
            'Granular sales velocity and SKU-level margin reports'
          ],
          imageSrc: RETAIL_IMAGE
        },
        {
          id: 'fb' as const,
          name: 'Food & Beverage (F&B)',
          headline: 'Recipe Consistency, Central Kitchen & Waste Governance',
          description: 'Culinary brands preparing their second branch must safeguard flavor consistency while containing raw material cost (COGS). Central kitchens and dining rooms require disciplined procurement integration.',
          frictionPoints: [
            'Perishable food waste unrecorded and untracked across locations',
            'Branch replenishment requests sent via uncoordinated chat threads',
            'Actual food cost diverging wildly from standard recipe yields (BOM)',
            'End-of-shift register and card settlement discrepancies'
          ],
          systemFocus: [
            'Standardized Bill of Materials (BOM) with automatic COGS calculation',
            'Internal requisition orders connecting branches to the Central Kitchen',
            'Waste and spoilage tracking governed by kitchen head sign-offs',
            'Shift-by-shift POS register reconciliations linked to the general ledger'
          ],
          imageSrc: FB_IMAGE
        },
        {
          id: 'hospitality' as const,
          name: 'Hospitality & Boutique Stays',
          headline: 'Unified Room Operations, On-Site Dining & Asset Procurement',
          description: 'Boutique hotels balance multiple revenue streams: accommodations, restaurant dining, catering, and property facilities. Disconnected systems leave owners unable to see consolidated profit performance.',
          frictionPoints: [
            'F&B restaurant revenue disconnected from the central room ledger',
            'Housekeeping and amenities procurement prone to unbudgeted overspending',
            'Month-end property profit-and-loss reports delayed by weeks',
            'Lax tracking of furniture, fixtures, and operating equipment depreciation'
          ],
          systemFocus: [
            'Consolidated general ledger uniting rooms, dining, and venue revenue',
            'Departmental purchasing budgets for housekeeping and maintenance',
            'Fixed asset lifecycle management and guest room inventory tracking',
            'Daily and monthly standardized property financial reporting'
          ],
          imageSrc: HOSPITALITY_IMAGE
        }
      ]
    },
    whyAruna: {
      kicker: 'Strategic Differentiation',
      title: 'Why ARUNA?',
      lead: 'We are not software sellers. We are business transformation advisors prioritizing your operational reality.',
      tenets: [
        {
          title: 'Business Before Software',
          description: 'We do not open conversations with software modules. We examine your operational reality, cost structure, and flow of goods first.'
        },
        {
          title: 'Built Around Your Reality',
          description: 'We never impose rigid corporate templates. Our systems are calibrated around what your actual floor personnel can execute with confidence.'
        },
        {
          title: 'Clarity Over Complexity',
          description: 'We reject confusing IT buzzwords. We articulate operational logic in clear, human business terms everyone understands.'
        },
        {
          title: 'Long-Term Thinking',
          description: 'Our objective is not merely software go-live, but an operational foundation robust enough to support your subsequent branch expansions.'
        }
      ],
      comparison: {
        title: 'The ARUNA Difference',
        vendorLabel: 'Typical IT Vendor / Reseller',
        arunaLabel: 'ARUNA Business Transformation',
        rows: [
          {
            topic: 'Conversation Starting Point',
            vendor: 'Selling software licenses and demonstrating generic technical features.',
            aruna: 'Diagnosing actual workflow bottlenecks and operational leakage points.'
          },
          {
            topic: 'System Approach',
            vendor: 'Deploying off-the-shelf templates regardless of team habits.',
            aruna: 'Aligning software to real workflows: standardizing the essential, preserving the unique.'
          },
          {
            topic: 'Master Data Preparation',
            vendor: 'Importing whatever raw files the client provides without verification.',
            aruna: 'Escorting SKU cleanup, account structuring, and inventory valuation logic.'
          },
          {
            topic: 'Team Enablement',
            vendor: 'Teaching which buttons to click on a screen.',
            aruna: 'Educating why workflows matter and how entries directly shape company financial health.'
          },
          {
            topic: 'Measure of Success',
            vendor: 'Software installed and acceptance document signed.',
            aruna: 'Owner in complete operational control with numbers they can trust.'
          }
        ]
      }
    },
    caseStudy: {
      kicker: 'Real Field Evidence',
      title: 'Case Study: From Fragmented Information to Operational Control',
      badgeStatus: 'Ongoing Client Engagement',
      subtitle: '“A business in the process of gaining clearer visibility and control.”',
      clientContext: {
        sector: 'Retail Multi-Store',
        location: 'Indonesia',
        scale: 'Growing multi-brand retail store with thousands of SKUs preparing for branch expansion.',
        status: 'Active Engagement (Master Data Standardization & Odoo Configuration Stage)'
      },
      problem: {
        title: 'Floor Reality Before ARUNA Engagement',
        points: [
          'The owner lacked confidence in the true valuation of inventory held across store shelves and warehouse storage.',
          'Accounts Payable to suppliers relied on scattered paper invoices and personal memories of purchasing clerks.',
          'Store customer receivables could not be reliably reconciled against incoming bank account transfers.',
          'The founder felt severe anxiety about launching a second outlet while the original unit remained heavily dependent on key individuals.'
        ]
      },
      intervention: {
        title: 'ARUNA’s Strategic Intervention',
        points: [
          'Re-architected receiving protocols so physical vendor invoices must reconcile against approved Purchase Orders before entering accounting.',
          'Consolidated thousands of disparate SKUs into structured product categories with clear inventory valuation rules.',
          'Configured Odoo ERP to automate supplier payables schedules and maturity alerts.',
          'Trained store administrators on the vital discipline of real-time transactional posting.'
        ]
      },
      outcomeReflection: {
        title: 'Reflections on the Ongoing Transformation',
        quote: '“We are no longer guessing our inventory value or when vendor payments are due next week. For the first time, our business operations are beginning to make sense.”',
        note: 'ARUNA presents genuine ongoing transformations rather than fabricated success metrics. Real business transformation is a disciplined process built day by day.'
      }
    },
    diagnostic: {
      kicker: 'Self-Assessment Tool',
      title: 'Multi-Outlet Growth Readiness Diagnostic',
      subtitle: 'Assess your operational readiness before expanding to your next location in 2 minutes.',
      instructions: 'Select the option that best reflects your current operational reality. Upon completion, you will receive a diagnostic breakdown and tailored focus recommendations.',
      ctaSubmit: 'Calculate Readiness Score',
      reset: 'Reset Diagnostic',
      advisorCta: 'Discuss Results with an ARUNA Advisor'
    },
    ctaSection: {
      kicker: 'Next Steps',
      title: 'Ready to make your business make sense?',
      subtitle: 'Let’s understand where your business is today, what needs to be organized, and what kind of system can support where you are going.',
      primaryBtn: 'Talk to an Advisor',
      secondaryBtn: 'Quick WhatsApp Inquiry',
      reassurance: 'Our discovery conversations focus entirely on your business operations—with zero software sales pressure.'
    },
    footer: {
      brand: 'ARUNA',
      category: 'ERP Consulting & Business Transformation',
      tagline: 'MAKE BUSINESS MAKE SENSE.',
      description: 'A dedicated business transformation partner helping retail, F&B, and hospitality founders establish structured operations and fit-for-purpose ERP systems.',
      contactHeading: 'Get in Touch',
      office: 'Jakarta, Indonesia',
      workingHours: 'Monday – Friday | 09:00 – 18:00 WIB',
      email: 'advisory@aruna-consulting.id',
      phone: '+62 812-8800-4560',
      whatsapp: 'https://wa.me/6281288004560?text=Hello%20ARUNA,%20I%20would%20like%20to%20consult%20about%20our%20business%20process%20and%20ERP%20readiness.',
      quickLinksHeading: 'Navigation',
      legalHeading: 'Integrity Principles',
      disclaimer: 'ARUNA is grounded in capability honesty: we showcase real operational engagements without artificial metrics or vanity testimonials. Odoo is a registered trademark of Odoo S.A.',
      copyright: '© 2026 ARUNA. All rights reserved.'
    },
    modal: {
      title: 'Start a Conversation with an ARUNA Advisor',
      subtitle: 'A focused 30-minute discovery session to diagnose your operational bottlenecks and multi-outlet expansion path.',
      fields: {
        name: 'Full Name',
        businessName: 'Business / Brand Name',
        sector: 'Business Sector',
        outlets: 'Current Number of Outlets / Units',
        challenge: 'Primary Operational Challenge',
        contact: 'WhatsApp / Email Contact',
      },
      options: {
        sectors: ['Retail / Multi-Store', 'Food & Beverage (F&B)', 'Hospitality / Resort / Hotel', 'Distribution / Wholesale', 'Other'],
        outlets: ['1 Outlet (Preparing for Branch #2)', '2–3 Outlets', '4–7 Outlets', '8+ Outlets']
      },
      submitButton: 'Talk to an Advisor →',
      submitting: 'Connecting with Advisor...',
      successTitle: 'Your Request Has Been Received',
      successMessage: 'A Senior Business Advisor from ARUNA will review your operational context and reach out via WhatsApp within 1 business day.',
      orWhatsApp: 'Or message directly on WhatsApp with pre-filled context:',
      close: 'Close'
    }
  }
};

export const DIAGNOSTIC_QUESTIONS: { id: DiagnosticQuestion[]; en: DiagnosticQuestion[] } = {
  id: [
    {
      id: 'q_stock',
      category: 'Kontrol Persediaan & Stok',
      question: 'Bagaimana akurasi dan visibilitas stok barang di bisnis Anda saat ini?',
      options: [
        {
          label: 'Sering ada selisih misterius',
          score: 1,
          description: 'Stok fisik sering tidak cocok dengan catatan. Selisih baru diketahui saat stock opname atau barang habis mendadak.'
        },
        {
          label: 'Terkontrol manual oleh orang kepercayaan',
          score: 2,
          description: 'Stok relatif aman karena ada staf senior yang mengawasi, namun data belum real-time dan rentan jika staf tersebut berhalangan.'
        },
        {
          label: 'Tersistemasi & terotomatisasi',
          score: 3,
          description: 'Setiap barang masuk dan keluar langsung tercatat tersistem dengan alur otorisasi yang jelas antar-lokasi.'
        }
      ]
    },
    {
      id: 'q_purchasing',
      category: 'Pengadaan & Hutang Supplier (AP)',
      question: 'Bagaimana proses pemesanan barang dan pembayaran ke supplier dikelola?',
      options: [
        {
          label: 'Pemesanan via chat & faktur menumpuk',
          score: 1,
          description: 'Order dilakukan via pesan singkat tanpa PO resmi. Nota fisik menumpuk dan sering kaget saat tagihan jatuh tempo bersamaan.'
        },
        {
          label: 'Menggunakan spreadsheet terpisah',
          score: 2,
          description: 'Ada pencatatan PO di spreadsheet, namun sering tidak sinkron dengan penerimaan barang di gudang dan pembayaran kasir.'
        },
        {
          label: 'Alur PO & pencocokan 3-way match',
          score: 3,
          description: 'Setiap tagihan supplier wajib dicocokkan dengan PO dan surat tanda terima barang sebelum disetujui pembayarannya.'
        }
      ]
    },
    {
      id: 'q_financials',
      category: 'Kecepatan Laporan Keuangan',
      question: 'Seberapa cepat Anda sebagai pemilik bisnis bisa melihat laba rugi riil bulanan?',
      options: [
        {
          label: 'Terlambat lebih dari 3 minggu (atau tidak ada)',
          score: 1,
          description: 'Laporan keuangan bulanan baru selesai di akhir bulan berikutnya, sehingga keputusan bisnis diambil berdasarkan feeling atau saldo bank.'
        },
        {
          label: 'Selesai 1–2 minggu setelah tutup buku',
          score: 2,
          description: 'Laporan tersedia tapi proses rekapitulasinya menyita waktu dan angka persediaan sering kali masih merupakan angka estimasi.'
        },
        {
          label: 'Tersedia tepat waktu & dapat ditelusuri',
          score: 3,
          description: 'Laporan laba rugi dan neraca tersusun otomatis dari transaksi harian dan performa per outlet dapat dibandingkan.'
        }
      ]
    },
    {
      id: 'q_sop',
      category: 'Ketergantungan Figur Kunci',
      question: 'Apa yang terjadi jika manajer atau staf operasional senior Anda tidak masuk selama seminggu?',
      options: [
        {
          label: 'Operasional terancam terhenti',
          score: 1,
          description: 'Hanya mereka yang tahu password, alur ke supplier, dan cara menangani masalah stok. Owner harus turun tangan langsung menggantikan.'
        },
        {
          label: 'Berjalan dengan banyak kompromi',
          score: 2,
          description: 'Tim lain bisa menggantikan secara darurat, namun rawan kesalahan input dan banyak transaksi tertunda.'
        },
        {
          label: 'Berjalan normal sesuai SOP sistem',
          score: 3,
          description: 'Alur kerja terdokumentasi dan diatur oleh sistem, sehingga siapa pun yang bertugas dapat menjalankan tugas dengan standar yang sama.'
        }
      ]
    },
    {
      id: 'q_multi_branch',
      category: 'Kesiapan Ekspansi Cabang',
      question: 'Jika besok Anda memutuskan menyewa lokasi untuk outlet kedua/ketiga, apakah sistem Anda siap?',
      options: [
        {
          label: 'Jujur, sangat khawatir akan bocor',
          score: 1,
          description: 'Sistem saat ini belum stabil untuk 1 outlet. Membuka cabang baru terasa seperti menggandakan kekacauan.'
        },
        {
          label: 'Perlu banyak penyesuaian manual',
          score: 2,
          description: 'Bisa dipaksakan berjalan, tapi owner harus membagi waktu fisik ekstra untuk mengawasi langsung di lokasi baru.'
        },
        {
          label: 'Fondasi siap direplikasi',
          score: 3,
          description: 'Struktur data, hak akses, dan alur pergerakan barang antar-unit sudah siap diterapkan ke lokasi baru.'
        }
      ]
    }
  ],
  en: [
    {
      id: 'q_stock',
      category: 'Inventory & Stock Governance',
      question: 'How accurate and visible is your current inventory across locations?',
      options: [
        {
          label: 'Frequent unexplained discrepancies',
          score: 1,
          description: 'Physical counts rarely match books. Variances surface only during annual audits or sudden stockouts.'
        },
        {
          label: 'Controlled manually by trusted staff',
          score: 2,
          description: 'Relatively safe because a veteran manager oversees it, but data is delayed and highly vulnerable if they are absent.'
        },
        {
          label: 'Systematized and automated',
          score: 3,
          description: 'All goods movement is digitally tracked in real time with disciplined inter-location transfer approvals.'
        }
      ]
    },
    {
      id: 'q_purchasing',
      category: 'Procurement & Supplier Payables (AP)',
      question: 'How are vendor purchasing and payments handled?',
      options: [
        {
          label: 'Informal chats & unorganized bills',
          score: 1,
          description: 'Orders placed informally without formal POs. Invoices accumulate and cash obligations surprise management.'
        },
        {
          label: 'Tracked on disconnected spreadsheets',
          score: 2,
          description: 'POs logged on spreadsheets, but frequently out of sync with actual receiving and accounting disbursements.'
        },
        {
          label: 'Formal POs & 3-way matching',
          score: 3,
          description: 'Every invoice is verified against the authorized PO and warehouse receiving note before payment release.'
        }
      ]
    },
    {
      id: 'q_financials',
      category: 'Financial Reporting Velocity',
      question: 'How quickly can you review verified monthly profit & loss reports?',
      options: [
        {
          label: 'Delayed over 3 weeks (or unavailable)',
          score: 1,
          description: 'Monthly statements arrive at the end of the following month, forcing decisions based on gut feel and bank balances.'
        },
        {
          label: 'Ready 1–2 weeks post month-end',
          score: 2,
          description: 'Reports exist but reconciliation is laborious and ending inventory relies heavily on rough estimates.'
        },
        {
          label: 'Timely, automated & drillable',
          score: 3,
          description: 'P&L and balance sheets generate from daily operational postings, allowing branch performance comparisons.'
        }
      ]
    },
    {
      id: 'q_sop',
      category: 'Key-Person Dependency',
      question: 'What occurs if your key operations manager is absent for a week?',
      options: [
        {
          label: 'Operations risk grinding to a halt',
          score: 1,
          description: 'Only they possess supplier contacts, password access, and inventory adjustments. The owner must step in.'
        },
        {
          label: 'Struggles through with friction',
          score: 2,
          description: 'Other staff manage in survival mode, but errors multiply and critical transactions stall.'
        },
        {
          label: 'Runs smoothly via systemized SOPs',
          score: 3,
          description: 'Processes and authorization rules are codified into system permissions, enabling any authorized staff to execute cleanly.'
        }
      ]
    },
    {
      id: 'q_multi_branch',
      category: 'Multi-Outlet Readiness',
      question: 'If you signed a lease for an additional outlet tomorrow, would your system hold?',
      options: [
        {
          label: 'Honestly anxious about operational leakage',
          score: 1,
          description: 'Our current setup is already strained on one unit. Expanding now feels like multiplying existing chaos.'
        },
        {
          label: 'Requires heavy manual compensation',
          score: 2,
          description: 'Could be made to work, but would demand the owner’s physical presence to personally police the new store.'
        },
        {
          label: 'Architecture ready for replication',
          score: 3,
          description: 'Master data schemas, user access roles, and inter-unit supply flows are ready to roll out to the new location.'
        }
      ]
    }
  ]
};
