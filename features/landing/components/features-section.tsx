"use client";
import {
  Brain,
  Code,
  Database,
  Globe,
  MapPin,
  MessageCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/features/shared/components/ui/card";

export default function FeaturesSection() {
  return (
    <section id="features">
      <div className="py-24">
        <div className="mx-auto w-full max-w-3xl px-6">
          <motion.h2
            className="text-balance font-semibold text-3xl text-foreground md:text-4xl"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
          >
            <span className="text-muted-foreground">
              Belajar Tech Skill Bareng
            </span>{" "}
            Genii AI Partner Kamu
          </motion.h2>
          <div className="mt-12 grid gap-12 sm:grid-cols-2">
            {/* Feature 1 */}
            <div className="col-span-full space-y-4">
              <Card className="overflow-hidden px-6 sm:col-span-2">
                <motion.div
                  className="mask-b-from-75% -mt-2 mx-auto max-w-sm px-2 pt-8"
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                >
                  <AITutorIllustration />
                </motion.div>
              </Card>
              <div className="max-w-md sm:col-span-3">
                <motion.h3 className="font-semibold text-foreground text-lg">
                  AI Tutor di Setiap Pelajaran
                </motion.h3>
                <motion.p className="mt-3 text-balance text-muted-foreground">
                  Stuck di coding? Tanya langsung ke AI tutor yang siap bantu
                  24/7. Nggak perlu tunggu mentor online atau bingung sendiri!
                </motion.p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="grid grid-rows-[1fr_auto] space-y-4">
              <Card className="p-6">
                <motion.div
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                >
                  <PersonalizedPathsIllustration />
                </motion.div>
              </Card>
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  Jalur Belajar Personal
                </h3>
                <p className="mt-3 text-balance text-muted-foreground">
                  Goals kamu jadi frontend? Backend? Fullstack? Jalur belajar
                  akan disesuaikan sama target dan progres kamu.
                </p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="grid grid-rows-[1fr_auto] space-y-4">
              <Card className="overflow-hidden p-6">
                <motion.div
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                >
                  <PracticeProjectsIllustration />
                </motion.div>
              </Card>
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  Praktek & Project Nyata
                </h3>
                <p className="mt-3 text-balance text-muted-foreground">
                  Bukan cuma teori! Bikin project yang bisa kamu pake buat
                  portfolio, dengan konteks job market Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const AITutorIllustration = () => {
  return (
    <Card
      aria-hidden
      className="p-4 transition-transform duration-200 group-hover:translate-y-0"
    >
      {/* AI Tutor Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg border bg-foreground/5">
          <Brain className="size-4 text-foreground/60" />
        </div>
        <div>
          <div className="font-medium text-sm">AI Tutor Genii</div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <div className="size-1.5 rounded-full bg-green-500" />
            Siap Bantu 24/7
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="space-y-3 rounded-lg border bg-foreground/5 p-3">
        <div className="space-y-2">
          <div className="rounded-lg bg-foreground/10 p-2 text-xs">
            <div className="mb-1 text-muted-foreground">Kamu:</div>
            <div className="text-foreground/80">
              Gimana cara pake React hook ini?
            </div>
          </div>
          <div className="rounded-lg bg-foreground/20 p-2 text-xs">
            <div className="mb-1 flex items-center gap-1 text-muted-foreground">
              <Brain className="size-3" />
              AI Tutor:
            </div>
            <div className="text-foreground/80">
              Oke, aku jelasin useState step by step ya...
            </div>
          </div>
        </div>
      </div>

      {/* Quick Help Options */}
      <div className="mt-3 flex gap-2">
        <div className="flex items-center gap-1 rounded-full border bg-foreground/10 px-2 py-1 font-medium text-foreground/80 text-xs">
          <MessageCircle className="size-3" />
          Bantuan Instant
        </div>
        <div className="rounded-full border bg-foreground/10 px-2 py-1 font-medium text-foreground/80 text-xs">
          24/7 Online
        </div>
      </div>
    </Card>
  );
};

const PersonalizedPathsIllustration = () => {
  return (
    <Card aria-hidden className="p-4">
      {/* Goals Input */}
      <div className="mb-4 flex justify-center">
        <div className="flex size-10 items-center justify-center rounded-full border bg-foreground/10">
          <Target className="size-5 text-foreground/60" />
        </div>
      </div>

      {/* Path Status */}
      <div className="mb-4 text-center">
        <div className="font-medium text-sm">Jalur Belajar Kamu</div>
        <div className="mt-1 flex items-center justify-center gap-1 text-muted-foreground text-xs">
          <MapPin className="size-3" />
          Disesuaikan untuk Indonesia
        </div>
      </div>

      {/* Learning Modules */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex size-6 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/20">
            <div className="size-2 rounded-full bg-green-500" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-foreground/80 text-xs">
              Dasar Web Development
            </div>
            <div className="mt-1 h-1 rounded-full bg-foreground/10">
              <div className="h-full w-full rounded-full bg-green-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-6 items-center justify-center rounded-lg border bg-foreground/5">
            <div className="size-2 rounded-full bg-foreground/40" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-foreground/80 text-xs">
              Framework React
            </div>
            <div className="mt-1 h-1 rounded-full bg-foreground/10">
              <div className="h-full w-3/4 rounded-full bg-foreground/40" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-6 items-center justify-center rounded-lg border bg-foreground/5">
            <div className="size-2 rounded-full bg-foreground/20" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-foreground/80 text-xs">
              Project Portfolio
            </div>
            <div className="mt-1 h-1 rounded-full bg-foreground/10">
              <div className="h-full w-1/4 rounded-full bg-foreground/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Learning */}
      <div className="mt-4 text-center">
        <div className="text-muted-foreground text-xs">
          Menyesuaikan dengan progres kamu...
        </div>
      </div>
    </Card>
  );
};

const PracticeProjectsIllustration = () => {
  return (
    <div aria-hidden className="relative">
      {/* Main Project Hub */}
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-center">
          <div className="flex size-8 items-center justify-center rounded-full border bg-foreground/10">
            <Code className="size-4 text-foreground/60" />
          </div>
        </div>

        <div className="mb-4 text-center">
          <div className="font-medium text-sm">Praktek & Project</div>
          <div className="text-muted-foreground text-xs">Bikin yang Nyata</div>
        </div>

        {/* Project Types */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border bg-foreground/5 p-2 text-center">
            <Globe className="mx-auto mb-1 size-3 text-foreground/60" />
            <div className="font-medium text-muted-foreground text-xs">
              Web Apps
            </div>
          </div>
          <div className="rounded-lg border bg-foreground/5 p-2 text-center">
            <TrendingUp className="mx-auto mb-1 size-3 text-foreground/60" />
            <div className="font-medium text-muted-foreground text-xs">
              Dashboard
            </div>
          </div>
          <div className="rounded-lg border bg-foreground/5 p-2 text-center">
            <Database className="mx-auto mb-1 size-3 text-foreground/60" />
            <div className="font-medium text-muted-foreground text-xs">
              Database
            </div>
          </div>
          <div className="rounded-lg border bg-foreground/5 p-2 text-center">
            <MapPin className="mx-auto mb-1 size-3 text-foreground/60" />
            <div className="font-medium text-muted-foreground text-xs">
              Indonesia
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Indicator */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-px w-full bg-foreground/10" />
      </div>
    </div>
  );
};
