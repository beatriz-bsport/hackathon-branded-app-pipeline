import type { InboxMessage } from "@bsport/api-cdp/inbox";

import type {
  AutomatedMessageChannel,
  AutomatedMessageProps,
  AutomatedMessageType,
} from "#src/features/thread-messages/automated-message/automated-message";
import type { MessageBubbleProps } from "#src/features/thread-messages/message-bubble/message-bubble";

/**
 * A presentational view of a message: either a chat bubble (manual messages) or
 * a collapsed automated-message card (campaigns, workflows, …). The `kind`
 * discriminator tells the renderer which component to mount.
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
 * presentational component. `manual` messages render as `MessageBubble`;
 * everything else renders as `AutomatedMessage`.
 */
export const mapMessage = (message: InboxMessage): MappedMessage => {
  const timestamp = formatTimestamp(message.dateCreated);

  if (message.source === "manual") {
    return {
      id: message.id,
      kind: "bubble",
      props: {
        sender: message.sender,
        channel: message.channel,
        title: message.title ?? undefined,
        body: message.body,
        timestamp,
        status: message.status,
      },
    };
  }

  // Automated messages never use the live `chat` channel; guard defensively.
  const channel: AutomatedMessageChannel =
    message.channel === "chat" ? "email" : message.channel;

  return {
    id: message.id,
    kind: "automated",
    props: {
      channel,
      // Source values other than "manual" are exactly `AutomatedMessageType`.
      messageType: message.source satisfies AutomatedMessageType,
      title: message.sourceName ?? "",
      timestamp,
      status: message.status,
      subject: message.title ?? undefined,
      body: message.body,
    },
  };
};
