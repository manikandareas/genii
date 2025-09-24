import type React from "react";
import { Footer2 } from "@/features/landing/components/footer-section";
import { Navbar } from "@/features/landing/components/navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      {children}
      <Footer2 />
    </div>
  );
}
