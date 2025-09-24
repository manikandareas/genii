# PRD Admin Content Management

## 1. Ringkasan

Bangun konsol admin berbasis web yang menggantikan fungsi Sanity Studio untuk mengelola konten pembelajaran NgeCourse. Aplikasi dijalankan di stack React Router + Vite yang sudah ada dan terhubung langsung ke Convex sebagai single source of truth, termasuk penyimpanan aset/file. Fokus utama: CRUD cepat dan andal untuk entitas statis (topik, kursus, bab, pelajaran, kuis) dengan pengalaman sederhana tanpa fitur kolaborasi kompleks.

## 2. Sasaran & Kriteria Sukses

- Seluruh field yang diperlukan pengalaman publik (topik, kursus, bab, pelajaran, kuis) tersedia di UI admin.
- Editor rich-text untuk pelajaran menggunakan Plate UI dan menyimpan struktur yang kompatibel dengan renderer frontend.
- Upload/management aset (thumbnail, gambar editor) ditangani melalui Convex storage.
- Perjalanan dari daftar ke form edit maksimal 3 klik.
- Target rilis v1: **8 November 2025** (2 minggu pengembangan + 1 minggu buffer).

## 3. Batasan / Di Luar Ruang Lingkup

- Tidak membangun kolaborasi multi-user, komentar, atau workflow persetujuan.
- Tidak menyentuh fitur state learner (achievement, enrollment, dsb.).

## 4. Persona Utama

- **Pemilik Konten (Admin/Solo Dev):** Mengelola konten setiap hari, perlu alur cepat dan stabil.
- **Kontributor Materi (Calon):** Editor sesekali; butuh form yang jelas tanpa pengaturan rumit.

## 5. Kasus Penggunaan Kunci

