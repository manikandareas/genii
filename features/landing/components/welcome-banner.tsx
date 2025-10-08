"use client";
import {
  Banner,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "@/features/shared/components/ui/banner";
import { PartyPopper } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <div className="w-full bg-primary">
      <Banner className="mx-auto max-w-6xl">
        <BannerIcon icon={PartyPopper} />
        <BannerTitle>
          Hai! Selamat datang di <strong>Genii</strong> — tempat lo explore hal
          baru dan belajar dengan cara seru. Yuk, mulai sekarang!
        </BannerTitle>
        <BannerClose />
      </Banner>
    </div>
  );
}
