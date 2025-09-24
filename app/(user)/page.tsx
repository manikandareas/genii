import FeaturesSection from "@/features/landing/components/features-section";
import HeroSection from "@/features/landing/components/hero-section";
import IntegrationsSection from "@/features/landing/components/integration-section";
import { StatsSection } from "@/features/landing/components/stats-section";
import { TextRevealSection } from "@/features/landing/components/text-reveal-section";

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
