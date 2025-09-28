"use client";

import { useMemo, useEffect } from "react";
import { createSlateEditor } from "platejs";
import type { Value } from "platejs";

import { EditorStatic } from "@/features/shared/components/ui/editor-static";
import { BaseEditorKit } from "@/features/shared/components/editor/editor-base-kit";

interface LessonContentRendererProps {
  content: Value;
  className?: string;
}

export function LessonContentRenderer({
  content,
  className,
}: LessonContentRendererProps) {
  const editor = useMemo(
    () =>
      createSlateEditor({
        plugins: BaseEditorKit,
        value: content,
      }),
    [content],
  );

  // Handle URL hash on component mount to scroll to heading
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    if (hash) {
      // Use setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [content]);

  return <EditorStatic editor={editor} className={className} />;
}
