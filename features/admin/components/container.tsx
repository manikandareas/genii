import { cn } from "@/lib/utils";
import React from "react";

type Props = React.ComponentProps<"main">;

export default function AdminContainer({
  children,
  className,
  ...props
}: Props) {
  return (
    <main
      className={cn("w-full max-w-6xl mx-auto py-12 px-6", className)}
      {...props}
    >
      {children}
    </main>
  );
}
