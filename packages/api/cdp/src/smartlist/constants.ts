export const SMARTLIST_API_V1 = "customer-data-platform/v1/smartlist";
export const CDP_API_V0 = "customer-data-platform/v0";

export const TagRuleKind = {
  TAG_ON_JOIN_AND_UNTAG_ON_LEFT: 1,
  TAG_ON_JOIN_AND_KEEP_TAG: 2,
  TAG_ON_LEFT: 3,
} as const;

export type TagRuleKind = (typeof TagRuleKind)[keyof typeof TagRuleKind];

export const CommunicationStatus = {
  PROCESSING: 1,
  FAILED: 2,
  DELIVERED: 3,
} as const;

export type CommunicationStatus =
  (typeof CommunicationStatus)[keyof typeof CommunicationStatus];

export const CommunicationRecipientStatus = {
  UNKNOWN: -1,
  PENDING: 0,
  PROCESSED: 1,
  DROPPED: 2,
  DEFERRED: 3,
  DELIVERED: 4,
  BOUNCED: 5,
} as const;

export type CommunicationRecipientStatus =
  (typeof CommunicationRecipientStatus)[keyof typeof CommunicationRecipientStatus];

export const CommunicationChannel = {
  EMAIL: "email",
  SMS: "sms",
  PUSH: "push",
} as const;

export type CommunicationChannel =
  (typeof CommunicationChannel)[keyof typeof CommunicationChannel];
