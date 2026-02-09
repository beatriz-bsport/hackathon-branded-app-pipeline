import { generateSafeEvent } from "#src/utils/generate-safe-events";

import {
  sessionListCalendarViewChangedEventSchema,
  sessionListDashboardButtonClickedEventSchema,
  sessionListDisplayCancelledSessionClickedEventSchema,
  sessionListExportParticipantConfirmButtonClickedEventSchema,
  sessionListFiltersChangedEventSchema,
  sessionListSessionClickedEventSchema,
  sessionListViewedEventSchema,
  sessionListVisibleColumnsClickedEventSchema,
} from "./schemas";

export const sessionListViewedEvent = generateSafeEvent(
  sessionListViewedEventSchema,
);

export const sessionListCalendarViewChangedEvent = generateSafeEvent(
  sessionListCalendarViewChangedEventSchema,
);

export const sessionListVisibleColumnsClickedEvent = generateSafeEvent(
  sessionListVisibleColumnsClickedEventSchema,
);

export const sessionListDisplayCancelledSessionClickedEvent = generateSafeEvent(
  sessionListDisplayCancelledSessionClickedEventSchema,
);

export const sessionListFiltersChangedEvent = generateSafeEvent(
  sessionListFiltersChangedEventSchema,
);

export const sessionListDashboardButtonClickedEvent = generateSafeEvent(
  sessionListDashboardButtonClickedEventSchema,
);

export const sessionListSessionClickedEvent = generateSafeEvent(
  sessionListSessionClickedEventSchema,
);

export const sessionListExportParticipantConfirmButtonClickedEvent =
  generateSafeEvent(
    sessionListExportParticipantConfirmButtonClickedEventSchema,
  );
