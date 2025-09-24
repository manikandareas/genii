import { Check } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";

export default function PricingSection() {
  return (
    <section className="mx-auto max-w-5xl py-16 md:py-32" id="pricing">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <motion.h2
            className="text-balance font-semibold text-3xl text-foreground md:text-5xl"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
          >
            <span className="text-muted-foreground">Harga yang Bikin Kamu</span>{" "}
            Tenang Belajar
          </motion.h2>
        </div>
        <p className="mx-auto mt-8 max-w-[30rem] text-balance text-center text-base text-muted-foreground leading-snug tracking-wide sm:text-lg">
          Mulai gratis dulu, upgrade kalau udah siap. Nggak ada plan rumit, cuma
          belajar yang berkembang bareng kamu.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:mt-20 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-medium">Gratis</CardTitle>
            <span className="my-3 block font-semibold text-2xl">
              Rp 0 / bulan
            </span>
            <CardDescription className="text-sm">
              Buat yang mau coba-coba dulu
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <hr className="border-dashed" />

            <ul className="list-outside space-y-3 text-sm">
              {[
                "AI Tutor dasar (24/7 siap bantu)",
                "Tes kemampuan & jalur belajar",
                "Dukungan komunitas",
                "Materi course essential",
                "Tracking progress",
              ].map((item, index) => (
                <li className="flex items-center gap-2" key={index.toString()}>
                  <Check className="size-3" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="mt-auto">
            <Button asChild className="w-full" variant="outline">
              <Link href="">Mulai Gratis</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative">
          <span className="-top-3 absolute inset-x-0 mx-auto flex h-6 w-fit items-center rounded-full bg-linear-to-br/increasing from-purple-400 to-amber-300 px-3 py-1 font-medium text-amber-950 text-xs ring-1 ring-white/20 ring-inset ring-offset-1 ring-offset-gray-950/5">
            Akses Awal Beta
          </span>

          <div className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Premium Beta</CardTitle>
              <span className="my-3 block font-semibold text-2xl">
                Rp 299.000 / bulan
              </span>
              <CardDescription className="text-sm">
                Pengalaman lengkap buat yang serius
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />
              <ul className="mb-6 list-outside space-y-3 text-sm">
                {[
                  "Semua fitur plan Gratis",
                  "AI Tutor canggih (unlimited chat)",
                  "Project praktek unlimited",
                  "Support prioritas",
                  "Sertifikat & achievement",
                  "Sesi mentoring karir",
                  "Insight job market Indonesia",
                  "Review portfolio personal",
                  "Akses fitur beta terbaru",
                  "Feedback langsung dari mentor",
                ].map((item, index) => (
                  <li
                    className="flex items-center gap-2"
                    key={index.toString()}
                  >
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button asChild className="w-full">
                <Link href="">Daftar Beta Sekarang</Link>
              </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    </section>
  );
}
