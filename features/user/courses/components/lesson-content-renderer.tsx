"use client";


import { useMemo, useEffect } from "react";

import { createSlateEditor } from "platejs";
import type { Value } from "platejs";

import { EditorStatic } from "@/features/shared/components/ui/editor-static";
import { BaseEditorKit } from "@/features/shared/components/editor/editor-base-kit";
import { LessonSectionProvider } from "@/features/user/agent/context/lesson-section-context";
import { generateHeadingSlug } from "@/features/shared/components/ui/heading-node-static";

type PlateNode = {
  type?: string;
  children?: PlateNode[];
  text?: string;
  _key?: string;
  id?: string;
};

function getNodeText(node: PlateNode | undefined): string {
  if (!node) return "";
  if (typeof node.text === "string") {
    return node.text;
  }
  if (Array.isArray(node.children)) {
    return node.children.map(getNodeText).join("");
  }
  return "";
}

function extractSectionMetadata(content: Value) {
  const sections: Record<
    string,
    {
      title: string;
      content?: string;
      level: number;
    }
  > = {};

  let currentKey: string | null = null;
  let buffer: string[] = [];

  const flushBuffer = () => {
    if (!currentKey) return;
    const combined = buffer.join("\n\n").trim();
    if (combined.length > 0) {
      sections[currentKey] = {
        ...sections[currentKey],
        content: combined,
      };
    }
    buffer = [];
  };

  const nodes = content as PlateNode[];

  nodes.forEach((node) => {
    const type = node?.type ?? "";
    if (typeof type === "string" && /^h[1-6]$/.test(type)) {
      flushBuffer();
      const level = Number.parseInt(type.slice(1), 10) || 1;
      const title = getNodeText(node).trim();
      const key = node._key ?? node.id ?? generateHeadingSlug(title);

      sections[key] = {
        title: title.length > 0 ? title : "Bagian",
        content: sections[key]?.content,
        level,
      };
      currentKey = key;
      return;
    }

    if (!currentKey) {
      return;
    }

    const blockText = getNodeText(node).trim();
    if (blockText.length > 0) {
      buffer.push(blockText);
    }
  });

  flushBuffer();

  return sections;
}

interface LessonContentRendererProps {
  content: Value;
  className?: string;
  lessonId?: string;
}

export function LessonContentRenderer({
  content,
  className,
  lessonId,
}: LessonContentRendererProps) {
  const editor = useMemo(
    () =>
      createSlateEditor({
        plugins: BaseEditorKit,
        value: content,
      }),
    [content],
  );

  const sections = useMemo(() => extractSectionMetadata(content), [content]);

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

  return (
    <LessonSectionProvider value={{ lessonId, sections }}>
      <EditorStatic editor={editor} className={className} />
    </LessonSectionProvider>
  );
}
