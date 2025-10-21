import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { useSessionsWithTeacher } from "#src/utils/stores-interface";

import type { TableRowData } from "./types";

export const useUpcomingActivitiesRows = (): Array<TableRowData> => {
  const { i18n } = useTranslation("default");
  const sessions = useSessionsWithTeacher();
  const today = new Date();

  return sessions.map((session) => {
    return {
      id: session.id,
      activityDate: new Date(session.date_start).toLocaleDateString(
        [i18n.language],
        {
          hour: "numeric",
          minute: "numeric",
          day: "numeric",
        },
      ),
      activityName: session.name,
      teacherName: session.teacher?.name ?? "",
      teacherSubstituteName: session.teacherOverride?.name,
      teacherSubstituteRequired: session.substitutionRequests.length > 0,
      fillRate:
        session.effectif > 0
          ? (100 * session.nb_bookings) / session.effectif
          : 0,
      hasWaitingList: !session.waiting_list_disabled,
      waitingListCount: session.nb_option,
      emptySpotsCount: Math.max(0, session.effectif - session.nb_bookings),
      link: LEGACY_URLS.CALENDAR_OFFER({
        date: today,
        sessionId: session.id,
      }),
    };
  });
};
