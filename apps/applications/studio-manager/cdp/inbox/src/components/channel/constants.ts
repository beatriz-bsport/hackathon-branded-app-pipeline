import type {
  InboxChannel,
  InboxMessageChannelCode,
} from "@bsport/api-cdp/inbox";
import { type IconName } from "@bsport/kaizen-primitive-core";

/**
 * The UI channel union — owned by the api package's {@link InboxChannel}, the
 * single source of truth shared with the conversation list and the message
 * contract. Re-exported here so app code keeps importing `ChannelType` locally.
 */
export type ChannelType = InboxChannel;

/**
 * Runtime, code-ordered companion to {@link ChannelType} (0=email, 1=sms,
 * 2=push, 3=in_app) so a backend communication-kind code can be decoded with
 * {@link channelFromCode}. `satisfies` keeps it in lock-step with the union.
 */
export const CHANNEL_TYPES = [
  "email",
  "sms",
  "push",
  "in_app",
] as const satisfies readonly ChannelType[];

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
  in_app: "message-square-02",
};
