import type { ReactNode } from "react";

import ContentLayoutClient from "./content-layout-client";

interface ContentLayoutProps {
  children: ReactNode;
  params: Promise<{
    courseSlug: string;
  }>;
}

export default async function ContentLayout({
  children,
  params,
}: ContentLayoutProps) {
  const paramsData = await params;

  return (
    <ContentLayoutClient courseSlug={paramsData.courseSlug}>
      {children}
    </ContentLayoutClient>
  );
}
