export enum ReportStatusChipTypes {
  LAST_PAYMENT_STATUS_SUBSCRIPTION = 'last_payment_subscription',
  SUBSCRIPTION = 'subscription',
  BOOKING = 'booking',
  PAYMENT = 'payment',
  DISPUTE = 'dispute',
  LAST_PAYMENT_STATUS = 'last_payment',
  VIDEO = 'video',
}

export const GREY_NO = ['new_member_only', 'plan_auto_renewal', 'is_recurring'];

export const GREEN_NO = [
  'is_no_show',
  'is_unpaid',
  'disabled',
  'roll_call_needs_validation',
];

export const RED_NO = [
  'attendance',
  'accept_email',
  'accept_sms',
  'marketplace_enabled',
  'is_rent',
];
