"use client";

import React from "react";

import {
  applyEnrollmentToChapters,
  getOrderedContents,
} from "../utils/content-utils";
import type {
  CourseChapter,
  CourseContentData,
  CourseContentItem,
} from "../types";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import isEqual from "lodash/isEqual";

type CourseContentContextValue = {
  course: CourseContentData["course"];
  chapters: CourseChapter[];
  orderedContents: CourseContentItem[];
  getContentBySlug: (slug: string) => CourseContentItem | undefined;
  enrollment: Doc<"course_enrollments"> | null;
  updateEnrollment: (next: Doc<"course_enrollments"> | null) => void;
};

const CourseContentContext =
  React.createContext<CourseContentContextValue | null>(null);

interface CourseContentProviderProps {
  value: CourseContentData;
  children: React.ReactNode;
}

export function CourseContentProvider({
  value,
  children,
}: CourseContentProviderProps) {
  const [course] = React.useState(value.course);
  const [chapters] = React.useState<CourseChapter[]>(value.chapters);
  const [enrollment, setEnrollment] =
    React.useState<Doc<"course_enrollments"> | null>(value.enrollment);

  const { data: remoteEnrollment } = useQuery(
    convexQuery(api.users.courses.queries.getEnrollmentForCourse, {
      courseId: course._id,
    }),
  );

  React.useEffect(() => {
    if (remoteEnrollment === undefined) {
      return;
    }

    setEnrollment((prev) => {
      if (prev === remoteEnrollment) {
        return prev;
      }

      if (
        prev &&
        remoteEnrollment &&
        prev._id === remoteEnrollment._id &&
        prev.updatedAt === remoteEnrollment.updatedAt &&
        isEqual(prev.contentsCompleted, remoteEnrollment.contentsCompleted)
      ) {
        return prev;
      }

      return remoteEnrollment ?? null;
    });
  }, [remoteEnrollment]);

  const chaptersWithStatus = React.useMemo(
    () => applyEnrollmentToChapters(chapters, enrollment),
    [chapters, enrollment],
  );

  const orderedContents = React.useMemo(
    () => getOrderedContents(chaptersWithStatus),
    [chaptersWithStatus],
  );

  const getContentBySlug = React.useCallback(
    (slug: string) => orderedContents.find((item) => item.doc.slug === slug),
    [orderedContents],
  );

  const contextValue = React.useMemo<CourseContentContextValue>(
    () => ({
      course,
      chapters: chaptersWithStatus,
      orderedContents,
      getContentBySlug,
      enrollment,
      updateEnrollment: setEnrollment,
    }),
    [course, chaptersWithStatus, orderedContents, getContentBySlug, enrollment],
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
