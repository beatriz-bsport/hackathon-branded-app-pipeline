import type { InboxMessage } from "@bsport/api-cdp/inbox";

import type {
  AutomatedMessageChannel,
  AutomatedMessageProps,
  AutomatedMessageType,
} from "#src/features/thread-messages/automated-message/automated-message";
import type { MessageBubbleProps } from "#src/features/thread-messages/message-bubble/message-bubble";

/**
 * A presentational view of a message: either a chat bubble (manual outbound,
 * member replies, untyped) or a collapsed automated-message card (campaigns,
 * workflows, …). The `kind` discriminator tells the renderer which component to
 * mount.
 */
export type MappedMessage =
  | { id: number; kind: "bubble"; props: MessageBubbleProps }
  | { id: number; kind: "automated"; props: AutomatedMessageProps };

/**
 * Formats an ISO timestamp into the short `HH:MM` label the message components
 * expect (they do no date formatting themselves). Uses the runtime locale.
 */
const formatTimestamp = (isoDate: string): string =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));

/**
 * Adapts an {@link InboxMessage} from the API into props for the matching
 * presentational component. Manual outbound messages, member replies and
 * untyped messages render as a `MessageBubble`; the automated message types
 * render as an `AutomatedMessage` card.
 */
export const mapMessage = (message: InboxMessage): MappedMessage => {
  const timestamp = formatTimestamp(message.dateCreated);

  if (
    message.messageType === "manually_sent" ||
    message.messageType === "member_reply" ||
    message.messageType === null
  ) {
    return {
      id: message.id,
      kind: "bubble",
      props: {
        // `member` is the only inbound author; `studio`/`agent` are outbound.
        sender: message.authorType === "member" ? "member" : "studio",
        channel: message.channel,
        title: message.title || undefined,
        content: message.content,
        timestamp,
        // null status (outside success/failed/processing) → no affordance.
        status: message.status ?? undefined,
      },
    };
  }

  // Automated messages never use the live `in_app` channel (and the backend may
  // send no channel); guard defensively to the card's supported channels.
  const channel: AutomatedMessageChannel =
    message.channel === null || message.channel === "in_app"
      ? "email"
      : message.channel;

  return {
    id: message.id,
    kind: "automated",
    props: {
      channel,
      // After the bubble guard above, the remaining types are exactly the six
      // `AutomatedMessageType` card values.
      messageType: message.messageType satisfies AutomatedMessageType,
      // Header name: email/push carry a `title`, sms falls back to `content`.
      title: message.title || message.content,
      timestamp,
      // null status (outside success/failed/processing) → no affordance.
      status: message.status ?? undefined,
      subject: message.title || undefined,
      content: message.content,
    },
  };
};
