import { generateEvent } from "@bsport/analytics";

import {
  sessionCreationActivitySelectedEventSchema,
  sessionCreationBackClickedEventSchema,
  sessionCreationCloseButtonClickedEventSchema,
  sessionCreationCreateSessionButtonClickedEventSchema,
  sessionCreationCustomizeNameToggleEnabledEventSchema,
  sessionCreationNextClickedEventSchema,
  sessionCreationOpensEventSchema,
  sessionCreationRecurrenceIntervalEventSchema,
  sessionCreationRecurrenceRuleSelectedEventSchemas,
  sessionCreationRecurrenceToggleEnabledEventSchema,
  sessionCreationVisibilitySelectEventSchema,
} from "./schemas";

export const sessionCreationOpensEvent = generateEvent(
  sessionCreationOpensEventSchema,
);

export const sessionCreationActivitySelectedEvent = generateEvent(
  sessionCreationActivitySelectedEventSchema,
);

export const sessionCreationCloseButtonClickedEvent = generateEvent(
  sessionCreationCloseButtonClickedEventSchema,
);

export const sessionCreationBackClickedEvent = generateEvent(
  sessionCreationBackClickedEventSchema,
);

export const sessionCreationNextClickedEvent = generateEvent(
  sessionCreationNextClickedEventSchema,
);

export const sessionCreationCreateSessionButtonClickedEvent = generateEvent(
  sessionCreationCreateSessionButtonClickedEventSchema,
);

export const sessionCreationCustomizeNameToggleEnabledEvent = generateEvent(
  sessionCreationCustomizeNameToggleEnabledEventSchema,
);

export const sessionCreationVisibilitySelectEvent = generateEvent(
  sessionCreationVisibilitySelectEventSchema,
);

export const sessionCreationRecurrenceToggleEnabledEvent = generateEvent(
  sessionCreationRecurrenceToggleEnabledEventSchema,
);

export const sessionCreationRecurrenceIntervalEvent = generateEvent(
  sessionCreationRecurrenceIntervalEventSchema,
);

export const sessionCreationRecurrenceRuleSelectedEvent = generateEvent(
  sessionCreationRecurrenceRuleSelectedEventSchemas,
);
