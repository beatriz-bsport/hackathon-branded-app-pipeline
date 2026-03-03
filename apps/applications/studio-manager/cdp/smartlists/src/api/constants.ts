export const CommunicationKind = {
  EMAIL: 0,
  SMS: 1,
  PUSH: 2,
} as const;

export type CommunicationKind =
  (typeof CommunicationKind)[keyof typeof CommunicationKind];

export const EventKind = {
  JOIN: 0,
  LEAVE: 1,
} as const;

export type EventKind = (typeof EventKind)[keyof typeof EventKind];

export const TagRuleKind = {
  TAG_ON_JOIN_AND_UNTAG_ON_LEFT: 1,
  TAG_ON_JOIN_AND_KEEP_TAG: 2,
  TAG_ON_LEFT: 3,
} as const;

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

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE_RECIPIENTS = 10;
