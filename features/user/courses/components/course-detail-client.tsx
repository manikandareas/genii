"use client";

import { useCallback, useRef, useState } from "react";

import confetti from "canvas-confetti";

import { Doc } from "@/convex/_generated/dataModel";

import DetailContents from "./detail-contents";
import { DetailHero } from "./detail-hero";
import DetailPromo from "./detail-promo";
import { CourseEnrollmentDialog } from "./course-enrollment-dialog";
import { EnrollmentSuccessDialog } from "./enrollment-success-dialog";

interface CourseDetailClientProps {
  course: Doc<"courses"> & {
    topics: Doc<"topics">[];
  };
}

export function CourseDetailClient({ course }: CourseDetailClientProps) {
  const [isEnrollmentOpen, setEnrollmentOpen] = useState(false);
  const [isSuccessOpen, setSuccessOpen] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<{
    firstLessonSlug: string | null;
    courseSlug: string;
  } | null>(null);
  const confettiExecutedRef = useRef(false);

  const openEnrollment = useCallback(() => {
    setEnrollmentOpen(true);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setEnrollmentOpen(open);
  }, []);

  const handleEnrollmentSuccess = useCallback(
    async (data: { firstLessonSlug: string | null; courseSlug: string }) => {
      // Store enrollment data
      setEnrollmentData(data);

      // Trigger confetti only once
      if (!confettiExecutedRef.current) {
        confettiExecutedRef.current = true;

        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          });
        }, 250);
      }

      // Show success dialog
      setSuccessOpen(true);
    },
    [],
  );

  const handleSuccessDialogChange = useCallback((open: boolean) => {
    setSuccessOpen(open);
    if (!open) {
      confettiExecutedRef.current = false;
      setEnrollmentData(null);
    }
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
        onSuccess={handleEnrollmentSuccess}
      />

      {isSuccessOpen && enrollmentData?.firstLessonSlug && (
        <EnrollmentSuccessDialog
          open={true}
          onOpenChange={handleSuccessDialogChange}
          courseTitle={course.title}
          courseSlug={enrollmentData.courseSlug}
          firstLessonSlug={enrollmentData.firstLessonSlug}
        />
      )}
    </>
  );
}
