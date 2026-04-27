import {
  CommunicationKind,
  EventKind,
  TagRuleKind as TagRuleKindApi,
} from "@bsport/api-cdp";

export { CommunicationKind, EventKind };

export const TagRuleKind = TagRuleKindApi;

export type TagRuleKind = (typeof TagRuleKind)[keyof typeof TagRuleKind];

export const BackgroundTaskStatus = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2,
} as const;

export type BackgroundTaskStatus =
  (typeof BackgroundTaskStatus)[keyof typeof BackgroundTaskStatus];

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
  DEFERRED: 3, // Failed
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

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE_RECIPIENTS = 10;
