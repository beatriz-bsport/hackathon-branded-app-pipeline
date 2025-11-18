import type { FC } from "react";
import { Link } from "react-router";

import type { UseFormControllerOutput } from "@bsport/form";
import {
  Breadcrumbs,
  Button,
  CopyToClipboard,
  DetailsLayout,
} from "@bsport/kaizen-primitive-core";
import type { Pack } from "@bsport/store-buyables-pack";

import type { PackFormSchema } from "#src/components/PackForm/schema";
import { LEGACY_URLS, URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type PackDetailsHeaderProps = {
  methods: UseFormControllerOutput<PackFormSchema>;
  pack: Pack;
  toggleIsPanelOpened: () => void;
};

export const PackDetailsHeader: FC<PackDetailsHeaderProps> = ({
  methods,
  pack,
  toggleIsPanelOpened,
}) => {
  const { t } = useTranslation("details");

  const { watch } = methods;

  const visibilityBadge = watch("manager_only")
    ? t(
        "formFields.visibilitySection.visibilitySelector.options.hidden.shortTitle",
      )
    : t(
        "formFields.visibilitySection.visibilitySelector.options.visible.shortTitle",
      );

  return (
    <DetailsLayout.Header
      pageTitle={watch("name")}
      pageStatusBadge={{
        color: watch("manager_only") ? "default" : "main",
        size: "lg",
        text: visibilityBadge,
      }}
      BreadcrumbsItems={[
        <Link key="to-packs-list" to={URLS.INDEX}>
          <Breadcrumbs.Item text={t("detailsPage.packsBreadcrumbs")} />
        </Link>,
      ]}
      onEditTitleClick={() => {
        console.log("onEditTitleClick triggered");
      }}
      endGroupActions={[
        <CopyToClipboard
          key="pack-details-button-copy-payment-link"
          color="default"
          intent="flat"
          size="md"
          kind="icon-button"
          icon="link-01"
          toastMessage={t("detailsPage.toasts.paymentLinkCopied")}
          tooltip={t("detailsPage.buttons.copyPaymentLink")}
          label={t("detailsPage.buttons.copyPaymentLink")}
          value={LEGACY_URLS.PAYMENT_LINK({
            id: pack.id,
            company: pack.company,
          })}
        />,
        <Button
          key="pack-details-button-open-panel"
          color="default"
          intent="flat"
          size="md"
          kind="icon-button"
          icon="layout-alt-02"
          label="button-open-panel"
          onClick={() => toggleIsPanelOpened()}
        />,
      ]}
      startGroupActions={[
        <Button
          key="pack-details-button-delete-pack"
          color="default"
          intent="flat"
          size="md"
          icon="trash-01"
          kind="icon-button"
          label="button-delete-pack"
          onClick={() => {
            console.log("onDeleteClick triggered");
          }}
        />,
      ]}
    />
  );
};