1. Membuat topik baru lengkap dengan ikon/warna.
2. Membuat atau menduplikasi kursus, mengaitkan topik, mengatur urutan bab, dan menambah learning outcomes serta resources.
3. Menambah bab pada kursus dan mengatur urutan pelajaran/kuis di dalamnya.
4. Menulis konten pelajaran dengan Plate UI, termasuk sisip gambar/video. [Plate UI](https://platejs.org/docs)
5. Menyusun kuis dengan daftar pertanyaan berurutan, opsi, dan keterangan jawaban benar.
6. Menelusuri daftar setiap entitas, melakukan pencarian/penyaringan berdasarkan judul atau slug.
7. Mengunggah aset (gambar thumbnail, gambar dalam konten) langsung ke Convex storage dan mengaitkannya dengan konten.
8. Menyimpan perubahan dan melihat update langsung di data Convex tanpa jeda.

## 6. Kebutuhan Fungsional

### 6.1 Topik

- Tabel daftar menampilkan judul, slug, waktu dibuat/diupdate.
- Form create/edit: judul, slug (auto dari judul dengan opsi edit), deskripsi, ikon (emoji/text), pemilih warna (HEX).
- Penghapusan dengan konfirmasi dan peringatan jika sedang dipakai kursus.

### 6.2 Kursus

- Daftar dengan filter tingkat kesulitan, topik, status featured.
- Form create/edit terbagi menjadi:
  - **Informasi Utama:** judul, slug, deskripsi (textarea), tingkat kesulitan (radio), featured, readonly.
  - **Media:** upload thumbnail ke Convex storage (preview), trailer URL (validasi http/https).
  - **Taksonomi:** multi-select topik, daftar bab dengan drag & drop.
  - **Outcome:** list learningOutcome yang dapat diubah urutan.
  - **Resources:** tabel dinamis label + URL.
- Aksi inline untuk menambah bab baru dari editor kursus.

### 6.3 Bab (Chapters)

- Dapat diakses dari kursus maupun daftar mandiri.
- Field: judul, slug, deskripsi, posisi opsional.
- UI urutan konten: drag & drop elemen pelajaran/kuis dengan badge tipe.

### 6.4 Pelajaran (Lessons)

- Daftar dengan filter kursus/bab.
- Field: judul, slug, pemilih kursus & bab.
- Editor Plate UI dengan blok: paragraf, heading, list, code block, callout, image (upload Convex), table.
- Field URL video opsional.

### 6.5 Kuis

- Daftar dengan filter kursus/bab dan indikator maxAttempt.
- Field: judul, slug, deskripsi, maxAttempt (angka opsional).
- Builder pertanyaan: list berurutan berisi teks pertanyaan, opsi (2–6 item), indikator jawaban benar (radio), penjelasan opsional.

### 6.6 Syarat Umum

- Setiap form menampilkan createdAt/updatedAt (read-only).
- Validasi sinkron sebelum penyimpanan, error inline.
- Penghapusan memakai modal konfirmasi + warning dependensi.
- Toast sukses setelah operasi berhasil.
- Semua upload aset menggunakan endpoint Convex storage, menampilkan progres, dan menyimpan referensi URL/id ke tabel terkait.

## 7. Arsitektur Informasi & Navigasi

- Sidebar kiri dengan menu: Topik, Kursus, Bab, Pelajaran, Kuis, Aset.
- Setiap menu menuju tabel list (misal React Table) dengan tombol “Tambah”.
- Form edit/baru berada di route `/admin/{entitas}/{id}` atau `/admin/{entitas}/new`.
- Breadcrumb menampilkan hirarki (contoh: Kursus › React Fundamentals › Bab › Pendahuluan).
- Halaman Aset menampilkan library file yang tersimpan di Convex storage (nama file, ukuran, tanggal unggah) dengan opsi upload baru dan hapus.

## 8. Layer Data & Integrasi

- Semua fungsi admin (query, mutation, action) ditempatkan di `convex/admin/<entitas>/{queries,mutations,actions}.ts` untuk menjaga boundary dengan fungsi publik.
- Gunakan query/mutation Convex terhadap tabel schema terbaru (topics, courses, chapters, lessons, quizzes, assets).
- Optimistic update untuk operasi ringan; sisanya pakai `refetch`.
- Slug generator bersama agar konsisten lintas entitas.
- Pencarian sederhana memanfaatkan index Convex (`by_slug`, `by_course`, dll.).
- Upload file memanfaatkan Convex storage dan menyimpan metadata (nama file, ukuran, mime, URL akses) di tabel `assets` (perlu ditambahkan pada implementasi).

## 9. Pedoman UI/UX

- Layout Tailwind mengikuti gaya dashboard yang ada.
- Form dipilah per section card; tombol aksi utama (“Simpan”, “Batal”) sticky di bawah layar.
- Plate UI dikonfigurasi dengan toolbar blok/mark standar, upload gambar via dialog yang memanfaatkan storage Convex (tanpa autosave).
- Drag & drop memakai utilitas internal atau `@dnd-kit` untuk reorder.
- Komponen warna & ikon sederhana (input type=color + field teks).
- Halaman aset menampilkan grid/list dengan preview kecil jika gambar.

## 10. Pertimbangan Teknis

- Proteksi route dengan guard admin: periksa `user.role` di tabel Convex `users` dan validasi silang dengan `public_metadata.role` dari Clerk sebelum memberi akses.
- Reuse komponen form bersama (floating-input, dialog, dsb.).
- Buat hook modular per entitas (`useTopicsAdmin`, `useAssetsAdmin`, dll.) untuk abstraksi Convex.
- Konfigurasi Plate UI agar konten yang disimpan kompatibel dengan renderer PortableText pengganti (atau migrasi renderer ke Plate JSON).
- Pastikan limit ukuran file & tipe MIME di Convex storage sesuai kebutuhan (misal 5MB gambar, mp4 kecil).

## 11. Milestone & Deliverable

1. **Minggu 1 (21–27 Okt 2025):** Scaffold route + layout, CRUD Topik & Kursus, integrasi upload thumbnail ke Convex storage.
2. **Minggu 2 (28 Okt–3 Nov 2025):** CRUD Bab & Pelajaran, integrasi Plate UI + upload gambar dalam konten.
3. **Minggu 3 (4–8 Nov 2025):** Builder Kuis, halaman Aset, validasi lintas entitas, QA & hardening.

## 12. Pertanyaan Terbuka

- Batas quota storage per aset dan kebijakan penghapusan? (misal soft delete vs hard delete)
- Perlu role tambahan sebelum membuka akses ke kontributor eksternal?
- Dukungan multi-bahasa konten (apakah perlu field duplicate untuk bahasa lain?).

## 13. Kriteria Penerimaan

- Admin dapat CRUD semua entitas dan perubahan langsung tercermin di Convex tanpa error.
- Editor pelajaran menggunakan Plate UI, dapat mengunggah gambar ke Convex storage, dan konten tampil benar di frontend.
- Checklist QA lulus (validasi form, navigasi, integritas relasi antar entitas, upload/hapus aset).
