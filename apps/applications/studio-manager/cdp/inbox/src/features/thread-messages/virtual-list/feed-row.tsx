import type { InboxParticipantSummary } from "@bsport/api-cdp/inbox";
import { Avatar } from "@bsport/kaizen-primitive-core";

import { AutomatedMessage } from "#src/features/thread-messages/automated-message/automated-message";
import { mapMessage } from "#src/features/thread-messages/map-message";
import { MessageBubble } from "#src/features/thread-messages/message-bubble/message-bubble";

import type { FeedRow } from "./build-rows";
import { DateSeparator } from "./date-separator";
import { NewSeparator } from "./new-separator";

export type FeedRowViewProps = {
  row: FeedRow;
  /** Conversation participant — drives the inbound (member) message avatar. */
  participant: InboxParticipantSummary;
};

/**
 * Renders a single {@link FeedRow}. Messages are adapted with `mapMessage` and
 * laid out by sender: inbound (member) messages get a left avatar gutter,
 * outbound (studio) and automated messages span the full width. Separators are
 * rendered as-is. Loader rows are handled by the virtual list, not here.
 */
export function FeedRowView({ row, participant }: FeedRowViewProps) {
  if (row.type === "date") {
    return <DateSeparator iso={row.iso} />;
  }

  if (row.type === "new") {
    return <NewSeparator />;
  }

  const mapped = mapMessage(row.message);

  if (mapped.kind === "automated") {
    return (
      <div className="px-sm py-2xs">
        <AutomatedMessage {...mapped.props} />
      </div>
    );
  }

  if (mapped.props.sender === "member") {
    return (
      <div className="flex items-end gap-xs px-sm py-2xs">
        <Avatar
          size="sm"
          shape="round"
          src={participant.avatarUrl}
          initials={participant.initials}
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <MessageBubble {...mapped.props} />
        </div>
      </div>
    );
  }

  return (
    <div className="px-sm py-2xs">
      <MessageBubble {...mapped.props} />
    </div>
  );
}
