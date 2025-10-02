import { cn } from "@/lib/utils";
import { Pyramid } from "lucide-react";

export const Logo = ({ className }: { className?: string }) => {
  return <Pyramid size={24} className={cn("", className)} />;
};
