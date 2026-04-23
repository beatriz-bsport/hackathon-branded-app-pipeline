import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import type { EnrichedAppointment } from "#src/types";

export const getAppointmentModalDescription = (
  appointment: EnrichedAppointment,
  { locale, timeZone }: { locale: string; timeZone: string | undefined },
): string =>
  `${appointment.name} - ${formatDateTime(
    appointment.date_start,
    DATETIME_FORMATS.MEDIUM_DATETIME,
    { locale, timeZone },
  )}`;
