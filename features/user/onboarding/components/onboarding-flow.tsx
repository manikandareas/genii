"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useController, useForm, type Control } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { Button } from "@/features/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { FocusSelectionCards } from "@/features/user/onboarding/components/focus-selection-cards";
import { LanguageStyleCards } from "@/features/user/onboarding/components/language-style-cards";
import { LevelSelectionCards } from "@/features/user/onboarding/components/level-selection-cards";
import { ONBOARDING_COPY } from "@/features/user/onboarding/constants/onboarding-copy";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { Progress } from "@/features/shared/components/ui/progress";

const formSchema = z.object({
  learningGoals: z
    .array(z.string())
    .min(1, { message: ONBOARDING_COPY.validation.focusRequired })
    .max(3, { message: ONBOARDING_COPY.validation.focusTooLong }),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    error: ONBOARDING_COPY.validation.levelRequired,
  }),
  languagePreference: z.enum(["id", "en", "mix"], {
    error: ONBOARDING_COPY.validation.languageRequired,
  }),
  explanationStyle: z
    .string()
    .min(1, { message: ONBOARDING_COPY.validation.styleRequired }),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  {
    id: 1,
    name: ONBOARDING_COPY.steps.focus.name,
    description: ONBOARDING_COPY.steps.focus.description,
  },
  {
    id: 2,
    name: ONBOARDING_COPY.steps.level.name,
    description: ONBOARDING_COPY.steps.level.description,
  },
  {
    id: 3,
    name: ONBOARDING_COPY.steps.preferences.name,
    description: ONBOARDING_COPY.steps.preferences.description,
  },
];

const getFieldsForStep = (step: number): (keyof FormValues)[] => {
  switch (step) {
    case 0:
      return ["learningGoals"];
    case 1:
      return ["level"];
    case 2:
      return ["languagePreference", "explanationStyle"];
    default:
      return [];
  }
};

export default function OnboardingFlow() {
  const router = useRouter();
  const { mutateAsync: saveOnboarding, isPending } = useMutation({
    mutationFn: useConvexMutation(api.users.mutations.saveOnboarding),
  });

  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      learningGoals: [],
      level: "beginner",
      languagePreference: "id",
      explanationStyle: "simple",
    },
  });

  const watchedValues = form.watch();

  const isStepValid = (stepIndex: number): boolean => {
    const values = watchedValues as FormValues;

    switch (stepIndex) {
      case 0:
        return (
          Array.isArray(values.learningGoals) &&
          values.learningGoals.length >= 1 &&
          values.learningGoals.length <= 3
        );
      case 1:
        return Boolean(values.level);
      case 2:
        return Boolean(values.languagePreference && values.explanationStyle);
      default:
        return true;
    }
  };

  const handleNextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(
      fields as Parameters<typeof form.trigger>[0],
      {
        shouldFocus: true,
      },
    );

    if (isValid && isStepValid(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await saveOnboarding(values);

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          startVelocity: 30,
          scalar: 0.9,
          origin: { y: 0.7 },
        });
      } catch (error) {
        console.warn("Confetti failed", error);
      }

      toast.success(ONBOARDING_COPY.success.title, {
        description: ONBOARDING_COPY.success.description,
      });

      setTimeout(() => {
        router.replace("/courses");
        router.refresh();
      }, 300);
    } catch (error) {
      console.error("Failed to save onboarding preferences", error);
      toast.error("Gagal menyimpan preferensi. Coba lagi ya.");
    }
  };

  const isCurrentStepValid = isStepValid(currentStep);

  return (
    <div className="relative flex min-h-screen flex-col justify-start px-4 pb-20 pt-12 sm:px-6 sm:pb-16 sm:pt-14 lg:items-center lg:justify-center lg:pb-12 xl:px-8">
      <div className="fixed w-full bottom-0 left-0 right-0">
        <Progress
          className="w-full z-10 rounded-none"
          value={(100 / steps.length) * (currentStep + 1)}
        />
      </div>
      <div className="w-full max-w-3xl">
        <div className="space-y-8 p-6 sm:p-8">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              {steps[currentStep].name}
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {steps[currentStep].description}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="relative">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -32 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {currentStep === 0 && <FocusStep control={form.control} />}
                    {currentStep === 1 && <LevelStep control={form.control} />}
                    {currentStep === 2 && (
                      <LanguageAndStyleStep control={form.control} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrevStep}
                    disabled={isPending}
                    className="w-full sm:w-auto"
                  >
                    <ChevronLeft aria-hidden="true" className="mr-2 h-4 w-4" />
                    {ONBOARDING_COPY.actions.back}
                  </Button>
                ) : (
                  <span className="hidden sm:block" />
                )}

                {currentStep < steps.length - 1 && (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isCurrentStepValid || isPending}
                    className="flex-1 sm:flex-none"
                    size="lg"
                  >
                    {ONBOARDING_COPY.actions.next}
                    <ChevronRight aria-hidden="true" className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {currentStep === steps.length - 1 && (
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 sm:flex-none"
                    disabled={isPending}
                  >
                    {isPending ? (
                      ONBOARDING_COPY.actions.saving
                    ) : (
                      <>
                        {ONBOARDING_COPY.actions.finishSetup}
                        <Check aria-hidden="true" className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

function FocusStep({ control }: { control: Control<FormValues> }) {
  return (
    <FormField
      control={control}
      name="learningGoals"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="text-left text-base font-medium">
            {ONBOARDING_COPY.labels.focusAreas}
          </FormLabel>
          <FormControl>
            <FocusSelectionCards
              selectedValues={field.value ?? []}
              onValueChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function LevelStep({ control }: { control: Control<FormValues> }) {
  return (
    <FormField
      control={control}
      name="level"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="text-left text-base font-medium">
            {ONBOARDING_COPY.labels.currentLevel}
          </FormLabel>
          <FormControl>
            <LevelSelectionCards
              selectedValue={field.value}
              onValueChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function LanguageAndStyleStep({ control }: { control: Control<FormValues> }) {
  const { field: styleField, fieldState: styleFieldState } = useController({
    name: "explanationStyle",
    control,
  });

  return (
    <FormField
      control={control}
      name="languagePreference"
      render={({ field, fieldState }) => (
        <FormItem className="space-y-6">
          <FormControl>
            <LanguageStyleCards
              selectedLanguage={field.value}
              selectedStyle={styleField.value}
              onLanguageChange={field.onChange}
              onStyleChange={styleField.onChange}
            />
          </FormControl>
          {fieldState.error ? (
            <p className="text-sm text-destructive">
              {fieldState.error.message}
            </p>
          ) : null}
          {styleFieldState.error ? (
            <p className="text-sm text-destructive">
              {styleFieldState.error.message}
            </p>
          ) : null}
        </FormItem>
      )}
    />
  );
}
