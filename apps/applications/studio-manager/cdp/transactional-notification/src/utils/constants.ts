export const notificationRuleEventMap: Record<string, string> = {
  member: "member",
  booking: "booking",
  offer: "offer",
  private_booking: "private_booking",
  recurrent_private_booking: "recurrent_private_booking",
  payment_pack: "payment_pack",
  giftcard: "giftcard",
  waiting_list: "waiting-list",
  subscription: "subscription",
  substitution: "replacement_request",
  invoice: "invoice",
  referral: "referral",
};

export const NOTIFICATION_TYPE_QUERY_PARAM = "notificationType";
export const NOTIFICATION_EVENT_QUERY_PARAM = "notificationEvent";

export const NOTIFICATION_TYPE_EMAIL = "email_notification";
export const NOTIFICATION_TYPE_PUSH = "push_notification";
