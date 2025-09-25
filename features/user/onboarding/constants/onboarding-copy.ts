export const ONBOARDING_COPY = {
  // Meta Tags - SEO with career urgency
  meta: {
    title:
      "Setup Belajar | Genii - Jalur Karir Dipersonalisasi untuk Profesional Indonesia",
    description:
      "Jangan tertinggal dari kompetitor! Setup jalur belajar yang tepat sasaran. 4 langkah mudah, hasil maksimal. 12k+ profesional sudah memulai hari ini.",
  },

  // Step Configuration with Psychological Progression
  steps: {
    focus: {
      name: "Bidang apa yang ingin kamu kuasai?",
      description:
        "Pilih area fokus yang akan mengubah karirmu. Semakin spesifik, semakin cepat kamu menjadi expert di bidangnya.",
    },
    level: {
      name: "Sejauh mana kemampuanmu saat ini?",
      description:
        "Jujur saja, di mana posisimu sekarang? Ini akan membantu kami menyesuaikan pembelajaran agar tidak terlalu mudah atau terlalu sulit.",
    },
    preferences: {
      name: "Bagaimana cara belajar yang paling cocok untukmu?",
      description:
        "Setiap orang punya gaya belajar berbeda. Pilih preferensi bahasa dan gaya penjelasan yang membuatmu paham dengan cepat.",
    },
  },

  // Form Labels with Career Context
  labels: {
    focusAreas: "Area Fokus Karir",
    currentLevel: "Level Kemampuan Saat Ini",
    languageStyle: "Preferensi Pembelajaran",
  },

  // Focus Areas - Rewritten for Career Impact
  focusAreas: [
    {
      id: "web-development",
      title: "Web Development",
      description:
        "Bangun aplikasi web modern yang dibutuhkan setiap perusahaan",
      quote:
        "Setiap bisnis butuh web developer handal. Permintaan tinggi, gaji menarik, karir cemerlang menantimu!",
      urgency: "Demand tinggi: 500+ lowongan baru setiap bulan",
    },
    {
      id: "mobile-development",
      title: "Mobile Development",
      description: "Ciptakan aplikasi mobile yang digunakan jutaan orang",
      quote:
        "Era mobile-first! Perusahaan berlomba cari mobile developer expert. Jadi yang terdepan sebelum terlambat.",
      urgency: "Market mobile app Indonesia tumbuh 40% per tahun",
    },
    {
      id: "ui-ux-design",
      title: "UI/UX Design",
      description: "Rancang pengalaman digital yang memukau dan menguntungkan",
      quote:
        "Design yang baik = produk yang laku. Skill ini yang paling dicari startup unicorn Indonesia!",
      urgency: "Startup membayar UX designer 2x lipat dari rata-rata",
    },
    {
      id: "data-science",
      title: "Data Science",
      description: "Ubah data menjadi insights bernilai miliaran rupiah",
      quote:
        "Data is the new oil! Perusahaan besar bayar mahal untuk data scientist yang bisa menganalisis dengan tepat.",
      urgency: "Kekurangan 80% data scientist di Indonesia",
    },
    {
      id: "cloud-computing",
      title: "Cloud Computing",
      description: "Kelola infrastruktur cloud yang mendukung bisnis digital",
      quote:
        "Semua pindah ke cloud! AWS, Azure, GCP - keahlian ini jaminan masa depan karir yang cerah.",
      urgency: "Cloud adoption naik 300% pasca pandemi",
    },
    {
      id: "devops",
      title: "DevOps Engineering",
      description: "Otomatisasi pengembangan dan deployment aplikasi modern",
      quote:
        "DevOps adalah jembatan antara development dan operations. Skill yang wajib dikuasai developer modern!",
      urgency: "DevOps engineer paling dicari tech company global",
    },
  ],

  // Level Selection - Removing Imposter Syndrome
  levels: [
    {
      id: "beginner",
      title: "Pemula",
      description: "Baru mulai atau punya pengalaman minimal di bidang ini",
      quote:
        "Everyone starts somewhere! Yang penting kamu sudah memulai hari ini. Konsistensi mengalahkan perfection.",
      encouragement:
        "Setiap expert pernah jadi pemula. Kamu sudah selangkah lebih maju!",
    },
    {
      id: "intermediate",
      title: "Menengah",
      description:
        "Sudah punya dasar dan pengalaman, ingin naik level lebih tinggi",
      quote:
        "Perfect timing! Kamu sudah punya fondasi, sekarang waktunya akselerasi ke level expert yang menghasilkan.",
      encouragement:
        "Level ini yang paling crucial - dari sini kamu akan breakthrough ke senior!",
    },
    {
      id: "advanced",
      title: "Mahir",
      description:
        "Expert yang ingin mengasah skill untuk tantangan yang lebih kompleks",
      quote:
        "Impressive! Expert sepertimu yang akan jadi mentor dan leader di industri. Keep pushing boundaries!",
      encouragement:
        "Your expertise + continuous learning = unstoppable career growth!",
    },
  ],

  // Language and Style Preferences
  languages: [
    {
      id: "id",
      title: "Bahasa Indonesia",
      description: "Penjelasan menggunakan Bahasa Indonesia sepenuhnya",
      quote:
        "Belajar dengan bahasa sendiri pasti lebih mudah dipahami dan diingat!",
    },
    {
      id: "en",
      title: "English",
      description: "Full English explanations for international exposure",
      quote:
        "Great for building global mindset and accessing worldwide opportunities!",
    },
    // {
    //   id: "mix",
    //   title: "Campur (ID + EN)",
    //   description:
    //     "Campuran Bahasa Indonesia dengan istilah teknis dalam English",
    //   quote:
    //     "Perfect balance! Mudah dipahami tapi tetap familiar dengan term internasional.",
    // },
  ],

  explanationStyles: [
    {
      id: "simple",
      title: "Sederhana & Praktis",
      description: "Langsung to the point, fokus pada aplikasi praktis",
      quote:
        "Efisien! Belajar yang penting-penting saja, langsung bisa dipraktikkan.",
      exampleMaterial: {
        topic: "React useState Hook",
        content:
          "useState berfungsi untuk menyimpan data di komponen. Cara pakai: const [jumlah, setJumlah] = useState(0). Panggil setJumlah(1) untuk mengubah nilai.",
        highlight: "Langsung praktek - tanpa teori, fokus ke kode!",
      },
    },
    {
      id: "detailed",
      title: "Detail & Mendalam",
      description: "Penjelasan komprehensif dengan teori dan best practices",
      quote:
        'Melalui Pendekatan! Kamu akan paham tidak hanya "how" tapi juga "why" nya.',
      exampleMaterial: {
        topic: "React useState Hook",
        content:
          "useState adalah Hook fundamental yang memungkinkan komponen fungsional mengelola state lokal. Hook ini mengembalikan array: [stateSekarang, fungsiPengubah]. Fungsi pengubah memicu re-render dan mengikuti aturan batching React untuk performa optimal.",
        highlight:
          "Pemahaman lengkap - teori, best practice, dan implikasi performa",
      },
    },
    {
      id: "analogy",
      title: "Analogi & Storytelling",
      description:
        "Menggunakan perumpamaan dan cerita untuk memudahkan pemahaman",
      quote:
        "Belajar kreatif! Konsep sulit jadi mudah dengan analogi yang relate-able.",
      exampleMaterial: {
        topic: "React useState Hook",
        content:
          "Bayangkan useState seperti papan tulis ajaib. Kamu menulis sebuah nilai (state saat ini) dan mendapat penghapus sakti (fungsi setter). Ketika kamu menghapus dan menulis ulang, React otomatis menampilkan papan tulis yang sudah diperbarui kepada semua orang yang melihat komponenmu!",
        highlight: "Belajar lewat cerita dan analogi yang mudah dipahami",
      },
    },
    // {
    //   id: 'visual',
    //   title: 'Visual & Interaktif',
    //   description:
    //     'Banyak diagram, chart, dan elemen visual untuk pembelajaran optimal',
    //   quote:
    //     'Visual ! Seeing is believing - kamu akan paham lebih cepat dengan pendekatan ini.',
    // },
  ],

  // Navigation and Action Buttons
  actions: {
    back: "Kembali",
    next: "Lanjutkan",
    finishSetup: "Mulai Belajar Sekarang!",
    saving: "Menyimpan preferensimu...",
  },

  // Validation Messages with Encouragement
  validation: {
    focusRequired:
      "Pilih minimal 1 area fokus untuk memulai perjalanan karirmu",
    focusTooLong:
      "Singkat saja, maksimal 3 area fokus agar fokus dan actionable",
    levelRequired:
      "Pilih level kemampuanmu saat ini - no judgment, hanya untuk personalisasi",
    languageRequired: "Pilih preferensi bahasa yang membuatmu nyaman belajar",
    styleRequired:
      "Pilih gaya penjelasan yang paling cocok dengan cara belajarmu",
  },

  // Success States with Motivation
  success: {
    title: "Setup Selesai! 🎉",
    description:
      "Selamat! Kamu telah selangkah lebih dekat menuju karir impian. Mari mulai perjalanan pembelajaranmu!",
    nextStep:
      "Kamu akan diarahkan ke rekomendasi kursus yang dipersonalisasi untukmu...",
  },

  // Progress Indicators
  progress: {
    step: (current: number, total: number) =>
      `Langkah ${current} dari ${total}`,
    completion: (percentage: number) => `${percentage}% menuju karir impianmu`,
  },

  // Call-to-Action Messages with Urgency
  cta: {
    urgency:
      "Jangan tunda lagi! Setiap hari delay = kompetitor yang makin jauh di depan",
    social_proof:
      "Bergabung dengan 12k+ profesional yang sudah upgrade skill dan naik gaji",
    value_proposition:
      "Setup sekali, manfaat seumur hidup - jalur belajar yang tepat sasaran",
    completion_motivation:
      "Tinggal sedikit lagi! Kamu hampir mendapatkan akses ke jalur belajar terbaik",
  },

  // Error States
  error: {
    title: "Ups! Ada kendala teknis",
    description:
      "Jangan khawatir, ini bukan salahmu. Sistem kami sedang bekerja keras untuk memperbaikinya.",
    retry: "Coba Lagi",
    support: "Butuh bantuan? Chat kami sekarang!",
  },
} as const;

// Type for better TypeScript support
export type OnboardingCopyType = typeof ONBOARDING_COPY;
