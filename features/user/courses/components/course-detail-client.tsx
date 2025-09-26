"use client";

import { useCallback, useState } from "react";

import { Doc } from "@/convex/_generated/dataModel";

import DetailContents from "./detail-contents";
import { DetailHero } from "./detail-hero";
import DetailPromo from "./detail-promo";
import { CourseEnrollmentDialog } from "./course-enrollment-dialog";

interface CourseDetailClientProps {
  course: Doc<"courses">;
}

export function CourseDetailClient({ course }: CourseDetailClientProps) {
  const [isEnrollmentOpen, setEnrollmentOpen] = useState(false);

  const openEnrollment = useCallback(() => {
    setEnrollmentOpen(true);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setEnrollmentOpen(open);
  }, []);

  return (
    <>
      <DetailHero course={course} onEnrollClick={openEnrollment} />

      <DetailContents course={course} />

      <DetailPromo course={course} onEnrollClick={openEnrollment} />

      <CourseEnrollmentDialog
        course={course}
        open={isEnrollmentOpen}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
