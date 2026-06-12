import {
  Button,
  SegmentedControl,
  type SegmentedControlProps,
  cx,
} from "@bsport/kaizen-primitive-core";

import {
  CHANNEL_ICON,
  CHANNEL_TYPES,
  type ChannelType,
} from "#src/components/channel/constants";
import { useMessageComposer } from "#src/features/message-composer/message-composer-context";
import { useTranslation } from "#src/utils/i18n";

export type MessageComposerChannelBarProps = {
  className?: string;
};

/**
 * Channel selector + expand/minimize toggle. Reads and writes the composer
 * state through context — drop it in a `<MessageComposer>` and it just works.
 */
export function MessageComposerChannelBar({
  className,
}: MessageComposerChannelBarProps) {
  const { t } = useTranslation(["message-composer", "page"]);
  const { channel, setChannel, expanded, setExpanded } = useMessageComposer();

  const options: SegmentedControlProps["options"] = CHANNEL_TYPES.map(
    (channelType) => ({
      value: channelType,
      label: t(`commons.channel.${channelType}`, { ns: "page" }),
      icon: CHANNEL_ICON[channelType],
    }),
  );

  const handleChangeChannel = (value: string) => {
    if (!isChannelType(value)) return;
    setChannel(value);
  };

  return (
    <div
      className={cx(
        "flex w-full items-start justify-between gap-sm",
        className,
      )}
    >
      <SegmentedControl
        id="message-composer-channel"
        className="min-w-px flex-1 border-none"
        options={options}
        value={channel}
        onChangeValue={handleChangeChannel}
        label={t("channelBar.channelSelectorLabel")}
      />
      <Button
        kind="icon-button"
        intent="flat"
        color="default"
        size="sm"
        icon={expanded ? "minimize-01" : "expand-01"}
        label={
          expanded ? t("channelBar.minimizeLabel") : t("channelBar.expandLabel")
        }
        onClick={() => setExpanded(!expanded)}
      />
    </div>
  );
}

function isChannelType(value: string): value is ChannelType {
  return CHANNEL_TYPES.some((channelType) => channelType === value);
}
