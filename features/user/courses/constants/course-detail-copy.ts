// KASIAN BAGINDA Formula Applied - Course Detail Page Copy
// Kenapa (Why): Career stagnation while others advance rapidly
// Apa (What): Expert-led practical courses with portfolio projects
// Siapa (Who): Indonesian professionals seeking career breakthrough
// Kapan (When): Start today - don't let competitors get ahead
// Bagaimana (How): Step-by-step learning + direct mentoring from practitioners
// Di mana (Where): Enroll now, free forever

export const COURSE_DETAIL_COPY = {
  // Meta Tags
  meta: {
    titleSuffix: '| Genii - Upgrade Skill, Raih Karir Impian',
    defaultDescription:
      'Mengapa teman-teman sudah maju pesat di karir sementara kamu stagnan? Saatnya upgrade skill dengan kursus praktis dari expert. Jutaan profesional sudah berhasil breakthrough!',
  },

  // Hero Section
  hero: {
    badge: {
      beginner: '🎯 Pemula Friendly',
      intermediate: '⚡ Level Menengah',
      advanced: '🚀 Expert Level',
    },
    subtitle:
      'Mengapa karir stagnan sementara yang lain maju pesat? Saatnya breakthrough dengan skill yang tepat!',
  },

  // Contents Section
  contents: {
    badge: 'Materi Kursus',
    title: 'Apa saja yang akan kamu kuasai?',
    description:
      'Mengapa buang waktu belajar teori yang tidak berguna? Ini adalah kurikulum praktis yang dirancang khusus untuk breakthrough karir kamu.',
    structure: {
      title: 'Struktur Pembelajaran',
      description:
        'Setiap materi dirancang bertahap dari dasar hingga mahir. Tidak ada yang terlewat!',
    },
    outcomes: {
      badge: '🎯 Hasil Pembelajaran',
      title: 'Yang akan kamu capai setelah kursus ini',
      defaultItems: [
        'Bangun 16+ project portfolio yang bikin HRD terkesan saat interview',
        'Kuasai teknologi terkini yang dibutuhkan perusahaan top Indonesia',
        'Siap kerja sebagai developer dengan confidence tinggi',
        'Bisa freelance dengan rate Rp 2-5 juta per project',
        'Network dengan 12k+ profesional IT di Indonesia',
        'Akses lifetime ke komunitas developer eksklusif',
        'Mentoring langsung dari praktisi berpengalaman 10+ tahun',
        'Sertifikat yang diakui perusahaan teknologi terkemuka',
      ],
    },
  },

  // Promo Section
  promo: {
    title: 'Jangan sampai tertinggal dari yang lain!',
    subtitle:
      'Sementara kamu ragu, kompetitor sudah mulai belajar dan maju. Ambil kesempatan emas ini sebelum terlambat.',
    cta: 'Daftar Sekarang - Gratis Selamanya',
    urgency: '⏰ Ribuan profesional sudah mulai hari ini',
  },

  // CTA Section
  cta: {
    notEnrolled: {
      primary: 'Mulai Belajar Sekarang',
      description:
        'Bergabung dengan 12k+ profesional yang sudah berhasil upgrade skill dan naik jabatan',
    },
    enrolled: {
      continue: 'Lanjutkan Belajar',
      review: 'Review Materi',
      description:
        'Tetap konsisten! Kamu sudah di jalur yang tepat menuju breakthrough karir.',
    },
  },

  // Enrollment Dialog
  enrollDialog: {
    title: 'Siap upgrade skill dan raih karir impian?',
    subtitle:
      'Bergabunglah dengan ribuan profesional yang sudah berhasil naik jabatan',
    features: {
      duration: (hours: string) => `${hours} konten premium`,
      lessons: (count: number) => `${count}+ pembelajaran terstruktur`,
      topics: 'Teknologi terkini & praktis',
      access: '♾️ Akses selamanya',
    },
    aboutTitle: 'Kenapa harus kursus ini?',
    aboutDescription:
      'Dibuat khusus untuk profesional Indonesia yang ingin breakthrough karir. Materi praktis, mentor berpengalaman, dan komunitas yang mendukung kesuksesan kamu.',
    ctaPrimary: 'Ya, Saya Siap Upgrade Skill!',
    ctaProcessing: 'Sedang mendaftarkan...',
    socialProof: '🔥 12k+ profesional sudah berhasil naik jabatan',
    urgency: '⚡ Daftar hari ini, mulai belajar sekarang juga!',
  },

  // Learning Outcomes
  learningOutcomes: {
    title: 'Skill apa yang akan kamu kuasai',
    subtitle:
      'Setiap skill dirancang untuk meningkatkan value kamu di mata perusahaan',
  },

  // Error States
  error: {
    enrollmentFailed: 'Oops! Pendaftaran gagal',
    enrollmentFailedDesc:
      'Jangan khawatir, coba lagi. Tim kami siap membantu kamu breakthrough karir!',
    missingData: 'Data tidak lengkap',
    missingDataDesc:
      'Kamu perlu login dulu untuk mulai belajar. Mari kita lanjutkan perjalanan upgrade skill kamu!',
    networkError: 'Koneksi bermasalah',
    networkErrorDesc:
      'Periksa koneksi internet kamu dan coba lagi. Jangan sampai ini menghalangi breakthrough karir kamu!',
  },

  // Success Messages
  success: {
    enrolled: 'Selamat! Kamu sudah terdaftar 🎉',
    enrolledDesc:
      "Sekarang saatnya mulai belajar dan raih karir impian. Let's goooo!",
  },

  // Social Proof & Stats
  socialProof: {
    studentsCount: '12,000+ profesional',
    studentsDesc: 'sudah berhasil upgrade skill',
    successRate: '95% lulusan',
    successDesc: 'berhasil naik jabatan dalam 6 bulan',
    avgSalaryIncrease: '40-60%',
    salaryDesc: 'kenaikan gaji rata-rata alumni',
  },

  // FOMO & Urgency
  urgency: {
    limitedTime: '⏰ Kesempatan terbatas!',
    competitors: 'Sementara kamu ragu, kompetitor sudah mulai belajar',
    dontWait: 'Jangan tunggu sampai terlambat',
    startToday: 'Mulai hari ini, raih karir impian besok',
    freeForever: 'Gratis untuk selamanya - tidak ada biaya tersembunyi',
  },

  // Call-to-Action Variations
  ctaVariations: {
    primary: 'Mulai Belajar Gratis',
    secondary: 'Daftar Sekarang',
    urgent: 'Ambil Kesempatan Ini!',
    social: 'Bergabung dengan 12k+ Profesional',
    benefit: 'Raih Karir Impian',
    action: 'Upgrade Skill Sekarang',
  },
} as const;

// Type for better TypeScript support
export type CourseDetailCopyType = typeof COURSE_DETAIL_COPY;
