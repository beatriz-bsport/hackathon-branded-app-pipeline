import { ZodError, type ZodType } from "zod";

import type {
  Booking,
  BookingOption,
  BookingOptionPosition,
  GroupSession,
  ManagerSession,
  PrivateBooking,
  Session,
} from "@bsport/api-book";
import type { ConsumerPaymentPack, Pass } from "@bsport/api-buyables";
import type { Member, MemberNote } from "@bsport/api-cdp/member";
import { type DateTime } from "@bsport/datetime-manipulation";
import { GenericTableColumn } from "@bsport/kaizen-primitive-core";

import type {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
  WeekdaySelection,
} from "#src/helpers/recurrence/types";

// Careful, name is always present and represents the final name after overrides
export type EnrichedSession = ManagerSession & {
  color?: string;
  teacherName?: string;
  teacherAvatar?: string;
  teacherInitials?: string;
  originalTeacherName?: string;
  establishmentName?: string;
  hasPendingReplacementRequest?: boolean;
  // Name of the group session if the session is part of a group session
  groupName?: string;
  isTeacherArchived?: boolean;
  isEstablishmentArchived?: boolean;
  isMetaActivityArchived?: boolean;
  onRowClick?: () => void;
  navigateToBookingsManagement?: (sessionId: number) => void;
};

export interface EnrichedAppointment extends PrivateBooking {
  teacherName: string;
  teacherAvatar: string | null;
  teacherInitials: string;
  participantName: string;
  isUnpaid: boolean;
  passUsedName: string;
  establishmentName: string;
  isRecurring: boolean;
  isCancelled: boolean;
}

export type TableColumn = GenericTableColumn<EnrichedSession> & {
  label: string;
};

export type AppointmentTableColumn = GenericTableColumn<EnrichedAppointment> & {
  label: string;
};

export enum SessionColumns {
  TIME = "time",
  SESSION_NAME = "sessionName",
  TEACHER = "teacher",
  PARTICIPANTS = "participants",
  ESTABLISHMENT = "establishment",
  SESSION_TYPE = "sessionType",
  ACTIONS = "actions",
  ATTENDANCE = "attendance", // For mobile only, this column is grouped with actions column on desktop
  MOBILE_ACTIONS = "mobile_actions", // For mobile only, this column is grouped with actions column on desktop
}

export enum AppointmentColumn {
  TIME = "time",
  NAME = "name",
  TEACHER = "teacher",
  PARTICIPANT = "participant",
  PASS_USED = "passUsed",
  ESTABLISHMENT = "establishment",
  TYPE = "type",
  ACTIONS = "actions",
}

// Tab identifiers match the user-facing labels
// Internally, class data is modeled as sessions.
export type CalendarTab = "classes" | "appointments" | "series";

// Series are backed by the offer_group / GroupSession API contract.
export type Series = GroupSession;

export type CalendarDataTab = Exclude<CalendarTab, "series">;

export type SeriesOrdering = "upcoming" | "name";

export enum SeriesColumn {
  DATES = "dates",
  BOOKING_RULE = "bookingRule",
  CLASSES = "classes",
}

export enum CalendarView {
  DAILY = "daily",
  RANGE = "range",
}

export type DateSelection =
  | { type: "single"; date: DateTime }
  | { type: "range"; minDate: DateTime | null; maxDate: DateTime | null };

export type SessionDateTimeFormValues = {
  duration_minute: number;
  startDateTime: DateTime;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceWeekdays: WeekdaySelection;
  recurrenceUnit: CustomRecurrenceUnit;
  recurrenceInterval: number;
  recurrencePattern: MonthlyRecurrencePattern;
  recurrenceEndDate: DateTime | null;
};

export type SessionTeacherAndEstablishmentFormValues = {
  coach: number | null;
  coach_payment_rule: number | null;
  establishment: number | null;
  room_blueprint: number | null;
  roomBlueprintCapacity: number | null;
  effectif: number;
};

export type SessionCapacityFieldName =
  | "effectif"
  | "waiting_list_max_size"
  | "partner_max_booking_count";

export type SessionCapacityFormValues = {
  effectif: number;
  waiting_list_max_size?: number;
  partner_max_booking_count?: number;
};

export type SessionCreditsFormValues = {
  credits: number;
};

export type SeriesClassDraftFormData = SessionDateTimeFormValues &
  SessionTeacherAndEstablishmentFormValues &
  SessionCreditsFormValues;

export type SeriesClassDraftFormSchema = ZodType<SeriesClassDraftFormData>;

export type SeriesClassDraft = {
  id: string;
  data: SeriesClassDraftFormData;
};

export type SessionAggregatorWarningFormValues = {
  available_on_partnership: boolean;
  duration_minute: number;
  startDateTime: DateTime;
};

export type SessionWellhubProductFormValues = {
  available_on_partnership: boolean;
  establishment: number | null;
  startDateTime: DateTime;
  wellhub_product_id?: number | null;
};

export type SessionSpiviFormValues = {
  establishment: number | null;
  room_blueprint: number | null;
  sync_on_spivi?: boolean;
};

export enum ModalType {
  CANCEL = "cancel",
  RESTORE = "restore",
  DELETE = "delete",
  DUPLICATE = "duplicate",
}

export enum AppointmentModalType {
  CANCEL = "cancel_appointment",
  RESCHEDULE = "reschedule_appointment",
  SWAP_PASS = "swap_pass_appointment",
  SWAP_TEACHER = "swap_teacher_appointment",
}

export type SessionModalState = {
  tab: "classes";
  type: ModalType;
  session: EnrichedSession;
};

export type AppointmentModalState = {
  tab: "appointments";
  type: AppointmentModalType;
  appointment: EnrichedAppointment;
};

export type ModalState = SessionModalState | AppointmentModalState | null;

export type SafeEventError = {
  eventType: string;
  zodError: ZodError;
};

export type SafeEventResult<T> = {
  event: T;
  errors: SafeEventError | null;
};

export type DetailsHeaderSession = Pick<
  Session,
  | "id"
  | "available"
  | "manager_only"
  | "date_start"
  | "duration_minute"
  | "timezone_name"
  | "group"
>;

export type RefinedBooking = Booking & {
  memberData: (Member & { notes?: MemberNote[] }) | undefined;
  consumerPaymentPackData: ConsumerPaymentPack | undefined;
  passData: Pass | undefined;
};

export type RefinedBookingOption<TBookingOption = BookingOption> =
  TBookingOption & {
    memberData: Member | undefined;
    waitingListPosition:
      | BookingOptionPosition["waiting_list_position"]
      | undefined;
  };
