import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import ProfileView from "@/features/user/profile/components/profile-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Lihat preferensi belajar, riwayat kursus, dan progres pembelajaran Anda.",
};

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/");
  }

  if (clerkUser.publicMetadata?.role === "admin") {
    redirect("/admin/dashboard");
  }

  return <ProfileView />;
}
