"use client";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type SectionAskContext = {
  lessonId: string;
  sectionKey?: string;
  title?: string;
  content?: string;
} | null;

export type SectionHistorySelection = {
  lessonId: string;
  sectionKey: string;
  title?: string;
} | null;

export interface SectionAskContextValue {
  context: SectionAskContext;
  setContext: (context: SectionAskContext) => void;
  clearContext: () => void;
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  setHistorySections: (sectionKeys: Array<string | null | undefined>) => void;
  hasHistory: (sectionKey?: string | null) => boolean;
  historySelection: SectionHistorySelection;
  openHistory: (selection: NonNullable<SectionHistorySelection>) => void;
  clearHistorySelection: () => void;
}

export const SectionAskContext = createContext<
  SectionAskContextValue | undefined
>(undefined);

export function SectionAskProvider({ children }: { children: ReactNode }) {
  const [context, setContextState] = useState<SectionAskContext>(null);
  const [isDialogOpen, setDialogOpenState] = useState(false);
  const [historySections, setHistorySectionsState] = useState<Set<string>>(
    () => new Set(),
  );
  const [historySelection, setHistorySelection] =
    useState<SectionHistorySelection>(null);

  const setContext = useCallback((value: SectionAskContext) => {
    setHistorySelection(null);
    setContextState(value);
  }, []);

  const clearContext = useCallback(() => {
    setContextState(null);
  }, []);

  const setDialogOpen = useCallback((open: boolean) => {
    setDialogOpenState(open);
  }, []);

  const setHistorySections = useCallback(
    (sectionKeys: Array<string | null | undefined>) => {
      setHistorySectionsState((prev) => {
        const next = new Set(
          sectionKeys.filter((key): key is string => Boolean(key)),
        );

        if (prev.size === next.size) {
          let isSame = true;
          for (const key of prev) {
            if (!next.has(key)) {
              isSame = false;
            }
          }
          for (const key of next) {
            if (!prev.has(key)) {
              isSame = false;
            }
          }

          if (isSame) {
            return prev;
          }
        }

        return next;
      });
    },
    [],
  );

  const hasHistory = useCallback(
    (sectionKey?: string | null) => {
      if (!sectionKey) {
        return false;
      }
      return historySections.has(sectionKey);
    },
    [historySections],
  );

  const openHistory = useCallback(
    (selection: NonNullable<SectionHistorySelection>) => {
      setContextState(null);
      setHistorySelection({ ...selection });
    },
    [],
  );

  const clearHistorySelection = useCallback(() => {
    setHistorySelection(null);
  }, []);

  const value = useMemo(
    () => ({
      context,
      setContext,
      clearContext,
      isDialogOpen,
      setDialogOpen,
      setHistorySections,
      hasHistory,
      historySelection,
      openHistory,
      clearHistorySelection,
    }),
    [
      clearContext,
      context,
      historySelection,
      hasHistory,
      isDialogOpen,
      openHistory,
      setContext,
      setDialogOpen,
      setHistorySections,
      clearHistorySelection,
    ],
  );

  return (
    <SectionAskContext.Provider value={value}>
      {children}
    </SectionAskContext.Provider>
  );
}

export function useSectionAsk() {
  const ctx = useContext(SectionAskContext);
  if (!ctx) {
    throw new Error("useSectionAsk must be used within a SectionAskProvider");
  }
  return ctx;
}
