import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Eye, Globe, MessageCircle, Users } from "lucide-react";
import { useState } from "react";
import { ONBOARDING_COPY } from "@/features/user/onboarding/constants/onboarding-copy";
import { cn } from "@/lib/utils";

export interface LanguageOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  quote: string;
}

export interface ExampleMaterial {
  topic: string;
  content: string;
  highlight: string;
}

export interface StyleOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  quote: string;
  exampleMaterial?: ExampleMaterial;
}

interface LanguageStyleCardsProps {
  languageOptions?: LanguageOption[];
  styleOptions?: StyleOption[];
  selectedLanguage?: string;
  selectedStyle?: string;
  onLanguageChange?: (value: string) => void;
  onStyleChange?: (value: string) => void;
  className?: string;
}

const defaultLanguageOptions: LanguageOption[] = ONBOARDING_COPY.languages.map(
  (lang) => ({
    value: lang.id,
    label: lang.title,
    icon: <Globe className="h-5 w-5" />,
    quote: lang.quote,
  }),
);

const getIconForStyle = (id: string) => {
  switch (id) {
    case "simple":
      return <MessageCircle className="h-5 w-5" />;
    case "detailed":
      return <BookOpen className="h-5 w-5" />;
    case "visual":
      return <Eye className="h-5 w-5" />;
    case "analogy":
      return <Users className="h-5 w-5" />;
    default:
      return <MessageCircle className="h-5 w-5" />;
  }
};

const defaultStyleOptions: StyleOption[] =
  ONBOARDING_COPY.explanationStyles.map((style) => ({
    value: style.id,
    label: style.title,
    description: style.description,
    icon: getIconForStyle(style.id),
    quote: style.quote,
    exampleMaterial: style.exampleMaterial,
  }));

export function LanguageStyleCards({
  languageOptions = defaultLanguageOptions,
  styleOptions = defaultStyleOptions,
  selectedLanguage,
  selectedStyle,
  onLanguageChange,
  onStyleChange,
  className,
}: LanguageStyleCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showQuote, setShowQuote] = useState<string | null>(null);
  const [showExampleMaterial, setShowExampleMaterial] =
    useState<ExampleMaterial | null>(null);

  const handleLanguageClick = (value: string) => {
    if (selectedLanguage === value) return;

    onLanguageChange?.(value);

    const selectedOption = languageOptions.find((opt) => opt.value === value);
    if (selectedOption?.quote) {
      setShowQuote(selectedOption.quote);
    }
  };

  const handleStyleClick = (value: string) => {
    if (selectedStyle === value) return;

    onStyleChange?.(value);

    const selectedOption = styleOptions.find((opt) => opt.value === value);
    if (selectedOption?.quote) {
      setShowQuote(selectedOption.quote);
    }
    if (selectedOption?.exampleMaterial) {
      setShowExampleMaterial(selectedOption.exampleMaterial);
    }
  };

  return (
    <div className={cn("w-full space-y-6 sm:space-y-8", className)}>
      {/* Feedback quote tooltip */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-accent bg-accent/20 p-4 text-accent-foreground"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm italic">{showQuote}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat bubble for example material */}
      <AnimatePresence>
        {showExampleMaterial && (
          <motion.div
            animate={{ opacity: 1, x: 0, y: 0 }}
            className="fixed inset-x-4 bottom-28 z-50 max-w-lg sm:bottom-8 sm:left-auto sm:right-6 sm:inset-x-auto sm:max-w-md"
            exit={{ opacity: 0, x: 20, y: 10 }}
            initial={{ opacity: 0, x: 20, y: 10 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Chat bubble container */}
            <div className="relative rounded-2xl border border-border bg-card p-4 shadow-xl backdrop-blur-sm">
              {/* Chat bubble tail */}
              <div className="-bottom-2 absolute left-8 h-4 w-4 rotate-45 border-border border-r border-b bg-card sm:right-8 sm:left-auto" />

              {/* Avatar and header */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                  <svg
                    className="h-4 w-4 text-accent-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <title>Learning Assistant</title>
                    <path d="M10 2L13 8h6l-5 4 2 6-6-4-6 4 2-6-5-4h6l3-6z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground text-xs">
                    Contoh Pembelajaran
                  </p>
                  <h4 className="font-semibold text-foreground text-sm">
                    {showExampleMaterial.topic}
                  </h4>
                </div>

                {/* Close button */}
                <button
                  aria-label="Tutup contoh"
                  className="ml-auto rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setShowExampleMaterial(null)}
                  type="button"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <title>Close</title>
                    <path
                      clipRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      fillRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-foreground text-sm leading-relaxed">
                    {showExampleMaterial.content}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center rounded-full bg-accent px-2 py-1 font-medium text-accent-foreground text-xs">
                    ✨ {showExampleMaterial.highlight}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Selection */}
      <div className="space-y-4">
        <h3 className="font-medium text-base text-foreground">
          Preferensi Bahasa
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {languageOptions.map((option, index) => {
            const selected = selectedLanguage === option.value;
            const hovered = hoveredCard === `lang-${option.value}`;

            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                key={option.value}
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
                    "group relative cursor-pointer rounded-xl border-2 bg-white/5 p-3 transition-all duration-200 hover:shadow-lg sm:p-4",
                    selected
                      ? "border-accent bg-accent/20 shadow-md"
                      : "border-border hover:border-accent/50",
                  )}
                  onClick={() => handleLanguageClick(option.value)}
                  onMouseEnter={() => setHoveredCard(`lang-${option.value}`)}
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

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors sm:h-10 sm:w-10",
                        selected
                          ? "bg-accent text-accent-foreground"
                          : "bg-white/10 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent",
                      )}
                    >
                      {option.icon}
                    </div>
                    <span
                      className={cn(
                        "font-medium transition-colors",
                        selected ? "text-accent" : "text-foreground",
                      )}
                    >
                      {option.label}
                    </span>
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

      {/* Style Selection */}
      <div className="space-y-4">
        <h3 className="font-medium text-base text-foreground">
          Gaya Penjelasan
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {styleOptions.map((option, index) => {
            const selected = selectedStyle === option.value;
            const hovered = hoveredCard === `style-${option.value}`;

            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                key={option.value}
                transition={{
                  duration: 0.3,
                  delay: (index + languageOptions.length) * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <motion.div
                  className={cn(
                    "group relative cursor-pointer rounded-xl border-2 bg-white/5 p-3 transition-all duration-200 hover:shadow-lg sm:p-4",
                    selected
                      ? "border-accent bg-accent/20 shadow-md"
                      : "border-border hover:border-accent/50",
                  )}
                  onClick={() => handleStyleClick(option.value)}
                  onMouseEnter={() => setHoveredCard(`style-${option.value}`)}
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

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors sm:h-10 sm:w-10",
                        selected
                          ? "bg-accent text-accent-foreground"
                          : "bg-white/10 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent",
                      )}
                    >
                      {option.icon}
                    </div>
                    <div className="space-y-1">
                      <h4
                        className={cn(
                          "font-semibold transition-colors",
                          selected ? "text-accent" : "text-foreground",
                        )}
                      >
                        {option.label}
                      </h4>
                      <p
                        className={cn(
                          "text-sm transition-colors",
                          selected ? "text-accent/80" : "text-muted-foreground",
                        )}
                      >
                        {option.description}
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
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
