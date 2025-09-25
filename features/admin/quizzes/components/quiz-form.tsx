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
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

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
  quizFormSchema,
  quizQuestionSchema,
  type QuizFormValues,
} from "@/features/admin/quizzes/schema";
import { SortableItem } from "@/features/admin/shared/components/sortable-item";

interface QuizFormProps {
  quizId?: Id<"quizzes">;
  initialData?: {
    _id: Id<"quizzes">;
    courseId?: Id<"courses"> | null;
    chapterId?: Id<"chapters"> | null;
    title: string;
    slug: string;
    description: string;
    maxAttempt?: number | null;
    questions: Array<{
      question: string;
      options: string[];
      correctOptionIndex: number;
      explanation?: string | null;
    }>;
    updatedAt?: number;
    _creationTime: number;
  } | null;
}

const adjustCorrectIndex = (current: number, from: number, to: number) => {
  if (current === from) {
    return to;
  }

  if (from < current && current <= to) {
    return current - 1;
  }

  if (to <= current && current < from) {
    return current + 1;
  }

  return current;
};

export function QuizForm({ quizId, initialData }: QuizFormProps) {
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

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: initialData
      ? {
          courseId: (initialData.courseId ?? "") as string,
          chapterId: (initialData.chapterId ?? "") as string,
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description,
          maxAttempt: initialData.maxAttempt?.toString() ?? "",
          questions: initialData.questions.map((question) => ({
            question: question.question,
            options: question.options,
            correctOptionIndex: question.correctOptionIndex,
            explanation: question.explanation ?? "",
          })),
        }
      : {
          courseId: preselectedCourseId ?? "",
          chapterId: preselectedChapterId ?? "",
          title: "",
          slug: "",
          description: "",
          maxAttempt: "",
          questions: [
            {
              question: "",
              options: ["", ""],
              correctOptionIndex: 0,
              explanation: "",
            },
          ],
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        courseId: (initialData.courseId ?? "") as string,
        chapterId: (initialData.chapterId ?? "") as string,
        title: initialData.title,
        slug: initialData.slug,
        description: initialData.description,
        maxAttempt: initialData.maxAttempt?.toString() ?? "",
        questions: initialData.questions.map((question) => ({
          question: question.question,
          options: question.options,
          correctOptionIndex: question.correctOptionIndex,
          explanation: question.explanation ?? "",
        })),
      });
    }
  }, [initialData, form]);

  const selectedCourseId = form.watch("courseId");
  const chapters = useQuery(api.admin.chapters.queries.list, {
    search: undefined,
    courseId: selectedCourseId ? (selectedCourseId as Id<"courses">) : undefined,
  });

  const createQuiz = useMutation(api.admin.quizzes.mutations.create);
  const updateQuiz = useMutation(api.admin.quizzes.mutations.update);
  const removeQuiz = useMutation(api.admin.quizzes.mutations.remove);

  const { fields: questionFields, append, remove, move } = useFieldArray({
    name: "questions",
    control: form.control,
  });

  const dndSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleQuestionDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }

      const activeIndex = questionFields.findIndex((field) => field.id === active.id);
      const overIndex = questionFields.findIndex((field) => field.id === over.id);

      if (activeIndex === -1 || overIndex === -1) {
        return;
      }

      move(activeIndex, overIndex);
    },
    [move, questionFields],
  );

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
      if ((initialData.courseId ?? "") !== selectedCourseId) {
        form.setValue("chapterId", "");
      }
      return;
    }

    if (preselectedChapterId && selectedCourseId === preselectedCourseId) {
      return;
    }

    form.setValue("chapterId", "");
  }, [selectedCourseId, form, initialData, preselectedChapterId, preselectedCourseId]);

  const addQuestion = () => {
    append({ question: "", options: ["", ""], correctOptionIndex: 0, explanation: "" });
  };

  const addOption = (index: number) => {
    const options = form.getValues(`questions.${index}.options`);
    if (options.length >= 6) {
      toast.warning("Maximum of six options per question");
      return;
    }
    form.setValue(`questions.${index}.options`, [...options, ""]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const options = form.getValues(`questions.${questionIndex}.options`);
    if (options.length <= 2) {
      toast.warning("Keep at least two options");
      return;
    }
    const updated = options.filter((_, idx) => idx !== optionIndex);
    const correct = form.getValues(`questions.${questionIndex}.correctOptionIndex`);
    const nextCorrect = Math.min(correct, updated.length - 1);
    form.setValue(`questions.${questionIndex}.options`, updated);
    form.setValue(`questions.${questionIndex}.correctOptionIndex`, nextCorrect);
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    form.setValue(`questions.${questionIndex}.correctOptionIndex`, optionIndex);
  };

  const coursesList = useMemo(() => courses ?? [], [courses]);
  const chaptersList = useMemo(() => chapters ?? [], [chapters]);
  const { isSubmitting } = form.formState;

  const handleSubmit = async (values: QuizFormValues) => {
    let parsedQuestions:
      | Array<{
          question: string;
          options: string[];
          correctOptionIndex: number;
          explanation?: string;
        }>
      | undefined;
    try {
      parsedQuestions = values.questions.map((question) =>
        quizQuestionSchema.parse({
          ...question,
          correctOptionIndex: question.correctOptionIndex,
        }),
      );
    } catch {
      toast.error("Review the questions and ensure each has valid options");
      return;
    }

    const numericMaxAttempt = values.maxAttempt && values.maxAttempt.trim() !== ""
      ? Number(values.maxAttempt)
      : undefined;

    if (numericMaxAttempt !== undefined && Number.isNaN(numericMaxAttempt)) {
      toast.error("Max attempts must be a number");
      return;
    }

    if (!parsedQuestions) {
      return;
    }

    const payload = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      maxAttempt: numericMaxAttempt,
      courseId: values.courseId as Id<"courses">,
      chapterId: values.chapterId as Id<"chapters">,
      questions: parsedQuestions,
    };

    try {
      if (initialData && quizId) {
        await updateQuiz({ quizId, ...payload });
        toast.success("Quiz updated");
      } else {
        const id = await createQuiz(payload);
        toast.success("Quiz created");
        router.replace(`/admin/quizzes/${id}`);
        return;
      }
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save quiz";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!quizId) return;
    const confirmed = window.confirm("Delete this quiz? This action cannot be undone.");
    if (!confirmed) return;
    try {
      await removeQuiz({ quizId });
      toast.success("Quiz deleted");
      router.push("/admin/quizzes");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete quiz";
      toast.error(message);
    }
  };

  const lastUpdated = useMemo(() => initialData?.updatedAt ?? initialData?._creationTime, [
    initialData,
  ]);

  return (
    <AdminContainer className="flex flex-col gap-8">
      <PageHeader
        title={initialData ? initialData.title : "Create Quiz"}
        description="Build quizzes with multiple-choice questions and explanations."
        action={{ label: "Back to quizzes", href: "/admin/quizzes", variant: "outline" }}
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
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
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
                name="chapterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          {chaptersList.map((chapter) => (
                            <SelectItem key={chapter._id} value={chapter._id}>
                              {chapter.title}
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
                      <Input placeholder="Quiz title" {...field} />
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
                        placeholder="quiz-slug"
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
              <FormField
                control={form.control}
                name="maxAttempt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max attempts (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Leave blank for unlimited" {...field} />
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
                    <Textarea rows={3} placeholder="Shown in the quiz overview" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Questions</h2>
              <Button type="button" variant="ghost" size="sm" onClick={addQuestion}>
                Add question
              </Button>
            </div>
            <DndContext sensors={dndSensors} onDragEnd={handleQuestionDragEnd}>
              <SortableContext
                items={questionFields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-6">
                  {questionFields.map((questionField, questionIndex) => {
                    const optionValues =
                      form.watch(`questions.${questionIndex}.options`) ?? [];
                    const correctIndex =
                      form.watch(`questions.${questionIndex}.correctOptionIndex`) ?? 0;
                    const optionIds = optionValues.map(
                      (_option, optionIndex) => `${questionField.id}-option-${optionIndex}`,
                    );

                    const handleOptionDragEnd = (event: DragEndEvent) => {
                      const { active, over } = event;
                      if (!over || active.id === over.id) {
                        return;
                      }

                      const oldIndex = optionIds.indexOf(active.id as string);
                      const newIndex = optionIds.indexOf(over.id as string);

                      if (oldIndex === -1 || newIndex === -1) {
                        return;
                      }

                      const reordered = arrayMove(optionValues, oldIndex, newIndex);
                      form.setValue(`questions.${questionIndex}.options`, reordered);

                      const currentCorrect = form.getValues(
                        `questions.${questionIndex}.correctOptionIndex`,
                      ) as number;
                      const nextCorrect = adjustCorrectIndex(
                        currentCorrect,
                        oldIndex,
                        newIndex,
                      );
                      if (nextCorrect !== currentCorrect) {
                        form.setValue(
                          `questions.${questionIndex}.correctOptionIndex`,
                          nextCorrect,
                        );
                      }
                    };

                    return (
                      <SortableItem key={questionField.id} id={questionField.id}>
                        {({ attributes, listeners, setActivatorNodeRef, isDragging }) => (
                          <div
                            className={`grid gap-4 rounded-lg border border-border/60 bg-background/40 p-4 ${isDragging ? "shadow-lg ring-1 ring-ring" : ""}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <button
                                  type="button"
                                  className="mt-1 flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background/70 text-muted-foreground hover:text-foreground"
                                  ref={setActivatorNodeRef}
                                  {...listeners}
                                  {...attributes}
                                >
                                  <GripVertical className="h-4 w-4" />
                                </button>
                                <div className="flex flex-col gap-2">
                                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Question {questionIndex + 1}
                                  </span>
                                  <FormField
                                    control={form.control}
                                    name={`questions.${questionIndex}.question`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Question text</FormLabel>
                                        <FormControl>
                                          <Textarea
                                            rows={3}
                                            placeholder="Enter the question"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => remove(questionIndex)}
                              >
                                Remove
                              </Button>
                            </div>

                            <div className="grid gap-3">
                              <p className="text-sm font-medium">Options</p>
                              <DndContext
                                sensors={dndSensors}
                                onDragEnd={handleOptionDragEnd}
                              >
                                <SortableContext
                                  items={optionIds}
                                  strategy={verticalListSortingStrategy}
                                >
                                  <div className="grid gap-2">
                                    {optionValues.map((option, optionIndex) => (
                                      <SortableItem
                                        key={optionIds[optionIndex]}
                                        id={optionIds[optionIndex]}
                                      >
                                        {({
                                          attributes: optionAttributes,
                                          listeners: optionListeners,
                                          setActivatorNodeRef: setOptionActivatorNodeRef,
                                          isDragging: isOptionDragging,
                                        }) => (
                                          <div
                                            className={`flex flex-col gap-2 rounded-md border border-border/50 bg-background/80 p-3 ${isOptionDragging ? "shadow-md ring-1 ring-ring" : ""}`}
                                          >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                              <button
                                                type="button"
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background/70 text-muted-foreground hover:text-foreground"
                                                ref={setOptionActivatorNodeRef}
                                                {...optionListeners}
                                                {...optionAttributes}
                                              >
                                                <GripVertical className="h-4 w-4" />
                                              </button>
                                              <div className="flex flex-1 items-center gap-3">
                                                <input
                                                  type="radio"
                                                  name={`correct-${questionField.id}`}
                                                  checked={correctIndex === optionIndex}
                                                  onChange={() =>
                                                    setCorrectOption(questionIndex, optionIndex)
                                                  }
                                                />
                                                <Input
                                                  value={option}
                                                  onChange={(event) => {
                                                    const updated = [...optionValues];
                                                    updated[optionIndex] = event.target.value;
                                                    form.setValue(
                                                      `questions.${questionIndex}.options`,
                                                      updated,
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </div>
                                            <div className="flex justify-end">
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  removeOption(questionIndex, optionIndex)
                                                }
                                              >
                                                Remove option
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </SortableItem>
                                    ))}
                                  </div>
                                </SortableContext>
                              </DndContext>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => addOption(questionIndex)}
                              >
                                Add option
                              </Button>
                            </div>

                            <FormField
                              control={form.control}
                              name={`questions.${questionIndex}.explanation`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Explanation (optional)</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      rows={2}
                                      placeholder="Explain why the correct answer is right"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </SortableItem>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </section>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>
              Created: {initialData ? formatDate(initialData._creationTime) : "Upon save"}
            </span>
            <span>Last updated: {lastUpdated ? formatDate(lastUpdated) : "—"}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            {initialData && quizId ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete quiz
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" asChild>
                <Link href="/admin/quizzes">Cancel</Link>
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
