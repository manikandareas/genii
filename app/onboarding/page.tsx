import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import OnboardingFlow from "@/features/user/onboarding/components/onboarding-flow";

export default async function OnboardingPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) return redirect("/");

  if (clerkUser.publicMetadata?.onboardingStatus === "completed") {
    return redirect("/courses");
  }

  return <OnboardingFlow />;
}
