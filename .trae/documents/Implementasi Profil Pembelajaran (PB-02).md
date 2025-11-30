## Tujuan
- Menyediakan halaman "Profil Pembelajaran" untuk siswa yang menampilkan riwayat pembelajaran, preferensi (learningGoals, level, languagePreference, explanationStyle), dan ringkasan progres.
- Menggunakan data yang sudah ada di Convex (`users`, `course_enrollments`, opsional `quiz_attempts`).

## Cakupan Fitur
- Header profil: avatar, nama, level, bahasa, gaya penjelasan.
- Preferensi belajar: daftar `learningGoals`, `level`, `languagePreference`, `explanationStyle`.
- Riwayat & progres kursus: daftar enrollment dengan progress bar, status (`not_started`/`in_progress`/`completed`), tombol lanjut ke konten berikutnya.
- Ringkasan cepat: total kursus diikuti, kursus selesai, progres rata-rata, aktivitas terakhir.
- Aksi: "Ubah preferensi" (kembali ke `/onboarding`) dan "Lihat rekomendasi" (ke `/journey`).

## Perubahan Data (Backend)
- Tambahkan query untuk menarik data yang diperlukan:
  1) `users.courses.queries.listEnrollmentsForMe` — daftar seluruh enrollment pengguna + join minimal ke `courses` (title, slug, difficulty, thumbnail). Lokasi: `convex/users/courses/queries.ts`.
  2) (Opsional) `users.quizzes.queries.listRecentAttempts` — 10 attempt terbaru milik user untuk menampilkan skor & durasi. Lokasi: `convex/users/quizzes/queries.ts`.
- Reuse yang ada:
  - `api.users.queries.getMe` (data user): `convex/users/queries.ts:70`.
  - `getCourseContent` (untuk link konten), bila diperlukan: `convex/users/courses/queries.ts:73`.

## Perubahan UI (Frontend)
- Buat halaman `app/(user)/profile/page.tsx` (server component) yang memeriksa `currentUser`, redirect ke `/` jika belum login, dan ke `/admin/dashboard` jika admin.
- Tambah client component `features/user/profile/components/profile-view.tsx` yang:
  - Memanggil `convexQuery(api.users.queries.getMe, {})` untuk preferensi.
  - Memanggil `convexQuery(api.users.courses.queries.listEnrollmentsForMe, {})` untuk daftar kursus dan progres.
  - (Opsional) Memanggil `convexQuery(api.users.quizzes.queries.listRecentAttempts, { limit: 10 })` untuk ringkasan quiz.
  - Menampilkan:
    - "Preferensi Belajar" (cards sederhana)
    - "Kursus Saya" (list dengan progress bar dan CTA lanjut)
    - "Ringkasan" (statistik ringan)
    - Aksi (ubah preferensi, lihat rekomendasi)
- Reuse komponen UI: `Progress` (`features/shared/components/ui/progress.tsx`), `Button`, `Badge`, dll.

## Navigasi & Keamanan
- Route: `/profile` berada di grup `(user)`.
- Proteksi: menggunakan Clerk `currentUser` di `app/(user)/profile/page.tsx`. Jika admin, redirect ke `/admin/dashboard` (konsisten dengan `app/(user)/journey/page.tsx:20`).

## Acceptance Criteria
- Halaman `/profile` menampilkan:
  - Preferensi belajar yang tersimpan dari onboarding.
  - Daftar kursus yang di-enroll, masing-masing dengan persen progres dan status.
  - Tombol "Lanjut" menuju konten berikutnya kursus (reused logic dari `course-enrollment-dialog.tsx`).
  - Aksi ke `/onboarding` dan `/journey` bekerja.
- Data bersumber dari Convex, tidak mock.
- UX konsisten dengan komponen yang sudah ada.

## Rencana Implementasi Teknis
1) Backend queries:
   - Tambahkan `listEnrollmentsForMe` di `convex/users/courses/queries.ts`:
     - Cek identity → ambil user by `by_clerk`.
     - Query `course_enrollments` by_user → enrich dengan course minimal fields.
     - Return array `[ { enrollment, course } ]`.
   - (Opsional) Tambahkan `listRecentAttempts` di `convex/users/quizzes/queries.ts`:
     - Query `quiz_attempts` by_user → sort desc by `updatedAt`/`submittedAt` → limit.
2) Frontend:
   - Tambah `app/(user)/profile/page.tsx` (server): cek auth & role.
   - Buat `features/user/profile/components/profile-view.tsx` yang konsumsi queries dan render UI.
   - Reuse `Progress` komponen untuk visual.
   - Gunakan utilitas penentuan next content dari `course-enrollment-dialog.tsx` sebagai referensi.

## Dampak ke Backlog
- Setelah implementasi selesai dan terverifikasi, ubah Status PB-02 dari "Sebagian" menjadi "Sudah" di `docs/product-backlog.md`.

## Uji & Verifikasi
- Uji dengan user yang sudah menyelesaikan onboarding: pastikan preferensi tampil.
- Enroll 1–2 kursus, tandai beberapa lesson selesai, pastikan progress terhitung dan tampil di profil.
- Cek redirect dan aksi (onboarding/journey) serta akses belum login.

Konfirmasi untuk melanjutkan implementasi sesuai rencana di atas?