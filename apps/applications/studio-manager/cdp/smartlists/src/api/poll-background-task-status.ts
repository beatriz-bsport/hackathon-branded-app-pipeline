import { getBackgroundTaskStatus } from "./api";
import { BackgroundTaskStatus } from "./constants";
import { BackgroundTaskStatusResponse } from "./types";

const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 15_000;
const BACKOFF_MULTIPLIER = 2;
const MAX_TOTAL_WAIT_MS = 5 * 60 * 1_000; // 5 minutes

/**
 * Throws an error if the timeout has been exceeded
 */
function checkTimeout(startedAt: number): void {
  if (Date.now() - startedAt > MAX_TOTAL_WAIT_MS) {
    throw new Error("Report generation timed out after 5 minutes");
  }
}

export async function pollBackgroundTaskStatusUntilDone(
  taskId: string,
): Promise<string> {
  const startedAt = Date.now();
  let attempt = 0;

  // Fetch current status
  let status: BackgroundTaskStatusResponse | null =
    await getBackgroundTaskStatus(taskId);
  // Use infinite loop with explicit breaks for clearer control flow
  while (
    status &&
    status.status !== BackgroundTaskStatus.SUCCESS &&
    status.status !== BackgroundTaskStatus.FAILED
  ) {
    // Check timeout before making any API call
    checkTimeout(startedAt);
    status = await getBackgroundTaskStatus(taskId);

    // Check timeout after API call (in case the call took a long time)
    checkTimeout(startedAt);

    // Handle terminal states immediately
    if (status.status === BackgroundTaskStatus.SUCCESS) {
      return status.return_value as string;
    }

    if (status.status === BackgroundTaskStatus.FAILED) {
      throw new Error("Report generation failed");
    }

    // If still pending, wait before next poll
    // Calculate exponential backoff delay
    const delay = Math.min(
      BASE_DELAY_MS * BACKOFF_MULTIPLIER ** attempt,
      MAX_DELAY_MS,
    );

    // Check timeout before sleeping
    checkTimeout(startedAt);

    // Sleep with timeout-aware delay (don't sleep longer than remaining time)
    const elapsed = Date.now() - startedAt;
    const remainingTime = MAX_TOTAL_WAIT_MS - elapsed;
    const actualDelay = Math.min(delay, remainingTime);

    // If no time remaining, throw timeout immediately
    if (actualDelay <= 0) {
      throw new Error("Report generation timed out after 5 minutes");
    }

    await sleep(actualDelay);
    attempt++;
  }
  return status.return_value as string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
