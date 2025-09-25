"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import AdminContainer from "@/features/admin/components/container";
import { PageHeader } from "@/features/admin/shared/components/page-header";
import { formatDate } from "@/features/admin/shared/utils/format-date";
import { slugify } from "@/features/admin/shared/utils/slugify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import { Textarea } from "@/features/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { Button } from "@/features/shared/components/ui/button";
import { lessonFormSchema, type LessonFormValues } from "@/features/admin/lessons/schema";

interface LessonFormProps {
  lessonId?: Id<"lessons">;
  initialData?: {
    _id: Id<"lessons">;
    courseId: Id<"courses">;
    chapterId: Id<"chapters">;
    title: string;
    slug: string;
    content: unknown;
    videoUrl?: string | null;
    updatedAt?: number;
    _creationTime: number;
  } | null;
}

export function LessonForm({ lessonId, initialData }: LessonFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams?.get("courseId");
  const preselectedChapterId = searchParams?.get("chapterId");

  const courses = useQuery(api.admin.courses.queries.list, {
    search: undefined,
    difficulty: undefined,
    featured: undefined,
    topicId: undefined,
  });

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: initialData
      ? {
          courseId: initialData.courseId,
          chapterId: initialData.chapterId,
          title: initialData.title,
          slug: initialData.slug,
          content: JSON.stringify(initialData.content, null, 2),
          videoUrl: initialData.videoUrl ?? "",
        }
      : {
          courseId: preselectedCourseId ?? "",
          chapterId: preselectedChapterId ?? "",
          title: "",
          slug: "",
          content: "",
          videoUrl: "",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        courseId: initialData.courseId,
        chapterId: initialData.chapterId,
        title: initialData.title,
        slug: initialData.slug,
        content: JSON.stringify(initialData.content, null, 2),
        videoUrl: initialData.videoUrl ?? "",
      });
    }
  }, [initialData, form]);

  const createLesson = useMutation(api.admin.lessons.mutations.create);
  const updateLesson = useMutation(api.admin.lessons.mutations.update);
  const removeLesson = useMutation(api.admin.lessons.mutations.remove);

  const selectedCourseId = form.watch("courseId");
  const chapters = useQuery(api.admin.chapters.queries.list, {
    search: undefined,
    courseId: selectedCourseId ? (selectedCourseId as Id<"courses">) : undefined,
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialData));
  const titleValue = form.watch("title");

  useEffect(() => {
    if (initialData) return;
    if (!slugManuallyEdited) {
      form.setValue("slug", slugify(titleValue));
    }
  }, [titleValue, slugManuallyEdited, initialData, form]);

  useEffect(() => {
    if (!selectedCourseId) {
      form.setValue("chapterId", "");
      return;
    }

    if (initialData) {
      if (selectedCourseId !== initialData.courseId) {
        form.setValue("chapterId", "");
      }
      return;
    }

    if (preselectedChapterId && selectedCourseId === preselectedCourseId) {
      return;
    }

    form.setValue("chapterId", "");
  }, [selectedCourseId, form, initialData, preselectedChapterId, preselectedCourseId]);

  const { isSubmitting } = form.formState;
  const coursesList = useMemo(() => courses ?? [], [courses]);
  const chaptersList = useMemo(() => chapters ?? [], [chapters]);

  const handleSubmit = async (values: LessonFormValues) => {
    let parsedContent: unknown = values.content;
    try {
      parsedContent = JSON.parse(values.content);
    } catch {
      toast.error("Content must be valid JSON produced by Plate editors");
      return;
    }

    const payload = {
      courseId: values.courseId as Id<"courses">,
      chapterId: values.chapterId as Id<"chapters">,
      title: values.title,
      slug: values.slug,
      content: parsedContent,
      videoUrl: values.videoUrl ? values.videoUrl : undefined,
    };

    try {
      if (initialData && lessonId) {
        await updateLesson({ lessonId, ...payload });
        toast.success("Lesson updated");
      } else {
        const id = await createLesson(payload);
        toast.success("Lesson created");
        router.replace(`/admin/lessons/${id}`);
        return;
      }
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save lesson";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!lessonId) return;
    const confirmed = window.confirm("Delete this lesson? This action cannot be undone.");
    if (!confirmed) return;
    try {
      await removeLesson({ lessonId });
      toast.success("Lesson deleted");
      router.push("/admin/lessons");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete lesson";
      toast.error(message);
    }
  };

  const lastUpdated = useMemo(() => initialData?.updatedAt ?? initialData?._creationTime, [
    initialData,
  ]);

  return (
    <AdminContainer className="flex flex-col gap-8">
      <PageHeader
        title={initialData ? initialData.title : "Create Lesson"}
        description="Lessons contain Plate content and optional video references."
        action={{ label: "Back to lessons", href: "/admin/lessons", variant: "outline" }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Metadata</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {coursesList.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chapterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chapter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {chaptersList.map((chapter) => (
                          <SelectItem key={chapter._id} value={chapter._id}>
                            {chapter.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Lesson title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="lesson-slug"
                        {...field}
                        onChange={(event) => {
                          setSlugManuallyEdited(true);
                          field.onChange(event);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Plate content</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(form.getValues("content"));
                    form.setValue("content", JSON.stringify(parsed, null, 2));
                    toast.info("Content formatted");
                  } catch {
                    toast.error("Unable to format. Ensure the content is valid JSON.");
                  }
                }}
              >
                Format JSON
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Paste the Plate JSON payload here. A dedicated rich-text editor integration will be wired soon.
            </p>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Plate JSON</FormLabel>
                  <FormControl>
                    <Textarea rows={16} className="font-mono text-xs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Media</h2>
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>
              Created: {initialData ? formatDate(initialData._creationTime) : "Upon save"}
            </span>
            <span>Last updated: {lastUpdated ? formatDate(lastUpdated) : "—"}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            {initialData && lessonId ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete lesson
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" asChild>
                <Link href="/admin/lessons">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </AdminContainer>
  );
}
