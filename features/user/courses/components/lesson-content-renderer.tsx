"use client";

import { useMemo } from "react";
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

  return <EditorStatic editor={editor} className={className} />;
}
