"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { Button } from "@/features/shared/components/ui/button";
import { PageHeader } from "@/features/admin/shared/components/page-header";
import AdminContainer from "@/features/admin/components/container";
import { topicFormSchema, type TopicFormValues } from "@/features/admin/topics/schema";
import { formatDate } from "@/features/admin/shared/utils/format-date";
import { slugify } from "@/features/admin/shared/utils/slugify";

interface TopicFormProps {
  topicId?: Id<"topics">;
  initialData?: {
    _id: Id<"topics">;
    title: string;
    slug: string;
    description: string;
    icon?: string;
    color?: string;
    updatedAt?: number;
    _creationTime: number;
  } | null;
}

export function TopicForm({ topicId, initialData }: TopicFormProps) {
  const router = useRouter();
  const createTopic = useMutation(api.admin.topics.mutations.create);
  const updateTopic = useMutation(api.admin.topics.mutations.update);
  const removeTopic = useMutation(api.admin.topics.mutations.remove);

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description,
          icon: initialData.icon ?? "",
          color: initialData.color ?? "",
        }
      : {
          title: "",
          slug: "",
          description: "",
          icon: "",
          color: "",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        slug: initialData.slug,
        description: initialData.description,
        icon: initialData.icon ?? "",
        color: initialData.color ?? "",
      });
    }
  }, [initialData, form]);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSlugManuallyEdited(true);
    }
  }, [initialData]);

  const titleValue = form.watch("title");
  const slugValue = form.watch("slug");

  useEffect(() => {
    if (initialData) return;
    if (!slugManuallyEdited) {
      form.setValue("slug", slugify(titleValue));
    }
  }, [titleValue, slugManuallyEdited, initialData, form]);

  const { isSubmitting } = form.formState;

  const handleSubmit = async (values: TopicFormValues) => {
    try {
      if (initialData && topicId) {
        await updateTopic({ topicId, ...values });
        toast.success("Topic updated");
      } else {
        const id = await createTopic(values);
        toast.success("Topic created");
        router.replace(`/admin/topics/${id}`);
        return;
      }
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save topic";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!topicId) return;
    const confirm = window.confirm(
      "This will permanently delete the topic. Make sure it is not referenced by any course. Continue?",
    );
    if (!confirm) return;
    try {
      await removeTopic({ topicId });
      toast.success("Topic deleted");
      router.push("/admin/topics");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete topic";
      toast.error(message);
    }
  };

  const lastUpdated = useMemo(() => initialData?.updatedAt ?? initialData?._creationTime, [
    initialData,
  ]);

  return (
    <AdminContainer className="flex flex-col gap-8">
      <PageHeader
        title={initialData ? initialData.title : "Create Topic"}
        description="Define the topic metadata used across the catalog."
        action={{ label: "Back to topics", href: "/admin/topics", variant: "outline" }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Frontend Development" {...field} />
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
                      placeholder="frontend-development"
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional emoji or short label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input type="color" {...field} value={field.value || "#4f46e5"} />
                    </FormControl>
                    <span className="text-xs text-muted-foreground">Used for badges & accents</span>
                  </div>
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
                  <Textarea rows={4} placeholder="Short summary of the topic" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>
              Created: {initialData ? formatDate(initialData._creationTime) : "Upon save"}
            </span>
            <span>Last updated: {lastUpdated ? formatDate(lastUpdated) : "—"}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            {initialData && topicId ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" asChild>
                <Link href="/admin/topics">Cancel</Link>
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
