import React from "react";

import Button, { type ButtonProps } from "#src/components/Button";
import { toast } from "#src/components/Toast";
import Tooltip, { type TooltipProps } from "#src/components/Tooltip";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export type CopyToClipboardProps = {
  value?: string;
  toastMessage?: string;
  label?: string;
  tooltip?: string;
  placement?: TooltipProps["placement"];
} & ButtonProps;

/**
 * Render a button that copies a value to the clipboard and shows a toast confirmation.<br>
 * The button is wrapped in a tooltip for accessibility.
 * @param props.value The string to copy to clipboard. If falsy, nothing is rendered.
 * @param props.toastMessage The message to show in the toast after copying. Defaults to "Copied to clipboard".
 * @param props.label The label to show on the button. Defaults to the value.
 * @param props.tooltip Tooltip to show on hover. Defaults to "Click to copy".
 * @param props.placement Tooltip placement. Defaults to "bottom".
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-copytoclipboard--docs
 */
const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  toastMessage,
  label,
  tooltip,
  placement = "bottom",
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  if (!value) return null;

  const handleCopy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (props.disabled) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);

        const selection = document.getSelection();
        const originalRange =
          selection && selection.rangeCount > 0
            ? selection.getRangeAt(0)
            : null;

        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("Fallback: copy command failed", err);
        }
        document.body.removeChild(textarea);

        // Restore previous selection if possible
        if (originalRange && selection) {
          selection.removeAllRanges();
          selection.addRange(originalRange);
        }
      }
      toast({
        status: "default",
        icon: "copy-07",
        title: toastMessage ?? t("copyToClipboard.copied"),
        buttonIcon: "x-close",
      });
    } catch {
      toast({
        status: "critical",
        icon: "alert-triangle",
        title: t("copyToClipboard.failed"),
        buttonIcon: "x-close",
      });
    }
  };

  return (
    <Tooltip
      label={tooltip ?? t("copyToClipboard.tooltip")}
      placement={placement}
    >
      <Button onClick={handleCopy} label={label ?? value} {...props} />
    </Tooltip>
  );
};

CopyToClipboard.displayName = "KaizenCopyToClipboard";

export default CopyToClipboard;
