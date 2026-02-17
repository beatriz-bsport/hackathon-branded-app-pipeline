import { Columns } from "./types";

export const DEFAULT_COLUMNS = [
  Columns.TIME,
  Columns.SESSION_NAME,
  Columns.TEACHER,
  Columns.PARTICIPANTS,
  Columns.ESTABLISHMENT,
  Columns.SESSION_TYPE,
  Columns.ACTIONS,
];

export enum TeacherSubstitutionPropagationMode {
  NO_PROPAGATION = 0,
  PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY = 1,
  PROPAGATE_TO_ALL = 2,
}
