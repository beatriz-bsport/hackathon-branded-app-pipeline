import { Body, cva, cx } from "@bsport/kaizen-primitive-core";

import { Channel, type ChannelType } from "#src/components/channel/channel";
import { BULLET } from "#src/features/thread-messages/constants";
import { MessageBody } from "#src/features/thread-messages/message-body";
import { useTranslation } from "#src/utils/i18n";

export type MessageSender = "studio" | "member";
export type MessageStatus = "sent" | "failed";

const bubbleStyles = cva(
  "flex w-full flex-col gap-xs border border-stroke-thin border-stroke-weak p-sm",
  {
    variants: {
      sender: {
        studio: "rounded-xl bg-surface-main-weak text-onsurface-main-strong",
        member: "rounded-lg bg-surface-page-navigation text-onsurface-weak",
      },
    },
    defaultVariants: {
      sender: "studio",
    },
  },
);

export type MessageBubbleProps = {
  /** Who sent the message — drives the green (studio) vs grey (member) variant. */
  sender: MessageSender;
  /** Channel the message came through (drives the header/footer marker). */
  channel: ChannelType;
  /** Subject line; omitted for title-less channels (sms/chat). */
  title?: string;
  /** Message content. HTML for email, plain text otherwise — sanitized on render. */
  body: string;
  /** Pre-formatted timestamp; this component does no date formatting. */
  timestamp: string;
  /** Delivery status, shown in the footer for studio (outbound) messages only. */
  status?: MessageStatus;
  className?: string;
};

/**
 * A single message in a conversation thread, rendered as a chat bubble. The
 * `sender` chooses the colour variant; `channel` drives the header/footer marker.
 * `chat` messages have no channel header (and therefore no divider).
 *
 * Block-level: it grows to fill its container's width — the sender avatar and
 * left/right placement are handled by the parent layout, not by this component.
 *
 * Presentational only — all data is passed through props.
 */
export function MessageBubble({
  sender,
  channel,
  title,
  body,
  timestamp,
  status,
  className,
}: MessageBubbleProps) {
  const { t } = useTranslation("thread-messages");

  const showHeader = channel !== "chat";
  const showStatus = sender === "studio" && status != null;
  const isFailed = showStatus && status === "failed";

  return (
    <div className={cx(bubbleStyles({ sender }), className)}>
      {(showHeader || title) && (
        <>
          <div className="flex min-w-0 flex-col gap-2xs">
            {showHeader && <Channel channel={channel} />}
            {title && (
              <Body
                weight="strong"
                color="default"
                className="w-full truncate text-body-sm"
              >
                {title}
              </Body>
            )}
          </div>
          <hr className="border-0 border-t-stroke-thin border-t-stroke-weak" />
        </>
      )}

      <MessageBody html={body} />

      <div
        className={cx(
          "flex items-center gap-2xs text-body-xs",
          sender === "studio" && "justify-end",
          isFailed && "text-onsurface-status-critical-strong",
        )}
      >
        <Channel channel={channel} kind="icon-only" className="shrink-0" />
        {!isFailed && (
          <Body htmlVariant="span" color="inherit" className="text-body-xs">
            {timestamp}
          </Body>
        )}
        {showStatus && (
          <>
            {!isFailed && <span aria-hidden>{BULLET}</span>}
            <Body htmlVariant="span" color="inherit" className="text-body-xs">
              {t(`status.${status}`)}
            </Body>
          </>
        )}
      </div>
    </div>
  );
}
