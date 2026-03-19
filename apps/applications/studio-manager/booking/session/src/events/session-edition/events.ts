import { generateEvent } from "@bsport/analytics";

import {
  sessionUpdateCancelButtonClickedEventSchema,
  sessionUpdateCopyLinkButtonClickedEventSchema,
  sessionUpdateCreditsUpdatedEventSchema,
  sessionUpdateDateStartUpdatedEventSchema,
  sessionUpdateDuplicateButtonClickedEventSchema,
  sessionUpdateDurationUpdatedEventSchema,
  sessionUpdateRestoreButtonClickedEventSchema,
  sessionUpdateUpdatedEventSchema,
  sessionUpdateWaitingListMaxSizeUpdatedEventSchema,
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

export const sessionUpdateUpdatedEvent = generateEvent(
  sessionUpdateUpdatedEventSchema,
);
export const sessionUpdateWaitingListMaxSizeUpdatedEvent = generateEvent(
  sessionUpdateWaitingListMaxSizeUpdatedEventSchema,
);
export const sessionUpdateCreditsUpdatedEvent = generateEvent(
  sessionUpdateCreditsUpdatedEventSchema,
);
export const sessionUpdateDateStartUpdatedEvent = generateEvent(
  sessionUpdateDateStartUpdatedEventSchema,
);
export const sessionUpdateDurationUpdatedEvent = generateEvent(
  sessionUpdateDurationUpdatedEventSchema,
);
