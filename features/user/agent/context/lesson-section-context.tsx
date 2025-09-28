"use client";

import { createContext, type ReactNode, useContext } from "react";

export type LessonSectionMetadata = {
  lessonId?: string;
  sections: Record<
    string,
    {
      title: string;
      content?: string;
      level: number;
    }
  >;
};

const LessonSectionContext = createContext<LessonSectionMetadata | null>(null);

export function LessonSectionProvider({
  value,
  children,
}: {
  value: LessonSectionMetadata;
  children: ReactNode;
}) {
  return (
    <LessonSectionContext.Provider value={value}>
      {children}
    </LessonSectionContext.Provider>
  );
}

export function useLessonSectionMetadata() {
  return useContext(LessonSectionContext);
}
