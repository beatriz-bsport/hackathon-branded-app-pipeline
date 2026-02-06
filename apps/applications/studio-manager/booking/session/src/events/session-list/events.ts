import { generateSafeEvent } from "#src/utils/generate-safe-events";

import {
  sessionListCalendarViewChangedEventSchema,
  sessionListViewedEventSchema,
} from "./schemas";

export const sessionListViewedEvent = generateSafeEvent(
  sessionListViewedEventSchema,
);

export const sessionListCalendarViewChangedEvent = generateSafeEvent(
  sessionListCalendarViewChangedEventSchema,
);
