"use client";

import * as React from "react";

import type { SlateElementProps } from "platejs";

import { type VariantProps, cva } from "class-variance-authority";
import { SlateElement, NodeApi } from "platejs";
import { Hash, SendHorizontal } from "lucide-react";

import { Button } from "@/features/shared/components/ui/button";
import { useSectionAsk } from "@/features/user/agent/context/ask-context";
import { useLessonSectionMetadata } from "@/features/user/agent/context/lesson-section-context";
import { cn } from "@/lib/utils";

// Utility function to generate slug from text
export function generateHeadingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

const headingVariants = cva("relative mb-1 group", {
  variants: {
    variant: {
      h1: "mt-[1.6em] pb-1 font-heading text-4xl font-bold",
      h2: "mt-[1.4em] pb-px font-heading text-2xl font-semibold tracking-tight",
      h3: "mt-[1em] pb-px font-heading text-xl font-semibold tracking-tight",
      h4: "mt-[0.75em] font-heading text-lg font-semibold tracking-tight",
      h5: "mt-[0.75em] text-lg font-semibold tracking-tight",
      h6: "mt-[0.75em] text-base font-semibold tracking-tight",
    },
  },
});

export function HeadingElementStatic({
  variant = "h1",
  ...props
}: SlateElementProps & VariantProps<typeof headingVariants>) {
  // Get the text content of the heading
  const headingText = NodeApi.string(props.element);
  const slug = generateHeadingSlug(headingText);
  const askContext = useSectionAsk();
  const lessonSectionMetadata = useLessonSectionMetadata();

  const lessonId = lessonSectionMetadata?.lessonId;

  const maybeKey = (props.element as { _key?: string; id?: string } | undefined)
    ?._key;
  const maybeId = (props.element as { id?: string } | undefined)?.id;

  const sectionKey = maybeKey ?? maybeId ?? slug;
  const sectionMetadata =
    lessonSectionMetadata?.sections?.[sectionKey] ??
    (sectionKey !== slug ? lessonSectionMetadata?.sections?.[slug] : undefined);
  const contextTitle = sectionMetadata?.title ?? headingText;
  const contextContent = sectionMetadata?.content;

  const isActive =
    askContext.context?.lessonId === lessonId &&
    askContext.context?.sectionKey === sectionKey;
  const hasHistory = askContext.hasHistory(sectionKey);

  const handleHeadingAsk = React.useCallback(() => {
    if (!lessonId) return;

    askContext.setContext({
      lessonId,
      sectionKey,
      title: contextTitle,
      content: contextContent,
    });
  }, [askContext, lessonId, sectionKey, contextTitle, contextContent]);

  const handleHistoryOpen = React.useCallback(() => {
    if (!lessonId || !hasHistory) return;

    askContext.openHistory({
      lessonId,
      sectionKey,
      title: contextTitle,
    });
  }, [askContext, contextTitle, hasHistory, lessonId, sectionKey]);

  const handleHeadingActivate = React.useCallback(() => {
    if (!lessonId) return;

    if (hasHistory) {
      handleHistoryOpen();
      return;
    }

    handleHeadingAsk();
  }, [handleHeadingAsk, handleHistoryOpen, hasHistory, lessonId]);

  const handleHeadingKeyDown = (
    event: React.KeyboardEvent<HTMLHeadingElement>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleHeadingActivate();
    }
  };

  const handleAnchorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Update the URL with the hash
    window.history.pushState(null, "", `#${slug}`);
    // Scroll to the element
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const headingContent = hasHistory ? (
    <span className="after:-z-10 relative inline-block px-1 after:absolute after:inset-x-0 after:bottom-1 after:h-2 after:rounded-sm after:bg-green-200/70 after:transition-colors after:duration-200 after:content-[''] group-hover/h1:after:bg-green-300/80 dark:after:bg-green-500/30">
      {props.children}
    </span>
  ) : (
    props.children
  );

  return (
    <div className="group/h1 relative">
      {!hasHistory && (
        <Button
          aria-pressed={isActive}
          className={cn(
            "-left-12 absolute top-0 transition-colors opacity-0",
            isActive
              ? "opacity-100"
              : "opacity-0 group-hover/h1:opacity-100 group-focus-within/h1:opacity-100",
            isActive
              ? "text-primary group-hover/h1:text-primary"
              : "text-muted-foreground hover:text-primary group-hover/h1:text-primary",
          )}
          disabled={!lessonId}
          onClick={handleHeadingAsk}
          size="icon"
          type="button"
          variant="ghost"
        >
          <SendHorizontal
            className={cn(
              "transition-all ease-in-out rotate-90 group-hover/h1:rotate-0 delay-200",
              isActive ? "text-primary" : undefined,
            )}
            size={16}
          />
        </Button>
      )}
      <SlateElement
        as={variant!}
        className={cn(
          headingVariants({ variant }),
          "group scroll-mt-24 cursor-pointer",
          hasHistory &&
            "hover:-translate-y-0.5 w-fit cursor-pointer rounded-md transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-green-400 focus-visible:outline-offset-2 dark:focus-visible:outline-green-300",
        )}
        {...props}
        attributes={{
          id: slug,
          onClick: handleHeadingActivate,
          onKeyDown: handleHeadingKeyDown,
          role: "button",
          tabIndex: 0,
          ...props.attributes,
        }}
      >
        <span className="flex items-center">
          {headingContent}
          <button
            onClick={handleAnchorClick}
            className={cn(
              "ml-2 opacity-0 transition-opacity duration-200 text-muted-foreground hover:text-foreground group-hover:opacity-100",
              hasHistory &&
                "text-amber-400 hover:text-amber-500 dark:text-amber-300 dark:hover:text-amber-200",
            )}
            aria-label={`Link to ${headingText}`}
            type="button"
          >
            <Hash />
          </button>
        </span>
      </SlateElement>
    </div>
  );
}

export function H1ElementStatic(props: SlateElementProps) {
  return <HeadingElementStatic variant="h1" {...props} />;
}

export function H2ElementStatic(
  props: React.ComponentProps<typeof HeadingElementStatic>,
) {
  return <HeadingElementStatic variant="h2" {...props} />;
}

export function H3ElementStatic(
  props: React.ComponentProps<typeof HeadingElementStatic>,
) {
  return <HeadingElementStatic variant="h3" {...props} />;
}

export function H4ElementStatic(
  props: React.ComponentProps<typeof HeadingElementStatic>,
) {
  return <HeadingElementStatic variant="h4" {...props} />;
}

export function H5ElementStatic(
  props: React.ComponentProps<typeof HeadingElementStatic>,
) {
  return <HeadingElementStatic variant="h5" {...props} />;
}

export function H6ElementStatic(
  props: React.ComponentProps<typeof HeadingElementStatic>,
) {
  return <HeadingElementStatic variant="h6" {...props} />;
}
