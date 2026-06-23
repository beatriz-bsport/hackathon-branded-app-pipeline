import { BookingListedInformation } from "./stores/session-management/types";
import { AppointmentColumn, SeriesColumn, SessionColumns } from "./types";

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

export const DEFAULT_SERIES_COLUMNS = [
  SeriesColumn.DATES,
  SeriesColumn.BOOKING_RULE,
  SeriesColumn.CLASSES,
];

export const DEFAULT_SESSION_LISTED_INFORMATION = [
  BookingListedInformation.SPOT,
  BookingListedInformation.PASS,
  BookingListedInformation.NEW_MEMBER,
  BookingListedInformation.RECURRING_BOOKING,
  BookingListedInformation.UNPAID_INVOICES,
  BookingListedInformation.TAGS,
];

export enum TeacherSubstitutionPropagationMode {
  NO_PROPAGATION = 0,
  PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY = 1,
  PROPAGATE_TO_ALL = 2,
}

export enum TimelineIndicator {
  PAST = "past",
  ONGOING = "ongoing",
  UPCOMING = "upcoming",
}
