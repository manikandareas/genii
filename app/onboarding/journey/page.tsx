import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { JourneyView } from "@/features/user/onboarding/components/journey-view";

export const metadata: Metadata = {
  title: "Journey Rekomendasi Kursus",
  description:
    "Pantau bagaimana Genii AI menyusun rekomendasi belajar personal berdasarkan minat dan tujuan Anda. Lihat kursus prioritas yang dirancang khusus untuk perjalanan pembelajaran Anda.",
  robots: {
    index: false,
    follow: false,
  },
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
