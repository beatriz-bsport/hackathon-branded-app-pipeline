import { useId } from "react";

import { Body, Card, Collapse, Icon, cx } from "@bsport/kaizen-primitive-core";

import { Channel, type ChannelType } from "#src/components/channel/channel";
import { BULLET } from "#src/features/thread-messages/constants";
import { MessageBody } from "#src/features/thread-messages/message-body";
import { useTranslation } from "#src/utils/i18n";

/** Automated messages go out via email/sms/push — never the live `in_app` channel. */
export type AutomatedMessageChannel = Exclude<ChannelType, "in_app">;

/** Delivery status — mirrors `MessageBubble` for consistency across the feature. */
export type MessageStatus = "sent" | "failed";

/**
 * Presentational classification of an automated message. There is no single
 * backend enum for this — each value is derived (by the future row adapter,
 * out of scope here) from which id is populated in `CommunicationSent.metadata`
 * (bsport-django `apps/communicate/communication/types.py`):
 *
 * - `campaign`                   → `automated_campaign_id` (SmartListAutomatedCampaign)
 * - `transactional-notification` → `notification_rule` / `notification_event` (NotificationRule)
 * - `auto-message`               → `marketing_notification_id` (MarketingNotification, "Marketing Notifications" in legacy)
 * - `automation`                 → `cadence_id` (Cadence / workflow)
 * - `audience-message`           → `smartlist_id` (SmartList, ExecutionContext.AUDIENCE)
 * - `franchise-campaign`         → `communication_sent_group_config_id` (ExecutionContext.COMMUNICATION_FROM_FRANCHISE)
 */
export type AutomatedMessageType =
  | "campaign"
  | "transactional-notification"
  | "auto-message"
  | "automation"
  | "audience-message"
  | "franchise-campaign";

export type AutomatedMessageProps = {
  /** Channel the automated message was sent through (drives the header icon). */
  channel: AutomatedMessageChannel;
  /** Origin/type of the automated message; shown as the meta label. */
  messageType: AutomatedMessageType;
  /** Campaign/notification name shown in the header. */
  title: string;
  /** Pre-formatted timestamp; this component does no date formatting. */
  timestamp: string;
  /** Delivery status; `"failed"` shows a red "Failed" label in place of the timestamp. */
  status?: MessageStatus;
  /** Whether the preview is expanded on mount. Self-managed afterwards. */
  defaultExpanded?: boolean;
  /** Expanded preview heading — the email subject or the push notification title. */
  subject?: string;
  /** Expanded preview content. HTML for email (sanitized), plain text for sms/push. */
  body: string;
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
  body,
  className,
}: AutomatedMessageProps) {
  const { t } = useTranslation("thread-messages");
  const collapseId = useId();
  const isFailed = status === "failed";

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
                        {timestamp}
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
                {subject && (
                  <Body weight="strong" color="weak" className="text-body-sm">
                    {subject}
                  </Body>
                )}
                <hr className="border-0 border-t-stroke-thin border-t-stroke-weak" />
                <MessageBody html={body} />
              </>
            ) : (
              <>
                {channel === "push" && subject && (
                  <Body weight="strong" color="weak" className="text-body-sm">
                    {subject}
                  </Body>
                )}
                <Body
                  color="weak"
                  className="whitespace-pre-line break-words text-body-sm"
                >
                  {body}
                </Body>
              </>
            )}
          </div>
        </Collapse.Content>
      </Collapse>
    </Card>
  );
}

/** Maps the kebab-case message type to its (camelCase) i18n translation key. */
const MESSAGE_TYPE_I18N_KEY = {
  campaign: "automatedMessage.type.campaign",
  "transactional-notification":
    "automatedMessage.type.transactionalNotification",
  "auto-message": "automatedMessage.type.autoMessage",
  automation: "automatedMessage.type.automation",
  "audience-message": "automatedMessage.type.audienceMessage",
  "franchise-campaign": "automatedMessage.type.franchiseCampaign",
} as const satisfies Record<AutomatedMessageType, string>;
