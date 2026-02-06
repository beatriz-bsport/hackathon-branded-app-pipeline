import { generateSafeEvent } from "#src/utils/generate-safe-events";

import { sessionListViewedEventSchema } from "./schemas";

export const sessionListViewedEvent = generateSafeEvent(
  sessionListViewedEventSchema,
);
