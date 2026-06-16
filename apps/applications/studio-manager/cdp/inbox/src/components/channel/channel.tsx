import { Body, Icon, cx } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { CHANNEL_ICON, type ChannelType } from "./constants";

export type { ChannelType };

type BaseChannelProps = {
  channel: ChannelType;
  className?: string;
};

type DefaultChannelProps = BaseChannelProps & {
  kind?: "default";
};

type IconOnlyChannelProps = BaseChannelProps & {
  kind: "icon-only";
};

export type ChannelProps = DefaultChannelProps | IconOnlyChannelProps;

export function Channel({
  channel,
  className,
  kind = "default",
}: ChannelProps) {
  const { t } = useTranslation("page");
  const label = t(`commons.channel.${channel}`);
  const iconOnly = kind === "icon-only";

  return (
    <span
      className={cx("inline-flex items-center gap-2xs text-current", className)}
      aria-label={iconOnly ? label : undefined}
    >
      <Icon aria-hidden icon={CHANNEL_ICON[channel]} size="sm" />
      {!iconOnly && (
        <Body
          htmlVariant="span"
          weight="strong"
          color="inherit"
          className="text-body-xs uppercase leading-2xs"
        >
          {label}
        </Body>
      )}
    </span>
  );
}
