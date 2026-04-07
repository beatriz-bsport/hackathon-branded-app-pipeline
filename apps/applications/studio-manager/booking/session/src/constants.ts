import { AppointmentColumn, SessionColumns } from "./types";

export const DEFAULT_SESSION_COLUMNS = [
  SessionColumns.TIME,
  SessionColumns.SESSION_NAME,
  SessionColumns.TEACHER,
  SessionColumns.PARTICIPANTS,
  SessionColumns.ESTABLISHMENT,
  SessionColumns.SESSION_TYPE,
  SessionColumns.ACTIONS,
  SessionColumns.ATTENDANCE,
  SessionColumns.MOBILE_ACTIONS,
];

export const DEFAULT_APPOINTMENT_COLUMNS = [
  AppointmentColumn.TIME,
  AppointmentColumn.NAME,
  AppointmentColumn.TEACHER,
  AppointmentColumn.PARTICIPANT,
  AppointmentColumn.PASS_USED,
  AppointmentColumn.ESTABLISHMENT,
  AppointmentColumn.TYPE,
  AppointmentColumn.ACTIONS,
];

export enum TeacherSubstitutionPropagationMode {
  NO_PROPAGATION = 0,
  PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY = 1,
  PROPAGATE_TO_ALL = 2,
}
