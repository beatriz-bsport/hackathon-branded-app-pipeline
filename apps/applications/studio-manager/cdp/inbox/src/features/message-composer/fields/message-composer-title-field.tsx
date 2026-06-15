import { useId } from "react";

import { TextField } from "@bsport/kaizen-primitive-core";

import { useMessageComposer } from "#src/features/message-composer/message-composer-context";
import { useTranslation } from "#src/utils/i18n";

import { TITLE_FIELD_CONFIG, type TitleFieldChannel } from "./constants";
import { type MessageComposerFieldControlProps } from "./types";

export type MessageComposerTitleFieldProps =
  MessageComposerFieldControlProps & {
    /** Channel this title belongs to — also gates rendering to that channel. */
    channel: TitleFieldChannel;
    maxLength?: number;
  };

/**
 * Single-line title input — the email subject or the push-notification
 * title, picked by `channel`. Renders only while its channel is active.
 * Collapsed shows a placeholder; expanded a labelled field. Channels with a
 * character cap show a counter.
 */
export function MessageComposerTitleField({
  channel,
  value = "",
  onChange,
  onBlur,
  status,
  statusText,
  disabled,
  id,
  className,
  maxLength = TITLE_FIELD_CONFIG[channel].maxLength,
}: MessageComposerTitleFieldProps) {
  const { t } = useTranslation("message-composer");
  const { channel: activeChannel, expanded } = useMessageComposer();
  const generatedId = useId();

  if (activeChannel !== channel) {
    return null;
  }

  const label = t(`fields.${channel}.titleLabel`);

  return (
    <TextField
      id={id ?? generatedId}
      className={className}
      label={expanded ? label : undefined}
      required={expanded && TITLE_FIELD_CONFIG[channel].requiredWhenExpanded}
      placeholder={expanded ? undefined : label}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      onBlur={onBlur}
      status={status}
      statusText={statusText}
      disabled={disabled}
      maxLength={maxLength}
      helperText={
        maxLength == null ? undefined : `${value.length}/${maxLength}`
      }
      fullWidth
    />
  );
}
