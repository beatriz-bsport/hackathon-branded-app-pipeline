import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type MessageComposerSendButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit";
  form?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

/**
 * The composer's call-to-action Send button.
 */
export function MessageComposerSendButton({
  onClick,
  type = "button",
  form,
  disabled,
  loading,
  className,
}: MessageComposerSendButtonProps) {
  const { t } = useTranslation("message-composer");

  return (
    <Button
      intent="call-to-action"
      color="main"
      size="md"
      iconLeft="send-01"
      label={t("send")}
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={className}
    />
  );
}
