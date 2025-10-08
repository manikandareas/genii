import FeaturesSection from "@/features/landing/components/features-section";
import HeroSection from "@/features/landing/components/hero-section";
import IntegrationsSection from "@/features/landing/components/integration-section";
import { StatsSection } from "@/features/landing/components/stats-section";
import { TextRevealSection } from "@/features/landing/components/text-reveal-section";
import { constructMetadata } from "@/lib/seo.config";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Genii - Explore Hal Baru Jadi Seru",
  description:
    "Transform your learning experience with Genii, an AI-powered educational platform that provides personalized courses, interactive lessons, and intelligent tutoring to help you master any subject.",
});

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TextRevealSection />
      <IntegrationsSection />
    </main>
  );
}
