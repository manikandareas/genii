"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { GripVertical, Plus, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import AdminContainer from "@/features/admin/components/container";
import {
  courseFormSchema,
  difficultyOptions,
  type CourseFormValues,
} from "@/features/admin/courses/schema";
import { EmptyState } from "@/features/admin/shared/components/empty-state";
import { PageHeader } from "@/features/admin/shared/components/page-header";
import { SortableItem } from "@/features/admin/shared/components/sortable-item";
import { formatBytes } from "@/features/admin/shared/utils/format-bytes";
import { formatDate } from "@/features/admin/shared/utils/format-date";
import { slugify } from "@/features/admin/shared/utils/slugify";
import { Button } from "@/features/shared/components/ui/button";
import { Checkbox } from "@/features/shared/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  const {
    results: assetResults,
    status: assetsStatus,
    loadMore: loadMoreAssets,
  } = usePaginatedQuery(
    api.admin.assets.queries.list,
    {
      search: undefined,
    },
    { initialNumItems: 20 },
  );

  const createCourse = useMutation(api.admin.courses.mutations.create);
  const updateCourse = useMutation(api.admin.courses.mutations.update);
  const removeCourse = useMutation(api.admin.courses.mutations.remove);
  const generateUploadUrl = useMutation(
    api.admin.assets.mutations.generateUploadUrl,
  );
  const createAssetFromUpload = useMutation(
    api.admin.assets.mutations.createFromUpload,
  );
  const reorderChapters = useMutation(api.admin.chapters.mutations.reorder);

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
          thumbnailAssetRef:
            initialData.thumbnail?.assetRef ?? "__no_thumbnail",
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
          thumbnailAssetRef: "__no_thumbnail",
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
        thumbnailAssetRef: initialData.thumbnail?.assetRef ?? "__no_thumbnail",
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
    control: form.control,
    // @ts-expect-error zod bug
    name: "learningOutcomes",
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
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
  const sortedChapters = useMemo(
    () =>
      chaptersList.slice().sort((a, b) => {
        const positionA = a.position ?? a._creationTime;
        const positionB = b.position ?? b._creationTime;
        return positionA - positionB;
      }),
    [chaptersList],
  );
  const [chapterOrder, setChapterOrder] = useState<Id<"chapters">[]>([]);
  const [isReorderingChapters, setIsReorderingChapters] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setChapterOrder([]);
      return;
    }

    if (sortedChapters.length === 0) {
      setChapterOrder([]);
      return;
    }

    setChapterOrder((previous) => {
      const validPrevious = previous.filter((id) =>
        sortedChapters.some((chapter) => chapter._id === id),
      );

      if (validPrevious.length === sortedChapters.length) {
        return validPrevious;
      }

      return sortedChapters.map((chapter) => chapter._id);
    });
  }, [sortedChapters, courseId]);

  const orderedChapters = useMemo(() => {
    if (chapterOrder.length === 0) {
      return sortedChapters;
    }
    const lookup = new Map(
      sortedChapters.map((chapter) => [chapter._id, chapter]),
    );
    return chapterOrder
      .map((chapterId) => lookup.get(chapterId))
      .filter((chapter): chapter is (typeof sortedChapters)[number] =>
        Boolean(chapter),
      );
  }, [chapterOrder, sortedChapters]);

  const chapterSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleChapterDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (isReorderingChapters) {
        return;
      }

      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = chapterOrder.findIndex((id) => id === active.id);
      const newIndex = chapterOrder.findIndex((id) => id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const previousOrder = chapterOrder;
      const nextOrder = arrayMove(previousOrder, oldIndex, newIndex);
      setChapterOrder(nextOrder);

      if (!courseId) {
        return;
      }

      setIsReorderingChapters(true);

      reorderChapters({
        courseId,
        orderedChapterIds: nextOrder as Id<"chapters">[],
      })
        .then(() => {
          toast.success("Chapter order updated");
        })
        .catch((error) => {
          setChapterOrder(previousOrder);
          const message =
            error instanceof Error
              ? error.message
              : "Failed to update chapter order";
          toast.error(message);
        })
        .finally(() => {
          setIsReorderingChapters(false);
        });
    },
    [chapterOrder, courseId, isReorderingChapters, reorderChapters],
  );
  const assetsList = assetResults;
  const selectedThumbnailValue = form.watch("thumbnailAssetRef");
  const selectedThumbnailAsset = useMemo(() => {
    if (selectedThumbnailValue === "__no_thumbnail") return null;
    return (
      assetsList.find((asset) => asset.storageId === selectedThumbnailValue) ??
      null
    );
  }, [assetsList, selectedThumbnailValue]);
  useEffect(() => {
    if (
      !selectedThumbnailValue ||
      selectedThumbnailValue === "__no_thumbnail" ||
      assetsStatus === "LoadingFirstPage" ||
      assetsStatus === "LoadingMore"
    ) {
      return;
    }

    const exists = assetsList.some(
      (asset) => asset.storageId === selectedThumbnailValue,
    );

    if (!exists && assetsStatus === "CanLoadMore") {
      loadMoreAssets(20);
    }
  }, [assetsList, assetsStatus, loadMoreAssets, selectedThumbnailValue]);
  const { isSubmitting } = form.formState;
  const isAssetsLoading = assetsStatus === "LoadingFirstPage";
  const isLoadingMoreAssets = assetsStatus === "LoadingMore";
  const canLoadMoreAssets =
    assetsStatus === "CanLoadMore" || isLoadingMoreAssets;

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAssetUpload = async (file: File) => {
    setIsUploadingAsset(true);
    setIsDraggingFile(false);
    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();

      await createAssetFromUpload({
        storageId,
        filename: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
      });

      form.setValue("thumbnailAssetRef", storageId, {
        shouldDirty: true,
        shouldTouch: true,
      });
      form.clearErrors("thumbnailAssetRef");
      toast.success("Asset uploaded");
      setIsUploadDialogOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload asset";
      toast.error(message);
    } finally {
      setIsUploadingAsset(false);
      resetFileInput();
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isUploadingAsset) return;
    void handleAssetUpload(file);
  };

  const handleBrowseClick = () => {
    if (isUploadingAsset) return;
    fileInputRef.current?.click();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isUploadingAsset) return;
    const file = event.dataTransfer.files?.[0];
    if (file) {
      void handleAssetUpload(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isUploadingAsset) return;
    setIsDraggingFile(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isUploadingAsset) return;
    setIsDraggingFile(false);
  };

  useEffect(() => {
    if (!isUploadDialogOpen) {
      setIsDraggingFile(false);
      resetFileInput();
    }
  }, [isUploadDialogOpen]);

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
        values.thumbnailAssetRef &&
        values.thumbnailAssetRef.trim().length > 0 &&
        values.thumbnailAssetRef !== "__no_thumbnail"
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
                onClick={() =>
                  addOutcome({
                    label: "",
                    url: "",
                  })
                }
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
                    <FormLabel>Thumbnail asset</FormLabel>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Select
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                            disabled={isAssetsLoading}
                          >
                            <SelectTrigger className="w-full justify-between">
                              <SelectValue
                                placeholder={
                                  isAssetsLoading
                                    ? "Loading assets..."
                                    : "Select asset"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__no_thumbnail">
                                <div className="flex flex-col text-left">
                                  <span className="text-sm font-medium">
                                    No thumbnail
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Use default course styling
                                  </span>
                                </div>
                              </SelectItem>
                              {assetsList.length === 0 ? (
                                <SelectItem value="__no_assets" disabled>
                                  Upload a new asset with the plus button
                                </SelectItem>
                              ) : (
                                assetsList.map((asset) => (
                                  <SelectItem
                                    key={asset._id}
                                    value={asset.storageId}
                                  >
                                    <div className="flex flex-col text-left">
                                      <span className="text-sm font-medium">
                                        {asset.filename}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <Dialog
                          open={isUploadDialogOpen}
                          onOpenChange={setIsUploadDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="shrink-0"
                              aria-label="Upload new asset"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Upload a new asset</DialogTitle>
                              <DialogDescription>
                                Drop an image or video. It will be added to the
                                asset library and linked to this field once
                                uploaded.
                              </DialogDescription>
                            </DialogHeader>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={handleFileInputChange}
                            />
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={handleBrowseClick}
                              onKeyDown={(event) => {
                                if (
                                  event.key === "Enter" ||
                                  event.key === " "
                                ) {
                                  event.preventDefault();
                                  handleBrowseClick();
                                }
                              }}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              className={cn(
                                "border-border/70 focus-visible:ring-ring/50 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-muted/20 p-6 text-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-[3px]",
                                isDraggingFile &&
                                  "border-primary bg-primary/10",
                                isUploadingAsset &&
                                  "pointer-events-none opacity-60",
                              )}
                            >
                              <UploadCloud className="h-6 w-6" />
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  {isUploadingAsset
                                    ? "Uploading asset..."
                                    : "Drag & drop your file"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {isUploadingAsset
                                    ? "Hang tight while we finish the upload."
                                    : "Images or videos up to 25 MB."}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  handleBrowseClick();
                                }}
                                disabled={isUploadingAsset}
                              >
                                Browse files
                              </Button>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  disabled={isUploadingAsset}
                                >
                                  Close
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {canLoadMoreAssets ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => loadMoreAssets(20)}
                            disabled={isLoadingMoreAssets}
                          >
                            {isLoadingMoreAssets ? "Loading..." : "Load more"}
                          </Button>
                        ) : null}
                      </div>
                      {selectedThumbnailAsset ? (
                        <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-background/40 p-3 text-sm">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {selectedThumbnailAsset.filename}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatBytes(selectedThumbnailAsset.size)} •{" "}
                              {selectedThumbnailAsset.mimeType}
                            </span>
                          </div>
                          {selectedThumbnailAsset.mimeType.startsWith(
                            "image/",
                          ) ? (
                            <div className="h-12 w-12 overflow-hidden rounded-md border border-border/60">
                              <Image
                                src={selectedThumbnailAsset.url}
                                alt={selectedThumbnailAsset.filename}
                                className="h-full w-full object-cover"
                                width={48}
                                height={48}
                              />
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                      {!isAssetsLoading && assetsList.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          No assets yet. Upload one from here or manage them on
                          the assets page.
                        </p>
                      ) : null}
                    </div>
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
              Need bulk actions? Visit the{" "}
              <Link className="underline" href="/admin/assets">
                assets page
              </Link>{" "}
              to manage the library—uploads there instantly sync with this
              picker.
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
              ) : orderedChapters.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No chapters yet. Use the button above to create the first one.
                </p>
              ) : (
                <div className="grid gap-2">
                  <p className="text-xs text-muted-foreground">
                    Drag the handle to reorder chapters.
                  </p>
                  {isReorderingChapters ? (
                    <p className="text-xs text-muted-foreground">
                      Saving order…
                    </p>
                  ) : null}
                  <DndContext
                    sensors={chapterSensors}
                    onDragEnd={handleChapterDragEnd}
                  >
                    <SortableContext
                      items={orderedChapters.map((chapter) => chapter._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid gap-2">
                        {orderedChapters.map((chapter, index) => (
                          <SortableItem key={chapter._id} id={chapter._id}>
                            {({
                              attributes,
                              listeners,
                              setActivatorNodeRef,
                              isDragging,
                            }) => (
                              <div
                                className={`flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-4 py-3 ${isDragging ? "shadow-lg ring-1 ring-ring" : ""}`}
                              >
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background/70 text-muted-foreground hover:text-foreground"
                                    ref={setActivatorNodeRef}
                                    {...listeners}
                                    {...attributes}
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </button>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {chapter.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {chapter.slug}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-muted-foreground">
                                    #
                                    {(chapter.position ?? index + 1).toString()}
                                  </span>
                                  <Button asChild variant="ghost" size="sm">
                                    <Link
                                      href={`/admin/chapters/${chapter._id}`}
                                    >
                                      Edit
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </SortableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
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
