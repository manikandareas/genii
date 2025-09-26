// KASIAN BAGINDA Formula Applied - Lesson Page Copy
// Kenapa (Why): Learning frustration, confusion, getting stuck on concepts
// Apa (What): Comprehensive lessons with AI assistance and clear progress tracking
// Siapa (Who): Indonesian professionals/students wanting practical skills
// Kapan (When): Learn at own pace, get help immediately when needed
// Bagaimana (How): Step-by-step lessons with intelligent AI support
// Di mana (Where): Easy navigation and accessible help features

export const LESSON_COPY = {
  // Meta Tags
  meta: {
    titleSuffix: '| Genii - Belajar Praktis dengan AI Assistant',
    fallbackDescription:
      'Mengapa belajar sendiri tanpa bantuan? Dapatkan pemahaman mendalam dengan AI assistant yang siap membantu kapan saja!',
  },

  // Loading and Error States
  states: {
    loading: 'Menyiapkan pembelajaran terbaikmu...',
    error: {
      title: 'Ups! Ada kendala teknis',
      message:
        'Jangan khawatir, ini bukan karena kemampuanmu. Mari kita coba lagi dan lanjutkan perjalanan belajarmu!',
      retry: 'Coba Lagi Sekarang',
    },
    chatLoading: 'AI assistant sedang bersiap membantu...',
  },

  // Header Navigation
  header: {
    backToCourse: {
      label: 'Kembali ke Ringkasan Kursus',
      title: 'Lihat progress dan lanjutkan pembelajaran lainnya',
    },
    outline: {
      label: 'Struktur Pembelajaran',
      title: 'Lihat roadmap lengkap untuk mencapai tujuanmu',
    },
    fullscreen: {
      enter: 'Mode Fokus Penuh',
      exit: 'Keluar dari Mode Fokus',
      enterTitle: 'Eliminasi distraksi, maksimalkan konsentrasi belajar',
      exitTitle: 'Kembali ke tampilan normal',
    },
    menu: {
      open: 'Buka Menu Pembelajaran',
    },
  },

  // AI Chat Interface
  chat: {
    sideTrigger: {
      default: 'Butuh Bantuan ?',
      alternative: 'Tanya AI Sekarang',
    },
    buttons: {
      open: 'Tanya Genii',
      close: 'Tutup Chat',
      openMobile: 'Butuh Bantuan AI?',
    },
  },

  // Lesson Navigation
  navigation: {
    previous: {
      label: 'Materi Sebelumnya',
      title: 'Review materi yang sudah kamu kuasai',
    },
    next: {
      label: 'Lanjut ke Materi Berikutnya',
      title: 'Siap untuk tantangan selanjutnya?',
    },
    complete: {
      lesson: 'Selesaikan & Lanjut',
      lessonTitle: 'Tandai sebagai selesai dan lanjut ke materi berikutnya',
      course: 'Selesaikan Kursus',
      courseTitle: 'Selamat! Kamu hampir menyelesaikan seluruh kursus',
      inProgress: 'Sedang menyimpan progress...',
    },
    achievement: {
      lessonCompleted: '🎉 Materi berhasil diselesaikan!',
      courseProgress: 'Progress kursus: {{percentage}}% selesai',
      nextStep: 'Siap untuk tantangan berikutnya?',
    },
  },

  // Progress Indicators
  progress: {
    current: 'Materi saat ini',
    completed: '✓ Sudah dikuasai',
    locked: '🔒 Akan terbuka setelah menyelesaikan materi sebelumnya',
    courseInfo: 'Kursus: {{courseTitle}}',
    chapterInfo: 'Bab {{chapterNumber}}: {{chapterTitle}}',
  },

  // Accessibility Labels
  accessibility: {
    chatTrigger: 'Buka AI Assistant untuk bantuan pembelajaran',
    chatClose: 'Tutup AI Assistant',
    backButton: 'Kembali ke halaman kursus',
    nextButton: 'Lanjut ke materi selanjutnya',
    previousButton: 'Kembali ke materi sebelumnya',
    completeButton: 'Tandai materi sebagai selesai',
    outlineButton: 'Buka struktur pembelajaran kursus',
    fullscreenButton: 'Beralih ke mode layar penuh untuk fokus maksimal',
  },

  // Motivational Messages
  motivation: {
    keepGoing: 'Kamu sedang dalam jalur yang tepat! Terus semangat belajar!',
    almostDone: 'Sedikit lagi! Kamu hampir menguasai materi ini.',
    wellDone: 'Hebat! Kamu berhasil menyelesaikan materi dengan baik.',
    nextLevel: 'Siap naik ke level selanjutnya? Mari kita lanjutkan!',
    stuckHelp: 'Merasa bingung? Jangan ragu bertanya ke AI assistant!',
  },

  // Call-to-Action Messages
  cta: {
    chatHelp:
      'Jangan biarkan kebingungan menghambat belajarmu. Tanya AI sekarang!',
    continueProgress:
      'Jangan berhenti di sini! Lanjutkan perjalanan belajarmu.',
    completeLesson: 'Selesaikan materi ini dan buktikan kemajuanmu!',
    askForHelp: 'Ada yang tidak jelas? AI assistant siap membantu 24/7!',
  },
} as const;

// Type for better TypeScript support
export type LessonCopyType = typeof LESSON_COPY;
