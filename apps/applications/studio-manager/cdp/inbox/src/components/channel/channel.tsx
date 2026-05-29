import { Body, Icon, type IconName } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type ChannelType = "email" | "sms" | "push" | "chat";

const CHANNEL_ICON: Record<ChannelType, IconName> = {
  email: "mail-01",
  sms: "message-dots-circle",
  push: "notification-message",
  chat: "message-square-02",
};

export type ChannelProps = {
  channel: ChannelType;
  className?: string;
};

export function Channel({ channel, className }: ChannelProps) {
  const { t } = useTranslation("page");

  return (
    <span
      className={`inline-flex items-center gap-2xs text-current${className ? ` ${className}` : ""}`}
    >
      <Icon aria-hidden icon={CHANNEL_ICON[channel]} size="sm" />
      <Body
        htmlVariant="span"
        weight="strong"
        color="inherit"
        className="text-body-xs uppercase leading-2xs"
      >
        {t(`commons.channel.${channel}`)}
      </Body>
    </span>
  );
}
