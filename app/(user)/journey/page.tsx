import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { JourneyView } from "@/features/user/onboarding/components/journey-view";

export const metadata: Metadata = {
  title: "Journey Rekomendasi Kursus",
  description:
    "Lihat kembali rekomendasi kursus personal yang telah disusun oleh Genii AI berdasarkan minat dan tujuan belajar Anda.",
};

export default async function JourneyPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/");
  }

  if (clerkUser.publicMetadata?.role === "admin") {
    redirect("/admin/dashboard");
  }

  // Redirect to onboarding if user hasn't completed it yet
  if (
    !clerkUser.publicMetadata?.onboardingStatus ||
    clerkUser.publicMetadata.onboardingStatus !== "completed"
  ) {
    redirect("/onboarding");
  }

  return <JourneyView showSkipButton={false} />;
}
