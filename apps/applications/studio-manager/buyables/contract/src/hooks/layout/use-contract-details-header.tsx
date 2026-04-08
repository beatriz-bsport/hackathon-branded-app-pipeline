import { Link, NavLink } from "react-router";

import type { Contract } from "@bsport/api-buyables/contract";
import { useCopyPaymentLinkButton } from "@bsport/kaizen-business-components/buyables/use-copy-payment-link-button";
import { useVisibilityBadgeConfig } from "@bsport/kaizen-business-components/buyables/visibility-selector";
import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS, URLS, getHrefFromRoot } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

/**
 * Provide the root elements of the header for the different details page (editor, overview, pauses)
 */
export const useContractDetailsHeader = ({
  contract,
  isVisible,
}: {
  contract: Contract;
  isVisible?: boolean;
}) => {
  const { t } = useTranslation("contract-details");

  const { id, company, contract_template, month_billing_day } = contract;

  const canBeArchived = !contract_template;
  const canBePaused = month_billing_day == null; // Pause is disabled for fixed-day contracts

  // ----- Tabs navigator -----

  const TABS_CONFIG = [
    {
      id: "contract-details-view-tab-editor",
      href: URLS.EDITOR(id),
      label: t("header.tabs.editor"),
      end: true, // :id => active is true | :id/anything-else => active is false
    },
    {
      id: "contract-details-view-tab-overview",
      href: URLS.OVERVIEW(id),
      label: t("header.tabs.overview"),
    },
    {
      id: "contract-details-view-tab-pauses",
      href: URLS.PAUSES(id),
      label: t("header.tabs.pauses"),
    },
  ];

  const tabsConfig: TabsProps = {
    TabsItems: TABS_CONFIG.map((tab) => {
      const { end, id, href, label } = tab;
      return (
        <NavLink to={getHrefFromRoot(href)} id={id} key={id} end={end}>
          {({ isActive }) => (
            <Tabs.Item id={id} label={label} isActive={isActive} />
          )}
        </NavLink>
      );
    }),
    orientation: "horizontal",
  };

  // ----- Visibility chip -----

  const statusBadge = useVisibilityBadgeConfig(!!isVisible);

  // ----- Breadcrumbs -----

  const breadcrumbs = [
    <Link key="link-to-contract-list" to={URLS.INDEX}>
      <Breadcrumbs.Item text={t("header.breadcrumbs.contracts")} />
    </Link>,
  ];

  // ----- Common actions -----

  const startGroupActionsRaw = [];

  const paymentLink = LEGACY_URLS.PAYMENT_LINK({
    buyableId: id,
    companyId: company,
  });
  const copyPaymentLinkButton = useCopyPaymentLinkButton(paymentLink);

  const pauseButton = (
    <Button
      key="contract-details-button-pause"
      color="default"
      intent="flat"
      size="md"
      icon="pause-square"
      kind="icon-button"
      label={t("header.actions.pauseContract")}
      onClick={() => alert("not implemented yet")}
    />
  );

  const archiveButton = (
    <Button
      key="contract-details-button-archive"
      color="default"
      intent="flat"
      size="md"
      icon="trash-01"
      kind="icon-button"
      label={t("header.actions.archiveContract")}
      onClick={() => alert("not implemented yet")}
    />
  );

  if (canBePaused) {
    startGroupActionsRaw.push(pauseButton);
  }
  if (canBeArchived) {
    startGroupActionsRaw.push(archiveButton);
  }
  startGroupActionsRaw.push(copyPaymentLinkButton);

  const { startGroupActions, endGroupActions } =
    DetailsLayout.useAdaptiveActions({
      startGroupActions: startGroupActionsRaw,
    });

  return {
    BreadcrumbsItems: breadcrumbs,
    pageStatusBadge: statusBadge,
    pageTabs: tabsConfig,
    startGroupActionsRaw,
    startGroupActions,
    endGroupActions,
  };
};
