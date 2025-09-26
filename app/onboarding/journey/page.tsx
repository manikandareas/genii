import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { JourneyView } from "@/features/user/onboarding/components/journey-view";

export const metadata: Metadata = {
  title: "Journey rekomendasi kursus",
  description:
    "Pantau bagaimana Genii menyusun rekomendasi belajar personal dan lihat kursus prioritas untuk kamu.",
};

export default async function UserJourneyPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/");
  }

  if (clerkUser.publicMetadata?.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (
    !clerkUser.publicMetadata?.onboardingStatus ||
    clerkUser.publicMetadata.onboardingStatus !== "completed"
  ) {
    redirect("/onboarding");
  }

  return <JourneyView />;
}
