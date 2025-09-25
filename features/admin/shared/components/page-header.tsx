import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/features/shared/components/ui/button";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    variant?: React.ComponentProps<typeof Button>["variant"];
  };
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4 border-b border-border pb-6", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className={cn(buttonVariants({ variant: action.variant ?? "default" }))}
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      {children}
    </div>
  );
}
