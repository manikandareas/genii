import { AppFooter } from "@/features/landing/components/footer-section";
import { AppNavbar } from "@/features/landing/components/navbar";
import WelcomeBanner from "@/features/landing/components/welcome-banner";
import type React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <WelcomeBanner />
      <AppNavbar />
      {children}
      <AppFooter />
    </div>
  );
}
