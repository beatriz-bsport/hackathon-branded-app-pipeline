import { type IconName } from "@bsport/kaizen-primitive-core";

/** The channels a message can be sent through — single source of truth. */
export const CHANNEL_TYPES = ["email", "sms", "push", "chat"] as const;

export type ChannelType = (typeof CHANNEL_TYPES)[number];

export const CHANNEL_ICON: Record<ChannelType, IconName> = {
  email: "mail-01",
  sms: "message-dots-circle",
  push: "notification-message",
  chat: "message-square-02",
};
