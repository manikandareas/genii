import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Target,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedGroup } from "@/features/shared/components/ui/animated-group";
import { Button } from "@/features/shared/components/ui/button";
import { TextEffect } from "@/features/shared/components/ui/text-effect";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <main className="overflow-hidden">
      {/* Indigo Cosmos Background with Top Glow */}
      <section>
        <div className="relative pt-24">
          <div className="-z-10 absolute inset-0 size-full bg-background" />
          <div className="mx-auto max-w-5xl px-6">
            <div className="sm:mx-auto lg:mt-0 lg:mr-auto">
              <TextEffect
                as="h1"
                className="mt-8 max-w-2xl font-medium text-5xl md:text-6xl lg:mt-16"
                preset="fade-in-blur"
                speedSegment={0.3}
              >
                Belajar Coding Jadi Gampang dengan Genii
              </TextEffect>
              <TextEffect
                as="p"
                className="mt-8 max-w-2xl text-pretty text-gray-200 text-lg"
                delay={0.5}
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
              >
                Susah cari mentor coding? Bingung mulai dari mana? Genii hadir
                dengan AI tutor yang siap bantu kamu 24/7. Jalur belajar yang
                disesuaikan sama goals kamu, plus praktek langsung buat
                portfolio.
              </TextEffect>

              <div className=" mt-12 max-w-md">
                <AnimatedGroup
                  className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                >
                  <div
                    className="rounded-[calc(var(--radius-xl)+0.125rem)] border bg-foreground/10 p-0.5"
                    key={1}
                  >
                    <SignedOut>
                      <SignInButton
                        fallbackRedirectUrl="/courses"
                        mode="modal"
                        signUpFallbackRedirectUrl="/onboarding"
                      >
                        <Button
                          asChild
                          className="rounded-xl px-8 text-base"
                          size="lg"
                        >
                          <span className="text-nowrap">Mulai Gratis</span>
                        </Button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <Button
                        asChild
                        className="rounded-xl px-8 text-base"
                        size="lg"
                      >
                        <Link href={"/courses"}>
                          <span className="text-nowrap">Explore Kursus</span>
                        </Link>
                      </Button>
                    </SignedIn>
                  </div>
                  {/* <div className="flex gap-2"> */}
                  {/* <Button
                      asChild
                      className="h-10.5 rounded-xl px-5 text-base"
                      key={2}
                      size="lg"
                      variant="ghost"
                    >
                      <Link to="#link">
                        <span className="text-nowrap">
                          Tes Kemampuan 2 Menit
                        </span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="h-10.5 rounded-xl px-5 text-base"
                      key={3}
                      size="lg"
                      variant="ghost"
                    >
                      <Link to="#link">
                        <span className="text-nowrap">Coba AI Tutor</span>
                      </Link>
                    </Button> */}
                  {/* </div> */}
                </AnimatedGroup>
              </div>
            </div>
          </div>
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.75,
                  },
                },
              },
              ...transitionVariants,
            }}
          >
            <div className="-mr-56 relative mt-8 overflow-hidden px-2 sm:mt-12 sm:mr-0 md:mt-20">
              <div
                aria-hidden
                className="absolute inset-0 z-10 bg-linear-to-b from-35% from-transparent to-background"
              />
              <div className="relative inset-shadow-2xs mx-auto max-w-5xl overflow-hidden rounded-2xl border bg-background p-4 shadow-lg shadow-zinc-950/15 ring-1 ring-background dark:inset-shadow-white/20">
                <Image
                  alt="Platform Belajar AI Genii"
                  className="relative aspect-15/8 rounded-2xl bg-background"
                  height="1440"
                  src="/og-image.png"
                  width="2700"
                />
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              Kenapa Belajar di Genii Beda?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-200 text-lg">
              Empat pilar utama yang bikin kamu belajar coding lebih cepat dan
              efektif—khusus untuk kamu yang pengen kerja di tech Indonesia
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-medium text-xl">AI Tutor 24/7</h3>
              <p className="text-gray-200 text-sm">
                Stuck di materi? Tanya aja ke AI tutor yang siap jawab kapan
                aja. Nggak perlu tunggu mentor online!
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-medium text-xl">Jalur Personal</h3>
              <p className="text-gray-200 text-sm">
                Goals kamu beda? Schedule padat? Tenang, jalur belajar bakal
                disesuaikan sama kebutuhan dan progres kamu.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-medium text-xl">Praktek Langsung</h3>
              <p className="text-gray-200 text-sm">
                Bukan cuma teori! Bikin project nyata, dapet feedback instant,
                dan portfolio yang siap buat apply kerja.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-medium text-xl">Progress Tracking</h3>
              <p className="text-gray-200 text-sm">
                Liat perkembangan kamu real-time. Streak belajar, achievement,
                sampe sertifikat yang bisa dipake buat lamar kerja.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background pt-16 pb-16 md:pb-32" id="partners">
        <div className="group relative m-auto max-w-5xl px-6">
          <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
            <Link
              className="block text-sm duration-150 hover:opacity-75"
              href="/"
            >
              <span>
                Dipercaya ribuan learner dan didukung perusahaan tech terkemuka:
              </span>

              <ChevronRight className="ml-1 inline-block size-3" />
            </Link>
          </div>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 group-hover:blur-xs sm:gap-x-16 sm:gap-y-14">
            <div className="flex">
              <img
                alt="Nvidia Logo"
                className="mx-auto h-5 w-fit dark:invert"
                height="20"
                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                width="auto"
              />
            </div>

            <div className="flex">
              <img
                alt="Column Logo"
                className="mx-auto h-4 w-fit dark:invert"
                height="16"
                src="https://html.tailus.io/blocks/customers/column.svg"
                width="auto"
              />
            </div>
            <div className="flex">
              <img
                alt="GitHub Logo"
                className="mx-auto h-4 w-fit dark:invert"
                height="16"
                src="https://html.tailus.io/blocks/customers/github.svg"
                width="auto"
              />
            </div>
            <div className="flex">
              <img
                alt="Nike Logo"
                className="mx-auto h-5 w-fit dark:invert"
                height="20"
                src="https://html.tailus.io/blocks/customers/nike.svg"
                width="auto"
              />
            </div>
            <div className="flex">
              <img
                alt="Lemon Squeezy Logo"
                className="mx-auto h-5 w-fit dark:invert"
                height="20"
                src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                width="auto"
              />
            </div>
            <div className="flex">
              <img
                alt="Laravel Logo"
                className="mx-auto h-4 w-fit dark:invert"
                height="16"
                src="https://html.tailus.io/blocks/customers/laravel.svg"
                width="auto"
              />
            </div>
            <div className="flex">
              <img
                alt="Lilly Logo"
                className="mx-auto h-7 w-fit dark:invert"
                height="28"
                src="https://html.tailus.io/blocks/customers/lilly.svg"
                width="auto"
              />
            </div>

            <div className="flex">
              <img
                alt="OpenAI Logo"
                className="mx-auto h-6 w-fit dark:invert"
                height="24"
                src="https://html.tailus.io/blocks/customers/openai.svg"
                width="auto"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
