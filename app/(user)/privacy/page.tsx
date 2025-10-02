import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi Genii - Pelajari bagaimana kami melindungi data pribadi Anda, menggunakan informasi, dan menjaga keamanan saat menggunakan platform pembelajaran AI kami.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="font-bold text-4xl tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-muted-foreground">
            Terakhir diperbarui: 2 Oktober 2025
          </p>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <section className="space-y-4">
            <h2 className="font-bold text-2xl">1. Pendahuluan</h2>
            <p className="text-muted-foreground leading-relaxed">
              Genii (&quot; kami&quot;,&quot; kita&quot;,&quot; milik
              kami&quot;) berkomitmen untuk melindungi privasi Anda. Kebijakan
              Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
              mengungkapkan, dan melindungi informasi Anda ketika Anda
              menggunakan platform pembelajaran kami.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">
              2. Informasi yang Kami Kumpulkan
            </h2>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                2.1 Informasi yang Anda Berikan
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong>Informasi Akun:</strong> Nama, alamat email, kata
                  sandi, foto profil
                </li>
                <li>
                  <strong>Informasi Profil:</strong> Preferensi pembelajaran,
                  tujuan belajar, tingkat keahlian
                </li>
                <li>
                  <strong>Informasi Pembayaran:</strong> Data kartu kredit atau
                  metode pembayaran lainnya (diproses oleh penyedia pembayaran
                  pihak ketiga)
                </li>
                <li>
                  <strong>Komunikasi:</strong> Pesan yang Anda kirim kepada kami
                  atau melalui platform
                </li>
              </ul>

              <h3 className="font-semibold text-lg">
                2.2 Informasi yang Dikumpulkan Secara Otomatis
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong>Data Penggunaan:</strong> Halaman yang dikunjungi,
                  waktu yang dihabiskan, course yang diambil, progress
                  pembelajaran
                </li>
                <li>
                  <strong>Data Perangkat:</strong> Jenis perangkat, sistem
                  operasi, browser, alamat IP
                </li>
                <li>
                  <strong>Cookies & Teknologi Pelacakan:</strong> Kami
                  menggunakan cookies untuk meningkatkan pengalaman Anda
                </li>
                <li>
                  <strong>Interaksi AI:</strong> Percakapan dengan AI Companion
                  dan AI Tutor untuk personalisasi dan peningkatan layanan
                </li>
              </ul>

              <h3 className="font-semibold text-lg">
                2.3 Informasi dari Pihak Ketiga
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  Informasi dari layanan autentikasi pihak ketiga (Google,
                  GitHub, dll.)
                </li>
                <li>Data analitik dari penyedia layanan analitik</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">
              3. Bagaimana Kami Menggunakan Informasi Anda
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                Kami menggunakan informasi yang dikumpulkan untuk:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Menyediakan, mengoperasikan, dan memelihara platform kami
                </li>
                <li>
                  Mempersonalisasi pengalaman pembelajaran Anda dengan AI
                  Companion
                </li>
                <li>Memproses transaksi dan mengelola langganan Anda</li>
                <li>
                  Mengirimkan pembaruan, newsletter, dan materi promosi (dengan
                  persetujuan Anda)
                </li>
                <li>
                  Meningkatkan dan mengoptimalkan platform kami melalui analisis
                  data
                </li>
                <li>
                  Mendeteksi, mencegah, dan mengatasi masalah teknis atau
                  keamanan
                </li>
                <li>
                  Mematuhi kewajiban hukum dan menegakkan syarat layanan kami
                </li>
                <li>
                  Mengembangkan fitur baru dan meningkatkan algoritma AI kami
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">4. Berbagi Informasi</h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                Kami tidak menjual informasi pribadi Anda. Kami dapat membagikan
                informasi Anda dengan:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Penyedia Layanan:</strong> Pihak ketiga yang membantu
                  kami mengoperasikan platform (hosting, pembayaran, analitik,
                  email)
                </li>
                <li>
                  <strong>Partner Bisnis:</strong> Dengan persetujuan Anda untuk
                  program atau fitur tertentu
                </li>
                <li>
                  <strong>Kepatuhan Hukum:</strong> Ketika diwajibkan oleh hukum
                  atau untuk melindungi hak kami
                </li>
                <li>
                  <strong>Transfer Bisnis:</strong> Dalam hal merger, akuisisi,
                  atau penjualan aset
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">5. Keamanan Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi
              yang sesuai untuk melindungi informasi pribadi Anda, termasuk:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Enkripsi data saat transit dan saat disimpan (SSL/TLS)</li>
              <li>Kontrol akses yang ketat dan autentikasi multi-faktor</li>
              <li>Pemantauan keamanan dan audit rutin</li>
              <li>Penyimpanan data di server yang aman</li>
              <li>Pelatihan keamanan untuk karyawan</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Namun, tidak ada metode transmisi melalui internet atau
              penyimpanan elektronik yang 100% aman. Kami tidak dapat menjamin
              keamanan absolut.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">6. Hak Privasi Anda</h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">Anda memiliki hak untuk:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Akses:</strong> Meminta salinan informasi pribadi yang
                  kami miliki tentang Anda
                </li>
                <li>
                  <strong>Koreksi:</strong> Memperbarui atau memperbaiki
                  informasi yang tidak akurat
                </li>
                <li>
                  <strong>Penghapusan:</strong> Meminta penghapusan informasi
                  pribadi Anda
                </li>
                <li>
                  <strong>Portabilitas:</strong> Menerima data Anda dalam format
                  yang dapat dibaca mesin
                </li>
                <li>
                  <strong>Keberatan:</strong> Menolak pemrosesan tertentu atas
                  informasi Anda
                </li>
                <li>
                  <strong>Penarikan Persetujuan:</strong> Menarik persetujuan
                  kapan saja (tidak mempengaruhi pemrosesan sebelumnya)
                </li>
              </ul>
              <p className="leading-relaxed">
                Untuk menggunakan hak-hak ini, silakan hubungi kami di
                privacy@genii.id
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">
              7. Cookies & Teknologi Pelacakan
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                Kami menggunakan cookies dan teknologi serupa untuk:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Cookies Esensial:</strong> Diperlukan untuk fungsi
                  dasar platform
                </li>
                <li>
                  <strong>Cookies Performa:</strong> Menganalisis bagaimana
                  pengguna berinteraksi dengan platform
                </li>
                <li>
                  <strong>Cookies Fungsional:</strong> Mengingat preferensi dan
                  pengaturan Anda
                </li>
                <li>
                  <strong>Cookies Pemasaran:</strong> Menampilkan iklan yang
                  relevan (dengan persetujuan)
                </li>
              </ul>
              <p className="leading-relaxed">
                Anda dapat mengontrol cookies melalui pengaturan browser Anda,
                tetapi menonaktifkan cookies tertentu dapat mempengaruhi
                fungsionalitas platform.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">
              8. Privasi AI & Machine Learning
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                Terkait penggunaan AI Companion dan AI Tutor:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Percakapan Anda digunakan untuk meningkatkan model AI dan
                  personalisasi
                </li>
                <li>
                  Data diproses secara anonim dan diagregasi untuk pelatihan
                  model
                </li>
                <li>
                  Anda dapat meminta penghapusan riwayat percakapan AI Anda
                </li>
                <li>
                  Kami tidak membagikan percakapan individual Anda dengan pihak
                  ketiga tanpa persetujuan
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">9. Retensi Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kami menyimpan informasi pribadi Anda selama akun Anda aktif atau
              selama diperlukan untuk menyediakan layanan. Setelah penghapusan
              akun, kami akan menghapus atau mengaonimkan informasi Anda dalam
              waktu 90 hari, kecuali diwajibkan oleh hukum untuk menyimpannya
              lebih lama.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">10. Privasi Anak-Anak</h2>
            <p className="text-muted-foreground leading-relaxed">
              Platform kami tidak ditujukan untuk anak-anak di bawah 13 tahun.
              Kami tidak secara sengaja mengumpulkan informasi pribadi dari
              anak-anak di bawah 13 tahun. Jika Anda adalah orang tua atau wali
              dan mengetahui bahwa anak Anda telah memberikan informasi pribadi
              kepada kami, silakan hubungi kami.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">
              11. Transfer Data Internasional
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Informasi Anda dapat ditransfer ke dan dipelihara di server yang
              berlokasi di luar negara Anda, di mana undang-undang perlindungan
              data mungkin berbeda. Dengan menggunakan layanan kami, Anda
              menyetujui transfer tersebut.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">
              12. Perubahan Kebijakan Privasi
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
              Kami akan memberi tahu Anda tentang perubahan material melalui
              email atau pemberitahuan di platform. Tanggal &quot;Terakhir
              diperbarui&quot; di bagian atas kebijakan ini menunjukkan kapan
              terakhir kali direvisi.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">13. Kontak</h2>
            <p className="text-muted-foreground leading-relaxed">
              Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan
              terkait Kebijakan Privasi ini atau praktik data kami, silakan
              hubungi kami:
            </p>
            <ul className="list-none space-y-2 text-muted-foreground">
              <li>
                <strong>Email:</strong> privacy@
                {process.env.NEXT_PUBLIC_APP_DOMAIN}
              </li>
              <li>
                <strong>Support:</strong> support@
                {process.env.NEXT_PUBLIC_APP_DOMAIN}
              </li>
              <li>
                <strong>Website:</strong>{" "}
                <Link
                  href={`https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`}
                  className="text-primary hover:underline"
                >
                  www.{process.env.NEXT_PUBLIC_APP_DOMAIN}
                </Link>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">14. Persetujuan</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dengan menggunakan platform Genii, Anda menyatakan bahwa Anda
              telah membaca, memahami, dan menyetujui Kebijakan Privasi ini.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
