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
