import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan ketentuan penggunaan platform Genii - Ketahui hak dan kewajiban Anda sebagai pengguna platform pembelajaran AI kami.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="font-bold text-4xl tracking-tight">
            Syarat & Ketentuan
          </h1>
          <p className="text-muted-foreground">
            Terakhir diperbarui: 2 Oktober 2025
          </p>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <section className="space-y-4">
            <h2 className="font-bold text-2xl">1. Penerimaan Ketentuan</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dengan mengakses dan menggunakan platform Genii, Anda menyetujui
              untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak
              setuju dengan bagian mana pun dari ketentuan ini, Anda tidak
              diperkenankan untuk menggunakan layanan kami.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">2. Penggunaan Layanan</h2>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">2.1 Akun Pengguna</h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata
                  sandi Anda
                </li>
                <li>
                  Anda harus berusia minimal 13 tahun untuk menggunakan layanan
                  ini
                </li>
                <li>
                  Satu akun hanya boleh digunakan oleh satu orang dan tidak
                  boleh dibagikan
                </li>
                <li>
                  Anda bertanggung jawab atas semua aktivitas yang terjadi di
                  bawah akun Anda
                </li>
              </ul>

              <h3 className="font-semibold text-lg">2.2 Konten Pembelajaran</h3>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  Semua materi pembelajaran disediakan untuk penggunaan pribadi
                  dan non-komersial
                </li>
                <li>
                  Dilarang mendistribusikan, menjual, atau membagikan konten
                  tanpa izin tertulis
                </li>
                <li>
                  Anda tidak diperkenankan untuk merekam, mengunduh, atau
                  menyalin materi kecuali fitur tersebut disediakan
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">3. AI Companion & Tutor</h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                Layanan AI Companion dan AI Tutor kami menggunakan teknologi
                kecerdasan buatan untuk memberikan pengalaman pembelajaran yang
                dipersonalisasi:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Respons AI bersifat otomatis dan mungkin tidak selalu 100%
                  akurat
                </li>
                <li>
                  Kami tidak bertanggung jawab atas keputusan yang dibuat
                  berdasarkan saran AI
                </li>
                <li>
                  Interaksi Anda dengan AI dapat digunakan untuk meningkatkan
                  layanan kami
                </li>
                <li>
                  Dilarang menggunakan AI untuk tujuan yang melanggar hukum atau
                  tidak etis
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">4. Hak Kekayaan Intelektual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Semua konten, fitur, dan fungsi platform Genii (termasuk namun
              tidak terbatas pada teks, grafik, logo, ikon, gambar, klip audio,
              unduhan digital, kompilasi data, dan perangkat lunak) adalah milik
              eksklusif Genii dan dilindungi oleh hukum hak cipta internasional.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">5. Pembayaran & Langganan</h2>
            <div className="space-y-3 text-muted-foreground">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Harga dapat berubah sewaktu-waktu dengan pemberitahuan
                  sebelumnya
                </li>
                <li>
                  Pembayaran diproses melalui penyedia layanan pembayaran pihak
                  ketiga yang aman
                </li>
                <li>
                  Langganan akan diperpanjang secara otomatis kecuali dibatalkan
                  sebelum periode perpanjangan
                </li>
                <li>
                  Pengembalian dana akan diproses sesuai dengan kebijakan
                  pengembalian dana kami
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">6. Perilaku Pengguna</h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                Anda setuju untuk tidak melakukan hal-hal berikut:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Menggunakan layanan untuk tujuan ilegal atau tidak sah</li>
                <li>Mengganggu atau merusak keamanan platform</li>
                <li>
                  Menggunakan bot, scraper, atau alat otomatis lainnya tanpa
                  izin
                </li>
                <li>Mengunggah virus, malware, atau kode berbahaya lainnya</li>
                <li>
                  Melecehkan, mengancam, atau menyalahgunakan pengguna lain
                </li>
                <li>Menyamar sebagai orang lain atau entitas lain</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">7. Penghentian Layanan</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kami berhak untuk menangguhkan atau menghentikan akses Anda ke
              layanan kami kapan saja, tanpa pemberitahuan sebelumnya, jika kami
              yakin Anda telah melanggar syarat dan ketentuan ini atau terlibat
              dalam perilaku yang tidak pantas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">8. Batasan Tanggung Jawab</h2>
            <p className="text-muted-foreground leading-relaxed">
              Genii tidak bertanggung jawab atas kerugian langsung, tidak
              langsung, insidental, khusus, konsekuensial, atau hukuman yang
              timbul dari penggunaan atau ketidakmampuan menggunakan layanan
              kami, termasuk namun tidak terbatas pada kehilangan data, laba,
              atau peluang bisnis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">9. Perubahan Ketentuan</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kami berhak untuk memodifikasi atau mengganti syarat dan ketentuan
              ini kapan saja. Perubahan material akan diberitahukan melalui
              email atau pemberitahuan di platform. Penggunaan berkelanjutan
              Anda atas layanan setelah perubahan tersebut merupakan penerimaan
              Anda atas ketentuan yang direvisi.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">10. Hukum yang Berlaku</h2>
            <p className="text-muted-foreground leading-relaxed">
              Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan
              hukum Republik Indonesia. Setiap perselisihan yang timbul akan
              diselesaikan melalui pengadilan yang berwenang di Indonesia.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-2xl">11. Kontak</h2>
            <p className="text-muted-foreground leading-relaxed">
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini,
              silakan hubungi kami melalui:
            </p>
            <ul className="list-none space-y-2 text-muted-foreground">
              <li>Email: support@{process.env.NEXT_PUBLIC_APP_DOMAIN}</li>
              <li>
                Website:{" "}
                <Link href="/" className="text-primary hover:underline">
                  www.{process.env.NEXT_PUBLIC_APP_DOMAIN}
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
