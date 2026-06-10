/** The channels a message can be sent through — single source of truth. */
export const CHANNEL_TYPES = ["email", "sms", "push", "chat"] as const;

export type ChannelType = (typeof CHANNEL_TYPES)[number];
