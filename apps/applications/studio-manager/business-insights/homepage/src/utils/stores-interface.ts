import type { ManagerSession } from "@bsport/api-book";
import type { Teacher } from "@bsport/api-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import {
  selectManagerSessions,
  useSessionStore,
} from "@bsport/store-booking-session";
import {
  type SubstitutionRequest,
  selectSubstitutionRequestsBySessionId,
  useSubstitutionStore,
} from "@bsport/store-booking-substitution";
import {
  selectTeachersById,
  useTeacherStore,
} from "@bsport/store-core-data-teacher";

export type SessionWithTeacher = ManagerSession & {
  teacher?: Teacher;
  teacherOverride?: Teacher;
  substitutionRequests: SubstitutionRequest[];
};

export const useSessionsWithTeacher = (): SessionWithTeacher[] => {
  const sessions = useSessionStore(selectManagerSessions);
  const teachersById = useTeacherStore(selectTeachersById);
  const requestsBySessionId = useSubstitutionStore(
    selectSubstitutionRequestsBySessionId,
  );

  return sessions.map((session) => {
    return {
      ...session,
      teacher: teachersById[session.coach],
      teacherOverride: session.coach_override
        ? teachersById[session.coach_override]
        : undefined,
      substitutionRequests: requestsBySessionId.get(session.id) ?? [],
    };
  });
};

export const useCompanyTimezone = () => {
  return dataAccessLayer.useCompanyTheme()?.timezone_name;
};
