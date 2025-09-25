import { Footer2 } from "@/features/landing/components/footer-section";
import { Navbar } from "@/features/landing/components/navbar";
import type React from "react";

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
