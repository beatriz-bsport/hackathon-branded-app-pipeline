import { useId } from "react";

import { TextArea, cx } from "@bsport/kaizen-primitive-core";

import { type ChannelType } from "#src/components/channel/constants";
import { useMessageComposer } from "#src/features/message-composer/message-composer-context";
import { useTranslation } from "#src/utils/i18n";

import { MESSAGE_FIELD_CONFIG } from "./constants";
import { type MessageComposerFieldControlProps } from "./types";

export type MessageComposerMessageFieldProps =
  MessageComposerFieldControlProps & {
    /** Channel this message belongs to — also gates rendering to that channel. */
    channel: ChannelType;
    maxLength?: number;
  };

/**
 * Multiline message input for any channel, picked by `channel`. Renders only
 * while its channel is active. Expanded shows the field label (chat has none).
 * Channels with a character cap show a counter.
 */
export function MessageComposerMessageField({
  channel,
  value = "",
  onChange,
  onBlur,
  status,
  statusText,
  disabled,
  id,
  className,
  maxLength = MESSAGE_FIELD_CONFIG[channel].maxLength,
}: MessageComposerMessageFieldProps) {
  const { t } = useTranslation("message-composer");
  const { channel: activeChannel, expanded } = useMessageComposer();
  const generatedId = useId();

  if (activeChannel !== channel) {
    return null;
  }

  const config = MESSAGE_FIELD_CONFIG[channel];
  const label =
    expanded && channel !== "chat"
      ? t(`fields.${channel}.messageLabel`)
      : undefined;
  const showPlaceholder = !expanded || config.placeholderWhenExpanded;

  return (
    <TextArea
      id={id ?? generatedId}
      className={cx("resize-none", expanded && "min-h-[240px]", className)}
      label={label}
      required={expanded && config.requiredWhenExpanded}
      placeholder={
        showPlaceholder ? t(`fields.${channel}.messagePlaceholder`) : undefined
      }
      value={value}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      onBlur={onBlur}
      status={status}
      statusText={statusText}
      disabled={disabled}
      maxLength={maxLength}
      helperText={
        maxLength == null ? undefined : `${value.length}/${maxLength}`
      }
    />
  );
}
