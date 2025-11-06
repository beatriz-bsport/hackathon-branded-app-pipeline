import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router";

import {
  Breadcrumbs,
  Button,
  CopyToClipboard,
  DetailsLayout,
  Loader,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { selectPack, usePackStore } from "@bsport/store-buyables-pack";

import { useFetchPack } from "#src/hooks/useFetchPack";
import { LEGACY_URLS, URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const PackDetailsPage: React.FC = () => {
  const { t } = useTranslation("details");

  const { id } = useParams();
  const parsedId = id ? parseInt(id, 10) : undefined;
  const validId = parsedId && !isNaN(parsedId) ? parsedId : undefined;

  const { isLoading } = useFetchPack({ id: validId });
  const pack = usePackStore((state) => selectPack(state, validId));

  const { detailsLayoutProps, toggleIsPanelOpened } = useDetailsLayout();

  if (!pack) {
    return isLoading ? (
      <DetailsLayout {...detailsLayoutProps}>
        <DetailsLayout.Header pageTitle={t("detailsPage.loading")} />
        <DetailsLayout.Content>
          <Loader size="xl" />
        </DetailsLayout.Content>
      </DetailsLayout>
    ) : null;
  }

  const visibilityBadge = pack.manager_only
    ? t(
        "formFields.visibilitySection.visibilitySelector.options.hidden.shortTitle",
      )
    : t(
        "formFields.visibilitySection.visibilitySelector.options.visible.shortTitle",
      );

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pack.name}
        pageStatusBadge={{
          color: pack.manager_only ? "default" : "main",
          size: "lg",
          text: visibilityBadge,
        }}
        BreadcrumbsItems={[
          <Link key="to-packs-list" to={URLS.INDEX}>
            <Breadcrumbs.Item text={t("detailsPage.packsBreadcrumbs")} />
          </Link>,
        ]}
        onEditTitleClick={() => {
          /** @todo Replace */
          console.log("Open modal to edit name");
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
              /** @todo Replace */
              console.log("Open 'Delete pack modal'");
            }}
          />,
        ]}
      />
      <DetailsLayout.Content>
        {/** Placeholder for the layout, will be removed in the next steps */}
        <h3>Pack n°{id}</h3>
        {JSON.stringify(pack)}
      </DetailsLayout.Content>
      <DetailsLayout.Panel>Placeholder for Panel</DetailsLayout.Panel>
      <DetailsLayout.Confirmation
        onDiscard={() => {
          /** @todo Replace */
          console.log("Changes discarded");
        }}
        onSave={() => {
          /** @todo Replace */
          console.log("Changes saved");
        }}
      />
    </DetailsLayout>
  );
};
