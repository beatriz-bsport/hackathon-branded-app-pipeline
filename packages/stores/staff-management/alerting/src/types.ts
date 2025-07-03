// Alert Kind Constants
export const ALERT_KINDS = {
  UNEVEN_INVOICE: 1,
  NEW_ORDER: 2,
  REMINDER_NOTE: 3,
  PRIVATE_BOOKING_INCOMPLETE: 4,
  COMPANY_ONBOARDING: 5,
  UNPAID_PRIVATE_BOOKING: 6,
  NEW_TUTORIAL_SECTION_OR_LESSON: 7,
  REPLACEMENT_REQUEST_LATE: 8,
  UNREAD_COMMUNICATION: 9,
} as const;

export type AlertKind = (typeof ALERT_KINDS)[keyof typeof ALERT_KINDS];

// Base Alert Interface
export interface BaseAlert {
  alert_kind: AlertKind;
  company: number;
  data: Record<string, unknown>;
}

// Specific Alert Data Types
export interface InvoiceAlertData extends Record<string, unknown> {
  uuid: string;
  legal_identifier: string;
  price_payed: number;
  price_due: number;
  date_invoice: string;
  actions: null;
}

export interface NewOrderAlertData extends Record<string, unknown> {
  order: number;
  price: number;
  name: string;
  actions: null;
}

export interface ReminderTaskAlertData extends Record<string, unknown> {
  member: {
    id: number;
    name: string;
    [key: string]: unknown;
  };
  name: string;
  description: string;
  date_due: string;
}

export interface PrivateBookingAlertData extends Record<string, unknown> {
  member_id: number;
  name: string;
  user_name: string;
  date_start: string;
  private_booking: number;
  credits_due?: number; // Only for unpaid private bookings
}

export interface CompanyOnboardingAlertData extends Record<string, unknown> {
  type: string;
  level?: string;
  date?: string;
  count?: number;
  payment_engine_identifier?: number;
}

export interface TutorialSectionOrLessonAlertData
  extends Record<string, unknown> {
  section_names: Record<string, string>;
  names: Record<string, string>;
  lesson_names: Record<string, string>;
  section_id: number;
  lesson_id: number;
  new_section: boolean;
}

export interface ReplacementRequestLateAlertData
  extends Record<string, unknown> {
  id: number;
  activity_name: string;
  date_start: string;
  coach: string;
}

export interface UnreadCommunicationAlertData extends Record<string, unknown> {
  name: string;
  photo: string;
  id: number;
  date_created: string;
  content: string;
  member: number;
}

// Typed Alert Interfaces
export interface InvoiceAlert extends BaseAlert {
  alert_kind: typeof ALERT_KINDS.UNEVEN_INVOICE;
  data: InvoiceAlertData;
}

export interface NewOrderAlert extends BaseAlert {
  alert_kind: typeof ALERT_KINDS.NEW_ORDER;
  data: NewOrderAlertData;
}

export interface ReminderTaskAlert extends BaseAlert {
  alert_kind: typeof ALERT_KINDS.REMINDER_NOTE;
  data: ReminderTaskAlertData;
}

export interface PrivateBookingIncompleteAlert extends BaseAlert {
  alert_kind: typeof ALERT_KINDS.PRIVATE_BOOKING_INCOMPLETE;
  data: PrivateBookingAlertData;
}

export interface CompanyOnboardingAlert extends BaseAlert {
  alert_kind: typeof ALERT_KINDS.COMPANY_ONBOARDING;
  data: CompanyOnboardingAlertData;
}

export interface UnpaidPrivateBookingAlert extends BaseAlert {
  alert_kind: typeof ALERT_KINDS.UNPAID_PRIVATE_BOOKING;
  data: PrivateBookingAlertData;
}

export interface TutorialSectionOrLessonAlert extends BaseAlert {
  alert_kind: typeof ALERT_KINDS.NEW_TUTORIAL_SECTION_OR_LESSON;
  data: TutorialSectionOrLessonAlertData;
}

export interface ReplacementRequestLateAlert extends BaseAlert {
  alert_kind: typeof ALERT_KINDS.REPLACEMENT_REQUEST_LATE;
  data: ReplacementRequestLateAlertData;
}

export interface UnreadCommunicationAlert extends BaseAlert {
  alert_kind: typeof ALERT_KINDS.UNREAD_COMMUNICATION;
  data: UnreadCommunicationAlertData;
}

// Union type for all alerts
export type Alert =
  | InvoiceAlert
  | NewOrderAlert
  | ReminderTaskAlert
  | PrivateBookingIncompleteAlert
  | CompanyOnboardingAlert
  | UnpaidPrivateBookingAlert
  | TutorialSectionOrLessonAlert
  | ReplacementRequestLateAlert
  | UnreadCommunicationAlert;

// Type mapping from AlertKind to the corresponding Alert type
export type AlertTypeMap = {
  [ALERT_KINDS.UNEVEN_INVOICE]: InvoiceAlert;
  [ALERT_KINDS.NEW_ORDER]: NewOrderAlert;
  [ALERT_KINDS.REMINDER_NOTE]: ReminderTaskAlert;
  [ALERT_KINDS.PRIVATE_BOOKING_INCOMPLETE]: PrivateBookingIncompleteAlert;
  [ALERT_KINDS.COMPANY_ONBOARDING]: CompanyOnboardingAlert;
  [ALERT_KINDS.UNPAID_PRIVATE_BOOKING]: UnpaidPrivateBookingAlert;
  [ALERT_KINDS.NEW_TUTORIAL_SECTION_OR_LESSON]: TutorialSectionOrLessonAlert;
  [ALERT_KINDS.REPLACEMENT_REQUEST_LATE]: ReplacementRequestLateAlert;
  [ALERT_KINDS.UNREAD_COMMUNICATION]: UnreadCommunicationAlert;
};

// Alert Kind Info
export interface AlertKindInfo {
  id: AlertKind;
  name: string;
  description?: string;
}
