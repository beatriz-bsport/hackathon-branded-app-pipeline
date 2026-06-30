import { useId } from "react";

import type { AutomatedMessageType } from "@bsport/api-cdp/inbox";
import { Body, Card, Collapse, Icon, cx } from "@bsport/kaizen-primitive-core";

import { Channel, type ChannelType } from "#src/components/channel/channel";
import { BULLET } from "#src/features/thread-messages/constants";
import { MessageBody } from "#src/features/thread-messages/message-body";
import { useTranslation } from "#src/utils/i18n";

/** Automated messages go out via email/sms/push — never the live `in_app` channel. */
export type AutomatedMessageChannel = Exclude<ChannelType, "in_app">;

/** Delivery status — mirrors `MessageBubble` for consistency across the feature. */
export type MessageStatus = "success" | "failed" | "processing";

// The automated (card) message types — defined once in the api package and
// re-exported here so consumers (e.g. `mapMessage`, stories) keep their import
// path.
export type { AutomatedMessageType };

export type AutomatedMessageProps = {
  /** Channel the automated message was sent through (drives the header icon). */
  channel: AutomatedMessageChannel;
  /** Origin/type of the automated message; shown as the meta label. */
  messageType: AutomatedMessageType;
  /** Campaign/notification name shown in the header (email/push subject, else content). */
  title: string;
  /** Pre-formatted timestamp; this component does no date formatting. */
  timestamp: string;
  /**
   * Delivery status; `"failed"` shows a red "Failed" label and `"processing"` a
   * "Sending…" label in place of the timestamp.
   */
  status?: MessageStatus;
  /** Whether the preview is expanded on mount. Self-managed afterwards. */
  defaultExpanded?: boolean;
  /**
   * Expanded preview heading — the email subject or the push notification title.
   * Only rendered when it differs from {@link title} (the collapsed header label),
   * so an automated message whose header already shows the subject doesn't repeat
   * it inside the expanded panel.
   */
  subject?: string;
  /** Expanded preview content. HTML for email (sanitized), plain text for sms/push. */
  content: string;
  className?: string;
};

/**
 * A single automated/campaign message in a conversation thread, rendered as a
 * compact card whose header expands ("Show more" / "Show less") to reveal a
 * per-channel preview of what was sent. `messageType` labels the origin and
 * `channel` drives the header icon; `failed` flags an undelivered message.
 *
 * Block-level: it grows to fill its container's width. Presentational only —
 * all data is passed through props.
 */
export function AutomatedMessage({
  channel,
  messageType,
  title,
  timestamp,
  status,
  defaultExpanded = false,
  subject,
  content,
  className,
}: AutomatedMessageProps) {
  const { t } = useTranslation("thread-messages");
  const collapseId = useId();
  const isFailed = status === "failed";
  const isProcessing = status === "processing";
  // The collapsed header already shows `title`; only repeat it as the expanded
  // heading when the subject is genuinely distinct (e.g. a future campaign name
  // in the header). With the current contract the two are the same string, so
  // this dedupes them.
  const showSubject = subject !== undefined && subject !== title;

  return (
    <Card padding="sm" className={cx("w-full", className)}>
      <Collapse id={collapseId} initiallyOpen={defaultExpanded}>
        <Collapse.Controller>
          {({ isCollapseOpen, setIsCollapseOpen, collapseProps }) => (
            <button
              type="button"
              onClick={() => setIsCollapseOpen((open) => !open)}
              aria-expanded={isCollapseOpen}
              {...collapseProps}
              className="flex w-full items-center justify-between gap-sm p-2xs text-left text-onsurface-weak"
            >
              <span className="flex min-w-0 flex-1 items-center gap-xs">
                <Channel
                  channel={channel}
                  kind="icon-only"
                  className="shrink-0"
                />
                <span className="flex min-w-0 flex-col">
                  <Body
                    htmlVariant="span"
                    weight="strong"
                    color="weak"
                    className="w-full truncate text-body-sm"
                  >
                    {title}
                  </Body>
                  <span className="flex items-center gap-2xs">
                    {isFailed ? (
                      <Body
                        htmlVariant="span"
                        color="critical"
                        className="text-body-xs"
                      >
                        {t("status.failed")}
                      </Body>
                    ) : (
                      <Body
                        htmlVariant="span"
                        color="weak"
                        className="text-body-xs"
                      >
                        {isProcessing ? t("status.sending") : timestamp}
                      </Body>
                    )}
                    <Body
                      htmlVariant="span"
                      color="weak"
                      className="text-body-xs"
                      aria-hidden
                    >
                      {BULLET}
                    </Body>
                    <Body
                      htmlVariant="span"
                      color="weak"
                      className="text-body-xs"
                    >
                      {t(MESSAGE_TYPE_I18N_KEY[messageType])}
                    </Body>
                  </span>
                </span>
              </span>

              <span className="flex shrink-0 items-center gap-2xs">
                <Body htmlVariant="span" color="weak" className="text-body-xs">
                  {t(
                    isCollapseOpen
                      ? "automatedMessage.showLess"
                      : "automatedMessage.showMore",
                  )}
                </Body>
                <Icon
                  aria-hidden
                  icon={isCollapseOpen ? "chevron-up" : "chevron-down"}
                  size="sm"
                />
              </span>
            </button>
          )}
        </Collapse.Controller>

        <Collapse.Content>
          <div className="flex flex-col gap-xs p-2xs">
            {channel === "email" ? (
              <>
                {showSubject && (
                  <>
                    <Body weight="strong" color="weak" className="text-body-sm">
                      {subject}
                    </Body>
                    <hr className="border-0 border-t-stroke-thin border-t-stroke-weak" />
                  </>
                )}
                <MessageBody html={content} />
              </>
            ) : (
              <>
                {channel === "push" && showSubject && (
                  <Body weight="strong" color="weak" className="text-body-sm">
                    {subject}
                  </Body>
                )}
                <Body
                  color="weak"
                  className="whitespace-pre-line break-words text-body-sm"
                >
                  {content}
                </Body>
              </>
            )}
          </div>
        </Collapse.Content>
      </Collapse>
    </Card>
  );
}

/** Maps the (snake_case) message type to its i18n translation key. */
const MESSAGE_TYPE_I18N_KEY = {
  campaign: "automatedMessage.type.campaign",
  transactional_notification: "automatedMessage.type.transactionalNotification",
  auto_message: "automatedMessage.type.autoMessage",
  automation: "automatedMessage.type.automation",
  audience: "automatedMessage.type.audience",
  franchise: "automatedMessage.type.franchise",
} as const satisfies Record<AutomatedMessageType, string>;
