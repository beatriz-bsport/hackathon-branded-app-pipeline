import { generateEvent } from "@bsport/analytics";

import {
  sessionUpdateCancelButtonClickedEventSchema,
  sessionUpdateCopyLinkButtonClickedEventSchema,
  sessionUpdateDuplicateButtonClickedEventSchema,
  sessionUpdateRestoreButtonClickedEventSchema,
} from "./schemas";

export const sessionUpdateRestoreButtonClickedEvent = generateEvent(
  sessionUpdateRestoreButtonClickedEventSchema,
);

export const sessionUpdateCancelButtonClickedEvent = generateEvent(
  sessionUpdateCancelButtonClickedEventSchema,
);

export const sessionUpdateCopyLinkButtonClickedEvent = generateEvent(
  sessionUpdateCopyLinkButtonClickedEventSchema,
);

export const sessionUpdateDuplicateButtonClickedEvent = generateEvent(
  sessionUpdateDuplicateButtonClickedEventSchema,
);
