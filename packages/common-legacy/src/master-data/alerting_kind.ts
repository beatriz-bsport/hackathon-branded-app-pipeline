type AlertingKind = {
  alert_kind: number,
  text: string,
};

export const UNEVEN_INVOICE_ALERT: AlertingKind = {
  alert_kind: 1,
  text: 'uneven_invoice',
};

export const NEW_ORDER_ALERT: AlertingKind = {
  alert_kind: 2,
  text: 'new_order',
};

export const REMINDER_NOTE_ALERT_KIND: AlertingKind = {
  alert_kind: 3,
  text: 'reminder_note',
};

export const PRIVATE_BOOKING_INCOMPLETE_ALERT: AlertingKind = {
  alert_kind: 4,
  text: 'private_booking_incomplete',
};

export const COMPANY_ONBOARDING_ALERT: AlertingKind = {
  alert_kind: 5,
  text: 'company_onboarding',
};

export const UNPAID_PRIVATE_BOOKING_ALERT: AlertingKind = {
  alert_kind: 6,
  text: 'unpaid_private_booking',
};

export const NEW_TUTORIAL_SECTION_OR_LESSON: AlertingKind = {
  alert_kind: 7,
  text: 'new_tutorial_section_or_lesson',
};

export const REPLACEMEMENT_REQUEST_LATE_ALERT_KIND: AlertingKind = {
  alert_kind: 8,
  text: 'late_replacement_requests',
};

export const UNREAD_COMMUNICATION: AlertingKind = {
  alert_kind: 9,
  text: 'unread_communication',
};

const ALERTING_KINDS: Array<AlertingKind> = [
  UNEVEN_INVOICE_ALERT,
  NEW_ORDER_ALERT,
  REMINDER_NOTE_ALERT_KIND,
  PRIVATE_BOOKING_INCOMPLETE_ALERT,
  COMPANY_ONBOARDING_ALERT,
  UNPAID_PRIVATE_BOOKING_ALERT,
  UNREAD_COMMUNICATION,
  NEW_TUTORIAL_SECTION_OR_LESSON,
  REPLACEMEMENT_REQUEST_LATE_ALERT_KIND,
];

export default ALERTING_KINDS;
