import { Link, NavLink } from "react-router";

import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import type { Contract } from "@bsport/api-buyables/contract";
import {
  Breadcrumbs,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { URLS, getHrefFromRoot } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

/**
 * Returns the header configuration (page title, breadcrumbs and tabs) for the
 * membership-plan detail page.
 *
 * Breadcrumb trail: "Subscription" (contract list) → contract name (contract
 * overview) → current page.
 *
 * `membershipPlan` is optional so the hook can be called unconditionally while
 * the plan is still loading; an empty title is returned in that case.
 */
export const useMembershipPlanHeader = ({
  contract,
  membershipPlan,
  membershipPlanId,
}: {
  contract: Contract;
  membershipPlan: BillingPlan | undefined;
  membershipPlanId: number;
}) => {
  const { t } = useTranslation("membership-plan");

  const TABS_CONFIG = [
    {
      id: "membership-plan-tab-billing",
      href: URLS.MEMBERSHIP_PLAN(contract.id, membershipPlanId),
      label: t("tabs.billing"),
      end: true, // active only on the base path, not on /history
    },
    {
      id: "membership-plan-tab-history",
      href: URLS.MEMBERSHIP_PLAN_HISTORY(contract.id, membershipPlanId),
      label: t("tabs.history"),
    },
  ];

  const pageTabs: TabsProps = {
    TabsItems: TABS_CONFIG.map(({ end, id, href, label }) => (
      <NavLink to={getHrefFromRoot(href)} id={id} key={id} end={end}>
        {({ isActive }) => (
          <Tabs.Item id={id} label={label} isActive={isActive} />
        )}
      </NavLink>
    )),
    orientation: "horizontal",
  };

  return {
    pageTitle: membershipPlan?.memberName ?? "",
    BreadcrumbsItems: [
      <Link key="link-to-contract-list" to={URLS.INDEX}>
        <Breadcrumbs.Item text={t("header.breadcrumbs.subscription")} />
      </Link>,
      <Link
        key="link-to-contract-overview"
        to={getHrefFromRoot(URLS.OVERVIEW(contract.id))}
      >
        <Breadcrumbs.Item text={contract.name} />
      </Link>,
    ],
    pageTabs,
  };
};
