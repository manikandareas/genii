import { Bot } from "lucide-react";
import Link from "next/link";
import {
  Gemini,
  GooglePaLM,
  MagicUI,
  MediaWiki,
  Replit,
  VSCodium,
} from "@/features/shared/components/logos";
import { Button } from "@/features/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { InfiniteSlider } from "./infinite-slider";

export default function IntegrationsSection() {
  return (
    <section className="mt-0">
      <div className="bg-muted py-24 md:py-32 dark:bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="group relative mx-auto max-w-[22rem] items-center justify-between space-y-6 bg-muted/25 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] sm:max-w-md">
            <div
              className="-z-10 absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"
              role="presentation"
            />
            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10}>
                <IntegrationCard>
                  <VSCodium />
                </IntegrationCard>
                <IntegrationCard>
                  <MediaWiki />
                </IntegrationCard>
                <IntegrationCard>
                  <GooglePaLM />
                </IntegrationCard>
                <IntegrationCard>
                  <Gemini />
                </IntegrationCard>
                <IntegrationCard>
                  <Replit />
                </IntegrationCard>
                <IntegrationCard>
                  <MagicUI />
                </IntegrationCard>
              </InfiniteSlider>
            </div>

            <div>
              <InfiniteSlider gap={24} reverse speed={20} speedOnHover={10}>
                <IntegrationCard>
                  <Gemini />
                </IntegrationCard>
                <IntegrationCard>
                  <Replit />
                </IntegrationCard>
                <IntegrationCard>
                  <MediaWiki />
                </IntegrationCard>
                <IntegrationCard>
                  <MagicUI />
                </IntegrationCard>
                <IntegrationCard>
                  <VSCodium />
                </IntegrationCard>
                <IntegrationCard>
                  <GooglePaLM />
                </IntegrationCard>
              </InfiniteSlider>
            </div>
            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10}>
                <IntegrationCard>
                  <Replit />
                </IntegrationCard>
                <IntegrationCard>
                  <MagicUI />
                </IntegrationCard>
                <IntegrationCard>
                  <Gemini />
                </IntegrationCard>
                <IntegrationCard>
                  <VSCodium />
                </IntegrationCard>
                <IntegrationCard>
                  <MediaWiki />
                </IntegrationCard>
                <IntegrationCard>
                  <GooglePaLM />
                </IntegrationCard>
              </InfiniteSlider>
            </div>
            <div className="absolute inset-0 m-auto flex size-fit justify-center gap-2">
              <IntegrationCard
                className="size-16 bg-white/5 shadow-black-950/10 shadow-xl backdrop-blur-md backdrop-grayscale dark:border-white/10 dark:shadow-white/15"
                isCenter={true}
              >
                <Bot className="size-8 text-foreground" />
              </IntegrationCard>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
            <h2 className="text-balance font-semibold text-3xl md:text-4xl">
              Belajar dengan Tools AI dan Platform Pro
            </h2>
            <p className="text-muted-foreground">
              Kuasai skill tech bareng AI companion kamu, terintegrasi dengan
              tools development standar industri yang dipake developer
              profesional.
            </p>

            <Button asChild size="sm" variant="outline">
              <Link href="#">Mulai Belajar di Genii</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  position?:
    | "left-top"
    | "left-middle"
    | "left-bottom"
    | "right-top"
    | "right-middle"
    | "right-bottom";
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative z-20 flex size-12 rounded-full border bg-background",
        className,
      )}
    >
      <div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>
        {children}
      </div>
    </div>
  );
};
