import { generateSafeEvent } from "#src/utils/generate-safe-events";

import {
  aggregatorChipsStatusEventSchema,
  aggregatorToggleStatusEventSchema,
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
  spotCappingRadioButtonEventSchema,
} from "./schemas";

export const sessionCreationOpensEvent = generateSafeEvent(
  sessionCreationOpensEventSchema,
);

export const sessionCreationActivitySelectedEvent = generateSafeEvent(
  sessionCreationActivitySelectedEventSchema,
);

export const sessionCreationCloseButtonClickedEvent = generateSafeEvent(
  sessionCreationCloseButtonClickedEventSchema,
);

export const sessionCreationBackClickedEvent = generateSafeEvent(
  sessionCreationBackClickedEventSchema,
);

export const sessionCreationNextClickedEvent = generateSafeEvent(
  sessionCreationNextClickedEventSchema,
);

export const sessionCreationCreateSessionButtonClickedEvent = generateSafeEvent(
  sessionCreationCreateSessionButtonClickedEventSchema,
);

export const sessionCreationCustomizeNameToggleEnabledEvent = generateSafeEvent(
  sessionCreationCustomizeNameToggleEnabledEventSchema,
);

export const sessionCreationVisibilitySelectEvent = generateSafeEvent(
  sessionCreationVisibilitySelectEventSchema,
);

export const sessionCreationRecurrenceToggleEnabledEvent = generateSafeEvent(
  sessionCreationRecurrenceToggleEnabledEventSchema,
);

export const sessionCreationRecurrenceIntervalEvent = generateSafeEvent(
  sessionCreationRecurrenceIntervalEventSchema,
);

export const sessionCreationRecurrenceRuleSelectedEvent = generateSafeEvent(
  sessionCreationRecurrenceRuleSelectedEventSchemas,
);

export const spotCappingRadioButtonEvent = generateSafeEvent(
  spotCappingRadioButtonEventSchema,
);

export const aggregatorChipsStatusEvent = generateSafeEvent(
  aggregatorChipsStatusEventSchema,
);

export const aggregatorToggleStatusEvent = generateSafeEvent(
  aggregatorToggleStatusEventSchema,
);
