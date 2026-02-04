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
