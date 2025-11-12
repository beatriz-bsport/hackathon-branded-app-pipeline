import React from "react";

import Button, { type ButtonProps } from "#src/components/Button";
import Tooltip, { type TooltipProps } from "#src/components/Tooltip";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { useCopyToClipboard } from "./use-copy-to-clipboard";

export type CopyToClipboardProps = {
  value?: string;
  toastMessage?: string;
  tooltip?: string;
  placement?: TooltipProps["placement"];
} & ButtonProps;

/**
 * Render a button that copies a value to the clipboard and shows a toast confirmation.
 * The button is wrapped in a tooltip for accessibility.
 *
 * When clicked, the component copies the `value` prop to clipboard. If `value` is not provided,
 * it copies the `label` instead. On success, displays a success toast; on failure, displays an error toast.
 *
 * @param props.value - The string to copy to clipboard. If not provided, copies `label` instead.
 * @param props.label - (Required) The text to display on the button. Also used as fallback value to copy if `value` is not provided.
 * @param props.toastMessage - Custom message to show in the success toast. Defaults to translated "Copied to clipboard".
 * @param props.tooltip - Tooltip text shown on hover. Defaults to translated "Click to copy".
 * @param props.placement - Tooltip placement relative to the button. Defaults to "bottom".
 * @param props.disabled - When true, prevents the copy action and applies disabled button styling.
 * @param props.size - Button size: "sm", "md", or "lg". Inherited from ButtonProps.
 * @param props.color - Button color variant: "default", "main", "critical", or "onstrong". Inherited from ButtonProps.
 * @param props.intent - Button intent style: "flat", "default", or "call-to-action". Inherited from ButtonProps.
 * @param props.iconLeft - Icon name to display on the left side of the button label. Inherited from ButtonProps.
 * @param props.className - Additional CSS classes for custom styling. Inherited from ButtonProps.
 *
 * @returns The copy button with tooltip, or null if both `value` and `label` are falsy.
 *
 * @example
 * // Basic usage with value
 * <CopyToClipboard value="hello@kaizen.com" label="Copy email" />
 *
 * @example
 * // Custom styling and icon
 * <CopyToClipboard
 *   value="+33 6 12 34 56 78"
 *   label="Copy phone"
 *   color="main"
 *   iconLeft="copy-07"
 *   toastMessage="Phone copied!"
 * />
 *
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

  const { copyToClipboard } = useCopyToClipboard({
    toastMessage,
    disabled: props.disabled,
  });

  if (!value && !label) {
    return null;
  }

  const handleCopy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    await copyToClipboard(value ?? label);
  };

  return (
    <Tooltip
      label={tooltip ?? t("copyToClipboard.tooltip")}
      placement={placement}
    >
      <Button onClick={handleCopy} label={label} {...props} />
    </Tooltip>
  );
};

CopyToClipboard.displayName = "KaizenCopyToClipboard";

export default CopyToClipboard;
