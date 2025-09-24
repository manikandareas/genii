"use client";
import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string; // The text to reveal, e.g. "OpenWork: The open source AI agent framework."
}

export const TextReveal: FC<TextRevealProps> = ({ children, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string");
  }

  // Updated default text for OpenWork context
  const defaultText =
    "OpenWork: The open source framework for building, deploying, and managing AI agents.";
  const textToReveal = children.trim().length > 0 ? children : defaultText;
  const words = textToReveal.split(" ");

  return (
    <div className={cn("relative z-0 h-[200vh]", className)} ref={targetRef}>
      <div
        className={
          "sticky top-0 mx-auto flex h-[50%] max-w-5xl items-center bg-transparent px-[1rem] "
        }
      >
        <span
          className={
            "flex flex-wrap p-5 font-normal text-2xl text-black/20 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-3xl dark:text-white/20"
          }
          ref={targetRef}
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word
                key={i.toString()}
                progress={scrollYProgress}
                range={[start, end]}
              >
                {word}
              </Word>
            );
          })}
        </span>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-1.5">
      <span className="absolute opacity-30">{children}</span>
      <motion.span className={"text-black dark:text-white"} style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
};
