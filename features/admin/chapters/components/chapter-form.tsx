"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
import {
  chapterFormSchema,
  type ChapterFormValues,
  contentOrderItemSchema,
} from "@/features/admin/chapters/schema";
import { SortableItem } from "@/features/admin/shared/components/sortable-item";
import { GripVertical } from "lucide-react";

interface ChapterFormProps {
  chapterId?: Id<"chapters">;
  initialData?: {
    _id: Id<"chapters">;
    courseId: Id<"courses">;
    title: string;
    slug: string;
    description: string;
    position?: number | null;
    contentOrder: Array<{
      contentId: string;
      contentType: "lesson" | "quiz";
      position?: number | null;
    }>;
    updatedAt?: number;
    _creationTime: number;
  } | null;
}

export function ChapterForm({ chapterId, initialData }: ChapterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams?.get("courseId");

  const courses = useQuery(api.admin.courses.queries.list, {
    search: undefined,
    difficulty: undefined,
    featured: undefined,
    topicId: undefined,
  });

  const createChapter = useMutation(api.admin.chapters.mutations.create);
  const updateChapter = useMutation(api.admin.chapters.mutations.update);
  const removeChapter = useMutation(api.admin.chapters.mutations.remove);

  const form = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: initialData
      ? {
          courseId: initialData.courseId,
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description,
          contentOrder: (initialData.contentOrder ?? [])
            .slice()
            .sort((a, b) => {
              const positionA = a.position ?? 0;
              const positionB = b.position ?? 0;
              return positionA - positionB;
            }),
        }
      : {
          courseId: preselectedCourseId ?? "",
          title: "",
          slug: "",
          description: "",
          contentOrder: [],
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        courseId: initialData.courseId,
        title: initialData.title,
        slug: initialData.slug,
        description: initialData.description,
        contentOrder: (initialData.contentOrder ?? []).slice().sort((a, b) => {
          const positionA = a.position ?? 0;
          const positionB = b.position ?? 0;
          return positionA - positionB;
        }),
      });
    }
  }, [initialData, form]);

  const {
    fields: contentFields,
    append,
    remove,
    move,
  } = useFieldArray({
    name: "contentOrder",
    control: form.control,
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialData),
  );
  const titleValue = form.watch("title");

  useEffect(() => {
    if (initialData) return;
    if (!slugManuallyEdited) {
      form.setValue("slug", slugify(titleValue));
    }
  }, [titleValue, slugManuallyEdited, initialData, form]);

  const { isSubmitting } = form.formState;
  const coursesList = useMemo(() => courses ?? [], [courses]);
  const handleSubmit = async (values: ChapterFormValues) => {
    let parsedContent:
      | Array<{
          contentId: Id<"lessons"> | Id<"quizzes">;
          contentType: "lesson" | "quiz";
        }>
      | undefined;
    try {
      parsedContent = values.contentOrder?.map((item) => {
        const parsed = contentOrderItemSchema.parse(item);
        return {
          contentId: parsed.contentId as Id<"lessons"> | Id<"quizzes">,
          contentType: parsed.contentType,
        };
      });
    } catch {
      toast.error("Check the content order entries before saving");
      return;
    }

    const payload = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      contentOrder: parsedContent ?? [],
    };

    try {
      if (initialData && chapterId) {
        await updateChapter({ chapterId, ...payload });
        toast.success("Chapter updated");
      } else {
        const id = await createChapter({
          ...payload,
          courseId: values.courseId as Id<"courses">,
        });
        toast.success("Chapter created");
        router.replace(`/admin/chapters/${id}`);
        return;
      }
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save chapter";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!chapterId) return;
    const confirmed = window.confirm(
      "This chapter will be permanently deleted. Lessons and quizzes inside must be moved first. Continue?",
    );
    if (!confirmed) return;
    try {
      await removeChapter({ chapterId });
      toast.success("Chapter deleted");
      router.push("/admin/chapters");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete chapter";
      toast.error(message);
    }
  };

  const lastUpdated = useMemo(
    () => initialData?.updatedAt ?? initialData?._creationTime,
    [initialData],
  );

  const lessons = useQuery(
    api.admin.lessons.queries.list,
    chapterId ? { chapterId } : "skip",
  );
  const quizzes = useQuery(
    api.admin.quizzes.queries.list,
    chapterId ? { chapterId } : "skip",
  );

  const lessonsList = useMemo(() => lessons ?? [], [lessons]);
  const quizzesList = useMemo(() => quizzes ?? [], [quizzes]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleContentDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }

      const activeIndex = contentFields.findIndex(
        (field) => field.id === active.id,
      );
      const overIndex = contentFields.findIndex(
        (field) => field.id === over.id,
      );

      if (activeIndex === -1 || overIndex === -1) {
        return;
      }

      move(activeIndex, overIndex);
    },
    [contentFields, move],
  );

  const addContentItem = () => {
    append({ contentId: "", contentType: "lesson" });
  };

  const contentOrderingDisabled = !chapterId;

  return (
    <AdminContainer className="flex flex-col gap-8">
      <PageHeader
        title={initialData ? initialData.title : "Create Chapter"}
        description="Chapters control the learning flow inside a course."
        action={{
          label: "Back to chapters",
          href: "/admin/chapters",
          variant: "outline",
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Details</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {coursesList.map((course) => (
                            <SelectItem key={course._id} value={course._id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                      <Input placeholder="Chapter title" {...field} />
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
                        placeholder="chapter-slug"
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Short description for this chapter"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="grid gap-4 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Content order</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addContentItem}
                disabled={contentOrderingDisabled}
              >
                Add entry
              </Button>
            </div>
            {contentOrderingDisabled ? (
              <p className="text-sm text-muted-foreground">
                Save this chapter first to organise lessons and quizzes. Once
                the chapter exists you can drag items here to control the
                learning flow.
              </p>
            ) : contentFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Content order controls the sequence of lessons and quizzes. Add
                entries once the lesson or quiz exists, then drag to reorder.
              </p>
            ) : (
              <DndContext sensors={sensors} onDragEnd={handleContentDragEnd}>
                <SortableContext
                  items={contentFields.map((field) => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid gap-3">
                    {contentFields.map((field, index) => (
                      <SortableItem key={field.id} id={field.id}>
                        {({
                          attributes,
                          listeners,
                          setActivatorNodeRef,
                          isDragging,
                        }) => {
                          const typePath =
                            `contentOrder.${index}.contentType` as const;
                          const contentPath =
                            `contentOrder.${index}.contentId` as const;
                          const watchedType = form.watch(typePath) as
                            | "lesson"
                            | "quiz"
                            | undefined;
                          const selectedType =
                            watchedType ?? field.contentType ?? "lesson";
                          const options =
                            selectedType === "lesson"
                              ? lessonsList
                              : quizzesList;
                          const hasOptions = options.length > 0;

                          return (
                            <div
                              className={`grid gap-3 rounded-md border border-border/60 bg-background/40 px-4 py-3 md:grid-cols-[auto_1fr_1fr_auto] ${isDragging ? "shadow-lg ring-1 ring-ring" : ""}`}
                            >
                              <div className="flex items-center justify-center">
                                <button
                                  type="button"
                                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background/70 text-muted-foreground hover:text-foreground"
                                  ref={setActivatorNodeRef}
                                  {...listeners}
                                  {...attributes}
                                >
                                  <GripVertical className="h-4 w-4" />
                                </button>
                              </div>
                              <FormField
                                control={form.control}
                                name={typePath}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="sr-only">
                                      Type
                                    </FormLabel>
                                    <FormControl>
                                      <Select
                                        value={field.value ?? "lesson"}
                                        onValueChange={(value) => {
                                          field.onChange(value);
                                          form.setValue(contentPath, "");
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="lesson">
                                            Lesson
                                          </SelectItem>
                                          <SelectItem value="quiz">
                                            Quiz
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={contentPath}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="sr-only">
                                      Content
                                    </FormLabel>
                                    <FormControl>
                                      <Select
                                        disabled={!hasOptions}
                                        value={field.value ?? ""}
                                        onValueChange={field.onChange}
                                      >
                                        <SelectTrigger>
                                          <SelectValue
                                            placeholder={
                                              hasOptions
                                                ? selectedType === "lesson"
                                                  ? "Select lesson"
                                                  : "Select quiz"
                                                : selectedType === "lesson"
                                                  ? "No lessons yet"
                                                  : "No quizzes yet"
                                            }
                                          />
                                        </SelectTrigger>
                                        {hasOptions ? (
                                          <SelectContent>
                                            {options.map((item) => (
                                              <SelectItem
                                                key={item._id}
                                                value={item._id}
                                              >
                                                {item.title}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        ) : null}
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          );
                        }}
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </section>

          {form.watch("courseId") && chapterId ? (
            <section className="grid gap-3 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Quick actions</h2>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link
                    href={`/admin/lessons/new?courseId=${form.watch("courseId")}&chapterId=${chapterId}`}
                  >
                    Add lesson
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link
                    href={`/admin/quizzes/new?courseId=${form.watch("courseId")}&chapterId=${chapterId}`}
                  >
                    Add quiz
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Newly created lessons or quizzes can be inserted into the
                content order using the controls above.
              </p>
            </section>
          ) : null}

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>
              Created:{" "}
              {initialData
                ? formatDate(initialData._creationTime)
                : "Upon save"}
            </span>
            <span>
              Last updated: {lastUpdated ? formatDate(lastUpdated) : "—"}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            {initialData && chapterId ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete chapter
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" asChild>
                <Link href="/admin/chapters">Cancel</Link>
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
