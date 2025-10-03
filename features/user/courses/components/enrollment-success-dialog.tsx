"use client";

import { useRouter } from "next/navigation";
import { PartyPopper } from "lucide-react";

import { Button } from "@/features/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/features/shared/components/ui/dialog";

type EnrollmentSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  courseSlug: string;
  firstLessonSlug: string;
};

export function EnrollmentSuccessDialog({
  open,
  onOpenChange,
  courseTitle,
  courseSlug,
  firstLessonSlug,
}: EnrollmentSuccessDialogProps) {
  const router = useRouter();

  const handleGoToCourse = () => {
    router.push(`/courses/${courseSlug}`);
    onOpenChange(false);
  };

  const handleStartLearning = () => {
    router.push(`/courses/${courseSlug}/l/${firstLessonSlug}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
            <PartyPopper className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Selamat! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Kamu telah berhasil mendaftar ke kursus{" "}
            <span className="font-semibold text-foreground">{courseTitle}</span>
            . Waktunya memulai perjalanan belajarmu!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleStartLearning}
            className="w-full h-11 font-semibold bg-emerald-600 hover:bg-emerald-700"
            size="lg"
          >
            Belajar Sekarang
          </Button>
          <Button
            onClick={handleGoToCourse}
            variant="outline"
            className="w-full h-11 font-medium"
            size="lg"
          >
            Kembali ke Detail Kursus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
