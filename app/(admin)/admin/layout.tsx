import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = await currentUser();

  if (!clerkUser) return redirect("/");

  if (clerkUser.publicMetadata.role !== "admin") return redirect("/");

  return <div>{children}</div>;
}
