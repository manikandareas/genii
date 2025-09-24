// KASIAN BAGINDA Formula Applied - Navbar Copy
// Kenapa (Why): Karir stagnan & persaingan kerja yang ketat membutuhkan skill upgrade
// Apa (What): Platform pembelajaran profesional dengan kursus expert-led
// Siapa (Who): Profesional Indonesia usia 25-40 yang ingin maju karir
// Kapan (When): Mulai hari ini, jangan tunda - gap skill semakin lebar setiap hari
// Bagaimana (How): Pembelajaran step-by-step dari praktisi berpengalaman
// Di mana (Where): Navigasi jelas dengan CTA yang compelling

export const NAVBAR_COPY = {
  // Navigation Items
  navigation: {
    home: 'Beranda',
    courses: 'Kursus Terbaik',
    progress: 'Progress Kamu',
    community: 'Blog (Segera)',
  },

  // Authentication Section
  auth: {
    signIn: 'Masuk Sekarang',
    getStarted: 'Mulai Upgrade Skill',
    socialProof: '12k+ profesional sudah bergabung',
  },

  // Feedback Section
  feedback: {
    desktop: 'Bagi Feedback 🙏🏻',
    mobile: 'Kirim Saran untuk Kemajuan Bersama',
    ariaLabel: 'Kirim masukan untuk pengembangan platform',
  },

  // Accessibility Labels
  accessibility: {
    mainNav: 'Navigasi utama',
    mobileNav: 'Navigasi mobile',
    mobileMenuOpen: 'Buka menu navigasi',
    mobileMenuClose: 'Tutup menu navigasi',
    homepage: 'Kembali ke beranda',
  },

  // Call-to-Action Messages
  cta: {
    urgency:
      'Jangan terlambat! Setiap hari tanpa skill baru adalah kesempatan yang hilang',
    socialProof: 'Bergabung dengan ribuan profesional yang sudah maju karirnya',
    valueProposition:
      'Belajar langsung dari expert yang sudah membuktikan kesuksesannya',
  },
} as const;

// Type for better TypeScript support
export type NavbarCopyType = typeof NAVBAR_COPY;
