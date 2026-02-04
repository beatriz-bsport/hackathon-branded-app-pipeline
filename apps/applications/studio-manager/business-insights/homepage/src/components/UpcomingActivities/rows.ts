import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import {
  useCompanyTimezone,
  useSessionsWithTeacher,
} from "#src/utils/stores-interface";

import type { TableRowData } from "./types";

export const useUpcomingActivitiesRows = (): Array<TableRowData> => {
  const { i18n } = useTranslation("default");
  const sessions = useSessionsWithTeacher();
  const today = new Date();
  const companyTimezone = useCompanyTimezone();

  return sessions.map((session) => {
    return {
      id: session.id,
      activityDate: formatDateTime(
        session.date_start,
        DATETIME_FORMATS.SCHEDULE,
        { locale: i18n.language, timeZone: companyTimezone },
      ),
      activityName: session.name,
      teacherName: session.teacher?.name ?? "",
      teacherSubstituteName: session.teacherOverride?.name,
      teacherSubstituteRequired: session.substitutionRequests.length > 0,
      fillRate:
        session.effectif > 0
          ? Math.round((100 * session.nb_bookings) / session.effectif)
          : 0,
      hasWaitingList: !session.waiting_list_disabled,
      waitingListCount: session.nb_option,
      emptySpotsCount: Math.max(0, session.effectif - session.nb_bookings),
      link: LEGACY_URLS.CALENDAR_OFFER({
        isoDate: formatDateTime(
          today.toISOString(),
          DATETIME_FORMATS.ISO_DATE,
          { timeZone: companyTimezone },
        ),
        sessionId: session.id,
      }),
    };
  });
};
