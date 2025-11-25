import {
  selectEstablishmentMappedById,
  useEstablishmentStore,
} from "@bsport/store-core-data-establishment";
import {
  selectTeachersById,
  useTeacherStore,
} from "@bsport/store-core-data-teacher";

import type { TableRowData } from "../components/SessionList/types";
import {
  selectProcessedSessions,
  useSessionListStore,
} from "../stores/session-list";

export const useTableRowData = (): TableRowData[] => {
  const sessions = useSessionListStore(selectProcessedSessions);
  const teachersById = useTeacherStore(selectTeachersById);
  const establishmentsById = useEstablishmentStore(
    selectEstablishmentMappedById,
  );
  return sessions.map((session) => ({
    ...session,
    teacher: teachersById[session.coach],
    teacherOverride: session.coach_override
      ? teachersById[session.coach_override]
      : undefined,
    teacherName: session.coach_override
      ? teachersById[session.coach_override]?.name
      : teachersById[session.coach]?.name,
    originalTeacherName: teachersById[session.coach]?.name,
    establishmentName: establishmentsById[session.establishment]?.title,
  }));
};
