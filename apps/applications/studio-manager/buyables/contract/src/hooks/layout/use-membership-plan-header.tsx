import { Link, NavLink } from "react-router";

import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import type { Contract } from "@bsport/api-buyables/contract";
import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { MembershipPlanCancelModal } from "#src/features/membership-plan-cancel-modal/membership-plan-cancel-modal";
import { MembershipPlanPauseModal } from "#src/features/membership-plan-pause-modal";
import { useDisclosure } from "#src/hooks/utils/use-disclosure";
import { URLS, getHrefFromRoot } from "#src/urls";
import { useToday } from "#src/utils/date";
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

  const {
    isOpen: isPauseModalOpen,
    onClose: closePauseModal,
    onOpen: openPauseModal,
  } = useDisclosure();

  const today = useToday().toISODate()!;

  const hasCurrentPause =
    membershipPlan?.pauses.some(
      (pause) => pause.from_date <= today && today <= pause.until_date,
    ) ?? false;

  const {
    isOpen: isCancelModalOpen,
    onClose: closeCancelModal,
    onOpen: openCancelModal,
  } = useDisclosure();

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

  const pauseButton = (
    <Button
      key="membership-plan-button-pause"
      color="default"
      intent="flat"
      size="md"
      icon="pause-square"
      kind="icon-button"
      label={t("header.actions.pauseMembershipPlan")}
      onClick={openPauseModal}
      disabled={!membershipPlan?.editable || hasCurrentPause}
    />
  );
  const cancelButton = (
    <Button
      key="membership-plan-button-cancel"
      color="default"
      intent="flat"
      size="md"
      icon="x-circle"
      kind="icon-button"
      label={t("header.actions.cancelSubscription")}
      onClick={openCancelModal}
      disabled={!membershipPlan || !!membershipPlan.canceled_at}
    />
  );

  const { startGroupActions, endGroupActions } =
    DetailsLayout.useAdaptiveActions({
      startGroupActions: [pauseButton, cancelButton],
    });

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
    startGroupActions,
    endGroupActions,
    modals: (
      <>
        <MembershipPlanPauseModal
          billingPlanId={membershipPlanId}
          closeModal={closePauseModal}
          existingPauses={membershipPlan?.pauses ?? []}
          isOpen={isPauseModalOpen}
        />
        <MembershipPlanCancelModal
          billingPlanId={membershipPlanId}
          closeModal={closeCancelModal}
          isOpen={isCancelModalOpen}
        />
      </>
    ),
  };
};
