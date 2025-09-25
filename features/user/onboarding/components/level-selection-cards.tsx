import { AnimatePresence, motion } from "framer-motion";
import { Award, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { ONBOARDING_COPY } from "@/features/user/onboarding/constants/onboarding-copy";
import { cn } from "@/lib/utils";

export interface LevelOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  quote: string;
  color: string;
}

interface LevelSelectionCardsProps {
  levels?: LevelOption[];
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const getIconForLevel = (id: string) => {
  switch (id) {
    case "beginner":
      return <Sparkles className="h-6 w-6" />;
    case "intermediate":
      return <TrendingUp className="h-6 w-6" />;
    case "advanced":
      return <Award className="h-6 w-6" />;
    default:
      return <Sparkles className="h-6 w-6" />;
  }
};

const getColorForLevel = (id: string) => {
  switch (id) {
    case "beginner":
      return "green";
    case "intermediate":
      return "blue";
    case "advanced":
      return "purple";
    default:
      return "green";
  }
};

const defaultLevels: LevelOption[] = ONBOARDING_COPY.levels.map((level) => ({
  value: level.id,
  label: level.title,
  description: level.description,
  icon: getIconForLevel(level.id),
  quote: level.quote,
  color: getColorForLevel(level.id),
}));

const colorVariants = {
  green: {
    border: "border-green-500",
    bg: "bg-green-500/20",
    text: "text-green-400",
    icon: "bg-green-500 text-white",
  },
  blue: {
    border: "border-blue-500",
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    icon: "bg-blue-500 text-white",
  },
  purple: {
    border: "border-purple-500",
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    icon: "bg-purple-500 text-white",
  },
};

export function LevelSelectionCards({
  levels = defaultLevels,
  selectedValue,
  onValueChange,
  className,
}: LevelSelectionCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showQuote, setShowQuote] = useState<string | null>(null);

  const handleCardClick = (levelValue: string) => {
    if (selectedValue === levelValue) return; // Don't deselect

    onValueChange?.(levelValue);

    // Show feedback quote
    const selectedLevel = levels.find((level) => level.value === levelValue);
    if (selectedLevel?.quote) {
      setShowQuote(selectedLevel.quote);
    }
  };

  const isSelected = (levelValue: string) => selectedValue === levelValue;

  return (
    <div className={cn("w-full", className)}>
      {/* Feedback quote tooltip */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg border border-accent bg-accent/20 p-4 text-accent-foreground"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm italic">{showQuote}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {levels.map((level, index) => {
          const selected = isSelected(level.value);
          const hovered = hoveredCard === level.value;
          const colors =
            colorVariants[level.color as keyof typeof colorVariants];

          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              key={level.value}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <motion.div
                className={cn(
                  "group relative cursor-pointer rounded-xl border-2 bg-white/5 p-4 transition-all duration-200 hover:shadow-lg sm:p-5 lg:p-6",
                  selected
                    ? `${colors.border} ${colors.bg} shadow-md`
                    : "border-border hover:border-accent/50",
                )}
                onClick={() => handleCardClick(level.value)}
                onMouseEnter={() => setHoveredCard(level.value)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selection indicator */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-accent"
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
                        className="h-4 w-4 rounded-full bg-accent-foreground"
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
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12",
                      selected
                        ? colors.icon
                        : "bg-white/10 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent",
                    )}
                  >
                    {level.icon}
                  </div>

                  <div className="space-y-2">
                    <h3
                      className={cn(
                        "font-semibold text-base transition-colors sm:text-lg",
                        selected ? colors.text : "text-foreground",
                      )}
                    >
                      {level.label}
                    </h3>
                    <p
                      className={cn(
                        "text-sm leading-relaxed transition-colors",
                        selected
                          ? `${colors.text}/80`
                          : "text-muted-foreground",
                      )}
                    >
                      {level.description}
                    </p>
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

                {/* Selected background glow */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      animate={{ opacity: 0.1 }}
                      className={cn(
                        "pointer-events-none absolute inset-0 rounded-xl",
                        colors.bg,
                      )}
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
