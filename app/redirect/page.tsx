import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const { isAuthenticated } = await auth();
  const clerkUser = await currentUser();

  if (!isAuthenticated) return redirect("/");

  if (!clerkUser) return redirect("/");

  if (
    clerkUser.publicMetadata.role === "user" &&
    (!clerkUser.publicMetadata.onboardingStatus ||
      clerkUser.publicMetadata.onboardingStatus === "not_started")
  )
    return redirect("/onboarding");

  if (clerkUser.publicMetadata.role === "admin")
    return redirect("/admin/dashboard");

  return redirect("/courses");
}
