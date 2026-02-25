import type { FC } from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { useCopyPaymentLinkButton } from "@bsport/kaizen-business-components/buyables/use-copy-payment-link-button";
import { Button, DetailsLayout } from "@bsport/kaizen-primitive-core";
import type { Pack } from "@bsport/store-buyables-pack";

import type { PackFormSchema } from "#src/components/PackForm/schema";
import { useDetailsHeaderConfigs } from "#src/hooks/useDetailsHeaderConfigs";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type PackDetailsHeaderProps = {
  methods: UseFormControllerOutput<PackFormSchema>;
  onDeleteClick: () => void;
  onEditTitleClick: () => void;
  pack: Pack;
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

  const paymentLink = LEGACY_URLS.PAYMENT_LINK({
    id: pack.id,
    company: pack.company,
  });

  const copyPaymentLinkButton = useCopyPaymentLinkButton(paymentLink);

  const { endGroupActions, startGroupActions, isMobile } =
    DetailsLayout.useAdaptiveActions({
      endGroupActions: [copyPaymentLinkButton],
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
