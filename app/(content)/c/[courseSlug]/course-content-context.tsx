'use client';

import React from "react";
import type { CourseContentData, CourseContentItem } from "./types";

type CourseContentContextValue = CourseContentData & {
  orderedContents: CourseContentItem[];
  getContentBySlug: (slug: string) => CourseContentItem | undefined;
};

const CourseContentContext = React.createContext<CourseContentContextValue | null>(
  null,
);

interface CourseContentProviderProps {
  value: CourseContentData;
  children: React.ReactNode;
}

export function CourseContentProvider({
  value,
  children,
}: CourseContentProviderProps) {
  const [courseData] = React.useState(value);

  const orderedContents = React.useMemo(
    () =>
      courseData.chapters
        .flatMap((chapter) => chapter.contents)
        .sort((a, b) => a.order - b.order),
    [courseData],
  );

  const getContentBySlug = React.useCallback(
    (slug: string) => orderedContents.find((item) => item.doc.slug === slug),
    [orderedContents],
  );

  const contextValue = React.useMemo<CourseContentContextValue>(
    () => ({
      ...courseData,
      orderedContents,
      getContentBySlug,
    }),
    [courseData, getContentBySlug, orderedContents],
  );

  return (
    <CourseContentContext.Provider value={contextValue}>
      {children}
    </CourseContentContext.Provider>
  );
}

export function useCourseContent() {
  const context = React.useContext(CourseContentContext);

  if (!context) {
    throw new Error(
      "useCourseContent must be used within a CourseContentProvider inside the course content layout.",
    );
  }

  return context;
}
