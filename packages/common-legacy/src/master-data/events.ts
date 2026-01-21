// BILLING PLAN
export const EVENT_BILLING_PLAN_CREATE = 'billing_plan-create';
export const EVENT_BILLING_PLAN_DELETE = 'billing_plan-delete';
export const EVENT_BILLING_PLAN_UPDATE = 'billing_plan-update';
export const EVENT_BILLING_PLAN_PAUSE = 'billing_plan-pause';
export const EVENT_BILLING_PLAN_PAUSE_DELETED = 'billing_plan-pause_deleted';
export const EVENT_BILLING_PLAN_STOP = 'billing_plan-stop';
export const EVENT_BILLING_PLAN_RENEW = 'billing_plan-renew';
export const EVENT_BILLING_PLAN_PAYMENT_DISPUTE =
  'billing_plan-payment_dispute';
export const EVENT_BILLING_PLAN_PAYMENT_SUCCESS =
  'billing_plan-payment_success';
export const EVENT_BILLING_PLAN_PAYMENT_FAILURE =
  'billing_plan-payment_failure';
export const EVENT_BILLING_PLAN_UPDATE_PAYMENT_METHOD =
  'billing_plan-update_payment_method';
export const EVENT_BILLING_PLAN_UPDATE_PAYMENT_PACK =
  'billing_plan-update_payment_pack';
export const EVENT_BILLING_PLAN_UPDATE_PRIVATE_PASS =
  'billing_plan-update_private_pass';

export const EVENT_BILLING_PLAN_UPDATE_PAYMENT_COMBO =
  'billing_plan-update_payment_combo';

export const BILLING_PLAN_EVENTS = {
  delete: EVENT_BILLING_PLAN_DELETE,
  create: EVENT_BILLING_PLAN_CREATE,
  update: EVENT_BILLING_PLAN_UPDATE,
  pause: EVENT_BILLING_PLAN_PAUSE,
  pause_deleted: EVENT_BILLING_PLAN_PAUSE_DELETED,
  stop: EVENT_BILLING_PLAN_STOP,
  renew: EVENT_BILLING_PLAN_RENEW,
  payment_dispute: EVENT_BILLING_PLAN_PAYMENT_DISPUTE,
  payment_success: EVENT_BILLING_PLAN_PAYMENT_SUCCESS,
  payment_failure: EVENT_BILLING_PLAN_PAYMENT_FAILURE,
  update_payment_method: EVENT_BILLING_PLAN_UPDATE_PAYMENT_METHOD,
  update_payment_pack: EVENT_BILLING_PLAN_UPDATE_PAYMENT_PACK,
  update_private_pass: EVENT_BILLING_PLAN_UPDATE_PRIVATE_PASS,
  update_payment_combo: EVENT_BILLING_PLAN_UPDATE_PAYMENT_COMBO,
};

// BASKET
export const BASKET_CREATED = 'basket-created';
export const BASKET_ADD_ITEM = 'basket-additem';
export const BASKET_REMOVE_ITEM = 'basket-removeitem';
export const BASKET_FINALIZED = 'basket-finalize';
export const BASKET_AUTOMATIC_CLEAN = 'basket-automaticclean';

export const BASKET_EVENTS = {
  created: BASKET_CREATED,
  automaticclean: BASKET_AUTOMATIC_CLEAN,
  finalize: BASKET_FINALIZED,
  additem: BASKET_ADD_ITEM,
  removeitem: BASKET_REMOVE_ITEM,
};

// MEMBER
export const MEMBER_BASKET_PAID = 'member-basket_paid';
export const MEMBER_BOOKING_REGISTERED = 'member-booking_registered';
export const MEMBER_CUSTOM_FORM_FILLED = 'member-custom_form_filled';
export const MEMBER_GIFTCARD_USED = 'member-giftcard_used';
export const MEMBER_INVOICE_PAID = 'member-invoice_paid';
export const MEMBER_LOGIN_SUCCESSFUL = 'member-login_successful';
export const MEMBER_PRIVATE_BOOKING_REGISTERED =
  'member-private_booking_registered';
export const MEMBER_TAG_APPLIED = 'member-tag_applied';
export const MEMBER_VOD_BOUGHT = 'member-vod_bought';
export const MEMBER_BOOKING_CANCELED = 'member-booking_canceled';
export const MEMBER_PRIVATE_BOOKING_CANCELED =
  'member-private_booking_canceled';

export const MEMBER_EVENTS = {
  basket_paid: MEMBER_BASKET_PAID,
  booking_registered: MEMBER_BOOKING_REGISTERED,
  custom_form_filled: MEMBER_CUSTOM_FORM_FILLED,
  giftcard_used: MEMBER_GIFTCARD_USED,
  invoice_paid: MEMBER_INVOICE_PAID,
  login_successful: MEMBER_LOGIN_SUCCESSFUL,
  private_booking_registered: MEMBER_PRIVATE_BOOKING_REGISTERED,
  tag_applied: MEMBER_TAG_APPLIED,
  vod_bought: MEMBER_VOD_BOUGHT,
  booking_canceled: MEMBER_BOOKING_CANCELED,
  privatebooking_canceled: MEMBER_PRIVATE_BOOKING_CANCELED,
};

// CONSUMER PAYMENT PACK
export enum CONSUMER_PAYMENT_PACK_EVENTS {
  CREATE = 'consumer_payment_pack-create',
  DELETE = 'consumer_payment_pack-delete',
  UPDATE = 'consumer_payment_pack-update',
  ADD_CREDIT = 'consumer_payment_pack-add_credit',
  REMOVE_CREDIT = 'consumer_payment_pack-remove_credit',
  DEBIT_CREDIT = 'consumer_payment_pack-debit_credit',
}

// PRIVATE CONSUMER PACK
export enum PRIVATE_CONSUMER_PACK_EVENTS {
  CREATE = 'private_consumer_pass-create',
  DELETE = 'private_consumer_pass-delete',
  UPDATE = 'private_consumer_pass-update',
  DEDUCT_CREDIT = 'private_consumer_pass-deduct_credit',
}

// GIFTCARD
export enum GIFTCARD_EVENTS {
  CREATE = 'consumer_giftcard-create',
  DELETE = 'consumer_giftcard-delete',
  REVERT = 'consumer_giftcard-revert',
}

// SHOP  ITEMS
export enum SHOP_ITEMS_EVENTS {
  CREATE = 'provision_update-create',
  DELETE = 'consumer_giftcard-delete',
  REVERT = 'provision_update-revert',
}

// BOOKING
export enum BOOKING_EVENTS {
  CREATE = 'booking-create',
  DELETE = 'booking-delete',
  UPDATE = 'booking-update',
  ATTENDANCE = 'booking-attendance',
}

// PRIVATE BOOKING
export enum PRIVATE_BOOOKING_EVENTS {
  CREATE = 'private_booking-create',
  DELETE = 'private_booking-delete',
  UPDATE = 'private_booking-update',
  CANCEL = 'private_booking-cancel',
  UPDATE_TIME = 'private_booking-update_time',
}

// INVOICE
export enum INVOICE_EVENTS {
  CREATE = 'invoice-create',
  DELETE = 'invoice-delete',
  UPDATE = 'invoice-update',
  REVERT = 'invoice-revert',
}

export const EVENT_LEAD_FORM_SUBMITTED = 'marketing-lead_form_submitted';
