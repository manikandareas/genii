"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/features/shared/components/ui/checkbox";
import { Button } from "@/features/shared/components/ui/button";
import {
  courseFormSchema,
  difficultyOptions,
  type CourseFormValues,
} from "@/features/admin/courses/schema";
import { EmptyState } from "@/features/admin/shared/components/empty-state";

interface CourseFormProps {
  courseId?: Id<"courses">;
  initialData?: {
    _id: Id<"courses">;
    title: string;
    slug: string;
    description: string;
    difficulty: (typeof difficultyOptions)[number];
    topicIds: Id<"topics">[];
    learningOutcomes?: string[];
    resources?: { label: string; url: string }[];
    featured?: boolean;
    readonly?: boolean;
    thumbnail?: {
      assetRef: Id<"_storage">;
      url?: string | null;
      metadata?: unknown;
    };
    trailerUrl?: string | null;
    resourcesDigest?: string | null;
    updatedAt?: number;
    _creationTime: number;
  } | null;
}

export function CourseForm({ courseId, initialData }: CourseFormProps) {
  const router = useRouter();

  const topics = useQuery(api.admin.topics.queries.list, { search: undefined });
  const chapters = useQuery(api.admin.chapters.queries.list, {
    courseId: courseId ?? undefined,
    search: undefined,
  });

  const createCourse = useMutation(api.admin.courses.mutations.create);
  const updateCourse = useMutation(api.admin.courses.mutations.update);
  const removeCourse = useMutation(api.admin.courses.mutations.remove);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description,
          difficulty: initialData.difficulty,
          topicIds: initialData.topicIds as unknown as string[],
          learningOutcomes: initialData.learningOutcomes ?? [],
          resources: initialData.resources ?? [],
          featured: initialData.featured ?? false,
          readonly: initialData.readonly ?? false,
          thumbnailAssetRef: initialData.thumbnail?.assetRef ?? "",
          thumbnailUrl: initialData.thumbnail?.url ?? "",
          trailerUrl: initialData.trailerUrl ?? "",
          resourcesDigest: initialData.resourcesDigest ?? "",
        }
      : {
          title: "",
          slug: "",
          description: "",
          difficulty: "beginner",
          topicIds: [],
          learningOutcomes: [],
          resources: [],
          featured: false,
          readonly: false,
          thumbnailAssetRef: "",
          thumbnailUrl: "",
          trailerUrl: "",
          resourcesDigest: "",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        slug: initialData.slug,
        description: initialData.description,
        difficulty: initialData.difficulty,
        topicIds: initialData.topicIds as unknown as string[],
        learningOutcomes: initialData.learningOutcomes ?? [],
        resources: initialData.resources ?? [],
        featured: initialData.featured ?? false,
        readonly: initialData.readonly ?? false,
        thumbnailAssetRef: initialData.thumbnail?.assetRef ?? "",
        thumbnailUrl: initialData.thumbnail?.url ?? "",
        trailerUrl: initialData.trailerUrl ?? "",
        resourcesDigest: initialData.resourcesDigest ?? "",
      });
    }
  }, [initialData, form]);

  const {
    fields: outcomeFields,
    append: addOutcome,
    remove: removeOutcome,
  } = useFieldArray({
    name: "learningOutcomes",
    control: form.control,
  });

  const {
    fields: resourceFields,
    append: addResource,
    remove: removeResource,
  } = useFieldArray({
    name: "resources",
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

  const selectedTopicIds = form.watch("topicIds");
  const topicsList = useMemo(() => topics ?? [], [topics]);
  const chaptersList = useMemo(() => chapters ?? [], [chapters]);
  const { isSubmitting } = form.formState;

  const toggleTopic = (topicId: Id<"topics">) => {
    const current = new Set(selectedTopicIds);
    if (current.has(topicId)) {
      current.delete(topicId);
    } else {
      current.add(topicId);
    }
    form.setValue("topicIds", Array.from(current) as string[]);
  };

  const handleSubmit = async (values: CourseFormValues) => {
    const payload = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      difficulty: values.difficulty,
      topicIds: values.topicIds as unknown as Id<"topics">[],
      learningOutcomes:
        values.learningOutcomes && values.learningOutcomes.length > 0
          ? values.learningOutcomes.filter((item) => item.trim().length > 0)
          : undefined,
      resources:
        values.resources && values.resources.length > 0
          ? values.resources.filter((item) => item.label && item.url)
          : undefined,
      featured: values.featured ?? false,
      readonly: values.readonly ?? false,
      thumbnail:
        values.thumbnailAssetRef && values.thumbnailAssetRef.trim().length > 0
          ? {
              assetRef: values.thumbnailAssetRef as Id<"_storage">,
              url: values.thumbnailUrl || undefined,
            }
          : undefined,
      trailerUrl: values.trailerUrl ? values.trailerUrl : undefined,
      resourcesDigest: values.resourcesDigest
        ? values.resourcesDigest
        : undefined,
    };

    try {
      if (initialData && courseId) {
        await updateCourse({ courseId, ...payload });
        toast.success("Course updated");
      } else {
        const id = await createCourse(payload);
        toast.success("Course created");
        router.replace(`/admin/courses/${id}`);
        return;
      }
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save course";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!courseId) return;
    const confirm = window.confirm(
      "Deleting this course will remove its metadata but chapters, lessons, and quizzes must be detached first. Continue?",
    );
    if (!confirm) return;
    try {
      await removeCourse({ courseId });
      toast.success("Course deleted");
      router.push("/admin/courses");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete course";
      toast.error(message);
    }
  };

  const lastUpdated = useMemo(
    () => initialData?.updatedAt ?? initialData?._creationTime,
    [initialData],
  );

  return (
    <AdminContainer className="flex flex-col gap-10">
      <PageHeader
        title={initialData ? initialData.title : "Create Course"}
        description="Set up course details, link topics, and manage supporting resources."
        action={{
          label: "Back to courses",
          href: "/admin/courses",
          variant: "outline",
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10">
          <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Primary information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. React Fundamentals" {...field} />
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
                        placeholder="react-fundamentals"
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
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="featured-checkbox"
                        className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                      >
                        <Checkbox
                          id="featured-checkbox"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        Featured in catalog
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="readonly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="readonly-checkbox"
                        className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                      >
                        <Checkbox
                          id="readonly-checkbox"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        Read-only
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                      placeholder="Brief summary displayed on the course page"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Topics</h2>
            <FormField
              control={form.control}
              name="topicIds"
              render={() => (
                <FormItem>
                  <FormLabel>Select topics</FormLabel>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {topicsList.length === 0 ? (
                      <EmptyState
                        title="No topics available"
                        description="Create topics first to tag this course."
                        action={{
                          label: "Create topic",
                          href: "/admin/topics/new",
                        }}
                      />
                    ) : (
                      topicsList.map((topic) => (
                        <label
                          key={topic._id}
                          htmlFor={`topic-${topic._id}`}
                          className="flex items-start gap-3 rounded-md border border-border/60 bg-background/40 p-3 cursor-pointer hover:bg-background/60 transition-colors"
                        >
                          <Checkbox
                            id={`topic-${topic._id}`}
                            checked={selectedTopicIds.includes(topic._id)}
                            onCheckedChange={() => toggleTopic(topic._id)}
                          />
                          <div>
                            <p className="text-sm font-medium">{topic.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {topic.description}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Learning outcomes</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addOutcome({ label: "", url: "" })}
              >
                Add outcome
              </Button>
            </div>
            {outcomeFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Capture the key skills learners will gain. These help the public
                page communicate value.
              </p>
            ) : null}
            <div className="grid gap-4">
              {outcomeFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`learningOutcomes.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">
                        Outcome {index + 1}
                      </FormLabel>
                      <div className="flex gap-3">
                        <FormControl>
                          <Input
                            placeholder="Describe the outcome"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeOutcome(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Resources</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addResource({ label: "", url: "" })}
              >
                Add resource
              </Button>
            </div>
            {resourceFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Link supporting materials like GitHub repositories, docs, or
                slides.
              </p>
            ) : null}
            <div className="grid gap-4">
              {resourceFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 md:grid-cols-[1fr_minmax(0,1fr)_auto]"
                >
                  <FormField
                    control={form.control}
                    name={`resources.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Resource label" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`resources.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeResource(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Media & links</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="thumbnailAssetRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail asset ID</FormLabel>
                    <FormControl>
                      <Input placeholder="convex asset ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL override</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trailerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trailer URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resourcesDigest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resources digest (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Short digest for notification emails"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Manage uploads on the{" "}
              <Link className="underline" href="/admin/assets">
                assets page
              </Link>{" "}
              and paste the storage ID above.
            </p>
          </section>

          {courseId ? (
            <section className="grid gap-4 rounded-lg border border-border/70 bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Chapters in this course
                </h2>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/chapters/new?courseId=${courseId}`}>
                    Add chapter
                  </Link>
                </Button>
              </div>
              {chapters === undefined ? (
                <p className="text-sm text-muted-foreground">
                  Loading chapters...
                </p>
              ) : chaptersList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No chapters yet. Use the button above to create the first one.
                </p>
              ) : (
                <ul className="grid gap-2">
                  {chaptersList.map((chapter) => (
                    <li
                      key={chapter._id}
                      className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{chapter.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {chapter.slug}
                        </p>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/chapters/${chapter._id}`}>
                          Edit
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
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
            {initialData && courseId ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete course
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" asChild>
                <Link href="/admin/courses">Cancel</Link>
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
