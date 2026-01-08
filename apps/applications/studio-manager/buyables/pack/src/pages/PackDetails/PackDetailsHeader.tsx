import type { FC } from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import {
  Button,
  type ButtonProps,
  DetailsLayout,
  Tooltip,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";
import type { Pack } from "@bsport/store-buyables-pack";

import type { PackFormSchema } from "#src/components/PackForm/schema";
import { useDetailsHeaderConfigs } from "#src/hooks/useDetailsHeaderConfigs";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const CopyPaymentLinkButton = (props: ButtonProps) => {
  const { t } = useTranslation("details");

  return (
    <Tooltip
      key="pack-details-button-copy-payment-link-with-tooltip"
      label={t("detailsPage.buttons.copyPaymentLink")}
    >
      <Button {...props} />
    </Tooltip>
  );
};

type PackDetailsHeaderProps = {
  methods: UseFormControllerOutput<PackFormSchema>;
  onDeleteClick: () => void;
  onEditTitleClick: () => void;
  pack: Pack;
  toggleIsPanelOpened: () => void;
};

export const PackDetailsHeader: FC<PackDetailsHeaderProps> = ({
  methods,
  onDeleteClick,
  onEditTitleClick,
  pack,
}) => {
  const { t } = useTranslation("details");

  const { watch } = methods;

  const headerConfigs = useDetailsHeaderConfigs({
    id: pack.id,
    hidden: watch("manager_only"),
  });

  const { copyToClipboard } = useCopyToClipboard({
    toastMessage: t("detailsPage.toasts.paymentLinkCopied"),
  });

  const paymentLink = LEGACY_URLS.PAYMENT_LINK({
    id: pack.id,
    company: pack.company,
  });

  const { endGroupActions, startGroupActions, isMobile } =
    DetailsLayout.useAdaptiveActions({
      endGroupActions: [
        <CopyPaymentLinkButton
          key="pack-details-button-copy-payment-link"
          color="default"
          intent="flat"
          size="md"
          kind="icon-button"
          icon="link-01"
          label={t("detailsPage.buttons.copyPaymentLink")}
          onClick={() => copyToClipboard(paymentLink)}
        />,
      ],
      startGroupActions: [
        <Button
          key="pack-details-button-delete-pack"
          color="default"
          intent="flat"
          size="md"
          icon="trash-01"
          kind="icon-button"
          label={t("detailsPage.buttons.deletePack")}
          onClick={onDeleteClick}
        />,
      ],
      mobileOnlyActions: [
        <Button
          key="pack-details-button-edit-pack-name"
          color="default"
          intent="flat"
          size="md"
          icon="edit-02"
          kind="icon-button"
          label={t("detailsPage.buttons.renamePack")}
          onClick={onEditTitleClick}
        />,
      ],
    });

  return (
    <DetailsLayout.Header
      pageTitle={watch("name")}
      {...headerConfigs}
      onEditTitleClick={isMobile ? undefined : onEditTitleClick}
      endGroupActions={endGroupActions}
      startGroupActions={startGroupActions}
    />
  );
};
