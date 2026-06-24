import type { InboxMessageChannelCode } from "@bsport/api-cdp/inbox";
import { type IconName } from "@bsport/kaizen-primitive-core";

/**
 * The channels a message can be sent through — single source of truth. Ordered
 * to match the backend communication-kind codes (0=email, 1=sms, 2=push,
 * 3=in_app→chat) so a code can be decoded with {@link channelFromCode}.
 */
export const CHANNEL_TYPES = ["email", "sms", "push", "chat"] as const;

export type ChannelType = (typeof CHANNEL_TYPES)[number];

/**
 * Decode a backend communication-kind code into a UI channel. Total over
 * {@link InboxMessageChannelCode} — a new backend channel forces both this
 * union and {@link CHANNEL_TYPES} to be updated, surfacing the gap at compile
 * time rather than falling back silently.
 */
export const channelFromCode = (code: InboxMessageChannelCode): ChannelType =>
  CHANNEL_TYPES[code];

export const CHANNEL_ICON: Record<ChannelType, IconName> = {
  email: "mail-01",
  sms: "message-dots-circle",
  push: "notification-message",
  chat: "message-square-02",
};
