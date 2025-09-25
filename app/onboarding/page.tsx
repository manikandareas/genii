import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import OnboardingFlow from "@/features/user/onboarding/components/onboarding-flow";
import { Metadata } from "next";
import { ONBOARDING_COPY } from "@/features/user/onboarding/constants/onboarding-copy";

export const metadata: Metadata = {
  title: ONBOARDING_COPY.meta.title,
  description: ONBOARDING_COPY.meta.description,
};

export default async function OnboardingPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) return redirect("/");

  if (clerkUser.publicMetadata?.onboardingStatus === "completed") {
    return redirect("/courses");
  }

  return <OnboardingFlow />;
}
