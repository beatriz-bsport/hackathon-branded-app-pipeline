export const PASS_ACTION_CREDITS_LEFT = "creditsLeft";
export const PASS_ACTION_DAYS_LEFT = "daysLeft";
export const PASS_ACTION_DAYS_EXPIRED = "daysExpired";

export const PASS_ACTION_EVENT_TYPE_CREDITS = "credits";
export const PASS_ACTION_EVENT_TYPE_DAYS = "days";

export const PASS_SUBSCRIPTION_FILTERING_IN = "everyPass";
export const PASS_SUBSCRIPTION_FILTERING_OUT = "outsideSubscription";

export const PASS_CREDITS_LEFT_BOOKING_COMPLETED = "bookingCompleted";
export const PASS_CREDITS_LEFT_SESSION_END = "sessionEnd";

export type PassActionEventType =
  | typeof PASS_ACTION_EVENT_TYPE_CREDITS
  | typeof PASS_ACTION_EVENT_TYPE_DAYS;

export type PassAction =
  | typeof PASS_ACTION_CREDITS_LEFT
  | typeof PASS_ACTION_DAYS_LEFT
  | typeof PASS_ACTION_DAYS_EXPIRED;

export type PassSubscriptionFilteringType =
  | typeof PASS_SUBSCRIPTION_FILTERING_IN
  | typeof PASS_SUBSCRIPTION_FILTERING_OUT;

export type PassCreditsLeftEventKind =
  | typeof PASS_CREDITS_LEFT_BOOKING_COMPLETED
  | typeof PASS_CREDITS_LEFT_SESSION_END;

export const APPOINTMENT_PASS_ACTIONS_MAP_TO_EVENT_KIND: Record<
  PassAction,
  number
> = {
  [PASS_ACTION_CREDITS_LEFT]: 6,
  [PASS_ACTION_DAYS_LEFT]: 5,
  [PASS_ACTION_DAYS_EXPIRED]: 5,
};

export const PAYMENT_PASS_ACTIONS_MAP_TO_EVENT_KIND: Record<
  PassAction,
  number
> = {
  [PASS_ACTION_CREDITS_LEFT]: 4,
  [PASS_ACTION_DAYS_LEFT]: 3,
  [PASS_ACTION_DAYS_EXPIRED]: 3,
};

export const CREDITS_LEFT_EVENTS_MAP_TO_EVENT_KIND: Record<
  PassCreditsLeftEventKind,
  number
> = {
  [PASS_CREDITS_LEFT_BOOKING_COMPLETED]: 0,
  [PASS_CREDITS_LEFT_SESSION_END]: 1,
};

export const CREDITS_LEFT_EVENT_KIND_MAP_TO_EVENT_VALUE: Record<
  number,
  PassCreditsLeftEventKind
> = {
  [0]: PASS_CREDITS_LEFT_BOOKING_COMPLETED,
  [1]: PASS_CREDITS_LEFT_SESSION_END,
};

export const DEFAULT_PASS_EVENT_OCCURENCE = 0;
