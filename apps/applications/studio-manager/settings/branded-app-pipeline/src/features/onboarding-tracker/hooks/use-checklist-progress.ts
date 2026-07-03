import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "brandedAppPipeline.onboardingTracker.checklistProgress";

const readCompletedIds = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<
      string,
      boolean
    >;
  } catch {
    return {};
  }
};

export const useChecklistProgress = () => {
  const [completedIds, setCompletedIds] =
    useState<Record<string, boolean>>(readCompletedIds);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
  }, [completedIds]);

  const toggleItem = useCallback((id: string) => {
    setCompletedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const isCompleted = useCallback(
    (id: string) => Boolean(completedIds[id]),
    [completedIds],
  );

  return { completedIds, isCompleted, toggleItem };
};
