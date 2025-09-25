import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  Cloud,
  Code,
  Cog,
  Palette,
  Shield,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ONBOARDING_COPY } from "@/features/user/onboarding/constants/onboarding-copy";
import { cn } from "@/lib/utils";

export interface FocusArea {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  quote: string;
}

interface FocusSelectionCardsProps {
  areas?: FocusArea[];
  selectedValues?: string[];
  onValueChange?: (values: string[]) => void;
  className?: string;
  maxSelection?: number;
}

const getIconForFocusArea = (id: string) => {
  switch (id) {
    case "web-development":
      return <Code className="h-5 w-5" />;
    case "mobile-development":
      return <Smartphone className="h-5 w-5" />;
    case "data-science":
      return <BarChart3 className="h-5 w-5" />;
    case "ai-machine-learning":
      return <Brain className="h-5 w-5" />;
    case "cybersecurity":
      return <Shield className="h-5 w-5" />;
    case "cloud-computing":
      return <Cloud className="h-5 w-5" />;
    case "devops":
      return <Cog className="h-5 w-5" />;
    case "ui-ux-design":
      return <Palette className="h-5 w-5" />;
    default:
      return <Code className="h-5 w-5" />;
  }
};

const defaultFocusAreas: FocusArea[] = ONBOARDING_COPY.focusAreas.map(
  (area) => ({
    ...area,
    icon: getIconForFocusArea(area.id),
    category: area.id.includes("development")
      ? "Development"
      : area.id.includes("design")
        ? "Design"
        : area.id.includes("data")
          ? "Analytics"
          : area.id.includes("cloud") || area.id.includes("devops")
            ? "Infrastructure"
            : "Technology",
  }),
);

export function FocusSelectionCards({
  areas = defaultFocusAreas,
  selectedValues = [],
  onValueChange,
  className,
  maxSelection = 3,
}: FocusSelectionCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showQuote, setShowQuote] = useState<string | null>(null);

  const handleCardClick = (areaId: string) => {
    const newSelectedValues = [...selectedValues];
    const index = newSelectedValues.indexOf(areaId);

    if (index > -1) {
      // Remove if already selected
      newSelectedValues.splice(index, 1);
    } else {
      // Add if not selected
      if (newSelectedValues.length >= maxSelection) {
        toast.error("Aduh, pilih area fokus maksimal 3 ya!");
        return;
      }

      newSelectedValues.push(areaId);
    }

    if (newSelectedValues.length > maxSelection) {
      newSelectedValues.pop();
    }

    onValueChange?.(newSelectedValues);

    // Show feedback quote for newly selected items
    if (index === -1) {
      const selectedArea = areas.find((area) => area.id === areaId);
      if (selectedArea?.quote) {
        setShowQuote(selectedArea.quote);
      }
    }
  };

  const isSelected = (areaId: string) => selectedValues.includes(areaId);

  return (
    <div className={cn("w-full", className)}>
      {/* Feedback quote tooltip */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-accent bg-accent/20 p-4 text-accent-foreground"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm italic">{showQuote}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {areas.map((area, index) => {
          const selected = isSelected(area.id);
          const hovered = hoveredCard === area.id;

          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              key={area.id}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <motion.div
                className={cn(
                  "group relative h-full cursor-pointer rounded-xl border-2 bg-white/5 p-3 transition-all duration-200 hover:shadow-lg sm:p-4",
                  selected
                    ? "border-accent bg-accent/20 shadow-md"
                    : "border-border hover:border-accent/50",
                )}
                onClick={() => handleCardClick(area.id)}
                onMouseEnter={() => setHoveredCard(area.id)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selection indicator */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent"
                      exit={{ scale: 0, opacity: 0 }}
                      initial={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 0 }}
                        className="h-3 w-3 rounded-full bg-accent-foreground"
                        initial={{ rotate: -90 }}
                        transition={{ delay: 0.1 }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content */}
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors sm:h-10 sm:w-10",
                      selected
                        ? "bg-accent text-accent-foreground"
                        : "bg-white/10 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent",
                    )}
                  >
                    {area.icon}
                  </div>

                  <div className="space-y-1">
                    <h3
                      className={cn(
                        "font-semibold text-sm transition-colors",
                        selected ? "text-accent" : "text-foreground",
                      )}
                    >
                      {area.title}
                    </h3>
                    <p className="line-clamp-2 text-muted-foreground text-xs">
                      {area.description}
                    </p>
                    <span className="inline-block rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                      {area.category}
                    </span>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <AnimatePresence>
                  {hovered && !selected && (
                    <motion.div
                      animate={{ opacity: 1 }}
                      className="pointer-events-none absolute inset-0 rounded-xl bg-accent/5"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
