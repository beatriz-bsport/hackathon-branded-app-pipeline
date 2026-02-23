import {
  Button,
  type ButtonProps,
  Tooltip,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

/**
 * Component that consumes ButtonProps and can be read by
 * useAdaptativeAction
 */
// eslint-disable-next-line react-refresh/only-export-components
const CopyPaymentLinkButton = (props: ButtonProps) => {
  return (
    <Tooltip key={props.id} label={props.label}>
      <Button {...props} />
    </Tooltip>
  );
};

export const useCopyPaymentLinkButton = (paymentLink: string) => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const { copyToClipboard } = useCopyToClipboard({
    toastMessage: t("copyPaymentLinkButton.toastSuccess"),
  });

  const onClick = () => copyToClipboard(paymentLink);

  const id = `copy-payment-link-${paymentLink}`;
  return (
    <CopyPaymentLinkButton
      key={id}
      id={id}
      color="default"
      intent="flat"
      size="md"
      kind="icon-button"
      icon="link-01"
      label={t("copyPaymentLinkButton.tooltip")}
      onClick={onClick}
    />
  );
};
