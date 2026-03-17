import { generateEvent } from "@bsport/analytics";

import { sessionUpdateRestoreButtonClickedEventSchema } from "./schemas";

export const sessionUpdateRestoreButtonClickedEvent = generateEvent(
  sessionUpdateRestoreButtonClickedEventSchema,
);
