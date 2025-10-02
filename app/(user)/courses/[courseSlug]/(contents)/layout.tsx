import type { ReactNode } from "react";

import ContentLayoutClient from "./content-layout-client";
import { SectionAskProvider } from "@/features/user/agent/context/ask-context";

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
    <SectionAskProvider>
      <ContentLayoutClient courseSlug={paramsData.courseSlug}>
        {children}
      </ContentLayoutClient>
    </SectionAskProvider>
  );
}
