import { BACKGROUND_TASK_STATUSES } from "./constants";
import type { BackgroundTask, BackgroundTaskPollingState } from "./types";

const REFETCH_DELAYS = [
  1,
  1,
  3,
  6,
  ...Array(50).fill(10),
  30,
  60,
  120,
  180,
].map((second) => second * 1000);

export const getPollingState = ({
  task,
  startTime,
  maxRefetchDuration,
  refetchCount,
}: {
  task: BackgroundTask;
  startTime: number;
  maxRefetchDuration?: number | null;
  refetchCount: number;
}): BackgroundTaskPollingState => {
  const elapsedMs = Date.now() - startTime;

  const isCompleted =
    task.status === BACKGROUND_TASK_STATUSES.SUCCEEDED ||
    task.status === BACKGROUND_TASK_STATUSES.FAILED;

  const hasTimeout =
    !isCompleted &&
    (refetchCount >= REFETCH_DELAYS.length ||
      (maxRefetchDuration != null && elapsedMs >= maxRefetchDuration * 1000));

  const nextDelay =
    isCompleted || hasTimeout ? false : REFETCH_DELAYS[refetchCount];

  return {
    active: nextDelay !== false,
    hasTimeout,
    nextDelay,
    elapsedMs,
    refetchCount,
  };
};

export type DetailQueryMeta = {
  startTime?: number;
};

export const isDetailQueryMeta = (meta: unknown): meta is DetailQueryMeta => {
  return (
    typeof meta === "object" &&
    meta !== null &&
    (!("startTime" in meta) ||
      typeof (meta as { startTime: unknown }).startTime === "number")
  );
};
