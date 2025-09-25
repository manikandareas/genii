import { Input } from "@/features/shared/components/ui/input";
import { Button } from "@/features/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface ListToolbarProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function ListToolbar({
  value,
  onValueChange,
  placeholder = "Search...",
  className,
  actions,
}: ListToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
        />
        {value ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onValueChange("")}
            className="text-sm text-muted-foreground"
          >
            Clear
          </Button>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
