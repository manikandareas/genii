"use client";
import { motion, useScroll, useTransform } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  reason: string;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    // Initial height calculation
    updateHeight();

    // Recalculate height when window resizes
    window.addEventListener("resize", updateHeight);

    // Use a timeout to ensure content is fully rendered
    const timeoutId = setTimeout(updateHeight, 100);

    return () => {
      window.removeEventListener("resize", updateHeight);
      clearTimeout(timeoutId);
    };
  }, [data]); // Add data as dependency

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans" ref={containerRef}>
      <div ref={ref} className="relative max-w-7xl mx-auto pb-12 sm:pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex pt-8 sm:pt-16 md:pt-24 lg:pt-40 gap-4 sm:gap-6 md:gap-10 justify-between"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-start md:items-center top-20 sm:top-32 md:top-40 self-start w-full  sm:max-w-sm lg:max-w-md">
              <div className="h-8 w-8 sm:h-10 sm:w-10 absolute left-2 sm:left-3 md:left-3 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-sm border border-neutral-200 dark:border-neutral-700">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
              </div>
              <div className="flex flex-col items-start gap-2 sm:gap-3 md:gap-5 w-full">
                <h3 className="hidden md:block text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl md:pl-16 lg:pl-20 font-bold text-neutral-500 dark:text-neutral-500 leading-tight">
                  {item.title}
                </h3>
                <p className="hidden md:block text-muted-foreground text-xs lg:text-sm md:pl-16 lg:pl-20 font-mono tracking-tight leading-relaxed max-w-md">
                  {item.reason}
                </p>
              </div>
            </div>

            <div className="relative pl-12 sm:pl-16 md:pl-4 pr-4 w-full">
              <div className="md:hidden mb-4 space-y-2">
                <h3 className="block text-xl sm:text-2xl text-left font-bold text-neutral-500 dark:text-neutral-500 leading-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm font-mono tracking-tight leading-relaxed">
                  {item.reason}
                </p>
              </div>
              <div className="w-full">{item.content}</div>
            </div>
          </div>
        ))}
        {height > 0 && (
          <div
            style={{
              height: height + "px",
            }}
            className="absolute left-6 sm:left-8 md:left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
