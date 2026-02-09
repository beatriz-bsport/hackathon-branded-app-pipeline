import { generateSafeEvent } from "#src/utils/generate-safe-events";

import {
  sessionListAttendanceButtonClickedEventSchema,
  sessionListCalendarViewChangedEventSchema,
  sessionListCancelMultipleSessionTimePeriodSelectedEventSchema,
  sessionListCancelMultipleSessionsConfirmButtonClickedEventSchema,
  sessionListDashboardButtonClickedEventSchema,
  sessionListDisplayCancelledSessionClickedEventSchema,
  sessionListExportParticipantConfirmButtonClickedEventSchema,
  sessionListFiltersChangedEventSchema,
  sessionListSearchChangedEventSchema,
  sessionListSearchClearedEventSchema,
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

export const sessionListCancelMultipleSessionsConfirmButtonClickedEvent =
  generateSafeEvent(
    sessionListCancelMultipleSessionsConfirmButtonClickedEventSchema,
  );

export const sessionListCancelMultipleSessionTimePeriodSelectedEvent =
  generateSafeEvent(
    sessionListCancelMultipleSessionTimePeriodSelectedEventSchema,
  );

export const sessionListSearchChangedEvent = generateSafeEvent(
  sessionListSearchChangedEventSchema,
);

export const sessionListSearchClearedEvent = generateSafeEvent(
  sessionListSearchClearedEventSchema,
);

export const sessionListAttendanceButtonClickedEvent = generateSafeEvent(
  sessionListAttendanceButtonClickedEventSchema,
);
