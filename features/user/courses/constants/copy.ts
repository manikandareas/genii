// KASIAN BAGINDA Formula Applied - Courses Page Copy
// Kenapa (Why): Skill stagnation & career advancement needs
// Apa (What): Expert-led courses & practical skills
// Siapa (Who): Indonesian professionals wanting growth
// Kapan (When): Start immediately, don't wait
// Bagaimana (How): Step-by-step learning from experts
// Di mana (Where): Clear CTAs and navigation

export const COURSES_COPY = {
  // Meta Tags
  meta: {
    title: 'Kursus Terbaik | Genii - Upgrade Skill, Tingkatkan Karir',
    description: 'Mengapa stagnan di karir? Upgrade skill dengan kursus expert-led kami. 12k+ profesional sudah maju. Mulai hari ini, raih karir impian!',
  },

  // Error States  
  error: {
    title: 'Aduh! Ada yang tidak beres',
    description: 'Jangan khawatir, ini bukan salahmu. Mari kita coba lagi dan lanjutkan perjalanan belajarmu.',
    retryButton: 'Coba Lagi',
  },

  // Recommendation Section
  recommendation: {
    badge: '✨ Dipilih Khusus Untukmu',
    title: 'Jalur Belajar Dipersonalisasi untuk Karirmu',
    subtitle: 'Mengapa buang waktu belajar yang tidak relevan? Kami telah menyiapkan kursus terbaik berdasarkan tujuan karirmu.',
  },

  // Course List Section
  courseList: {
    badge: 'Semua Kursus',
    titles: {
      default: 'Jelajahi Semua Kursus Terbaik',
      search: (count: number) => `Hasil Pencarian (${count} kursus)`,
    },
    descriptions: {
      default: 'Mengapa tertinggal dari yang lain? Temukan koleksi lengkap kursus dari para ahli yang sudah membuktikan kesuksesan mereka di industri.',
      search: (count: number, query: string) => 
        `Menemukan ${count} kursus yang cocok dengan "${query}". Pilih yang paling sesuai dengan tujuan karirmu sekarang.`,
    },
    searchPlaceholder: 'Cari kursus yang kamu butuhkan...',
    stats: {
      totalCourses: 'Total Kursus',
      students: 'Pelajar',
      avgRating: 'Rating Rata-rata',
    },
  },

  // Empty States
  emptyStates: {
    noSearchResults: {
      title: 'Tidak menemukan yang kamu cari?',
      description: 'Jangan menyerah! Coba kata kunci lain atau jelajahi semua kursus kami. Siapa tahu menemukan passion baru yang bisa mengubah karirmu.',
      clearButton: 'Hapus Pencarian',
    },
    noCourses: {
      title: 'Kursus baru sedang dalam persiapan',
      description: 'Kami sedang menyiapkan kursus-kursus terbaru dari para expert. Pantau terus ya, jangan sampai terlewat!',
    },
  },

  // Call-to-Action Messages
  cta: {
    urgency: 'Mulai hari ini, jangan tunda lagi!',
    social_proof: 'Bergabung dengan 12k+ profesional yang sudah berhasil upgrade skill',
    value_proposition: 'Belajar langsung dari praktisi berpengalaman dengan project real-world',
  },
} as const;

// Type for better TypeScript support
export type CoursesCopyType = typeof COURSES_COPY;