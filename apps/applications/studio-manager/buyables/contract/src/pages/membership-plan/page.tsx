import { type FC, useState } from "react";
import { Navigate, useParams } from "react-router";

import {
  Body,
  Card,
  DetailsLayout,
  SegmentedControl,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { ContractDetailsSuspense } from "#src/components/contract-details-suspense";
import { useFetchContract } from "#src/hooks/api/use-fetch-contract";
import { useFetchMembershipPlan } from "#src/hooks/api/use-fetch-membership-plan";
import { useMembershipPlanHeader } from "#src/hooks/layout/use-membership-plan-header";
import { URLS, getHrefFromRoot } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

const PANEL_TABS = {
  DETAILS: "details",
  PAYMENT_METHOD: "payment-method",
} as const;

type PanelTab = (typeof PANEL_TABS)[keyof typeof PANEL_TABS];

const MembershipPlanPageInner: FC<{
  contractId: number;
  membershipPlanId: number;
}> = ({ contractId, membershipPlanId }) => {
  const { t } = useTranslation("membership-plan");
  const { detailsLayoutProps } = useDetailsLayout();

  const { tab } = useParams();
  const activeContentTab = tab === "history" ? "history" : "billing";

  const [panelTab, setPanelTab] = useState<PanelTab>(PANEL_TABS.DETAILS);

  const { data: contract } = useFetchContract({ id: contractId });
  const { data: membershipPlan, isLoading } =
    useFetchMembershipPlan(membershipPlanId);

  const headerConfig = useMembershipPlanHeader({
    contract,
    membershipPlan,
    membershipPlanId,
  });

  const panelOptions = [
    { value: PANEL_TABS.DETAILS, label: t("panelTabs.details") },
    { value: PANEL_TABS.PAYMENT_METHOD, label: t("panelTabs.paymentMethod") },
  ];

  if (isLoading) {
    return (
      <DetailsLayout {...detailsLayoutProps} withPanel={true}>
        <DetailsLayout.Header pageTitle={t("header.loading")} />
        <DetailsLayout.Content>
          <Card>
            <Body size="md">{t("header.loading")}</Body>
          </Card>
        </DetailsLayout.Content>
      </DetailsLayout>
    );
  }

  invariant(membershipPlan, "Membership plan not found");

  if (membershipPlan.contract !== contractId) {
    return <Navigate to={getHrefFromRoot(URLS.OVERVIEW(contractId))} replace />;
  }

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel={true}>
      <DetailsLayout.Header {...headerConfig} />

      <DetailsLayout.Content>
        {activeContentTab === "billing" && (
          <Card>
            <Body size="md">{t("content.billingPlaceholder")}</Body>
          </Card>
        )}
        {activeContentTab === "history" && (
          <Card>
            <Body size="md">{t("content.historyPlaceholder")}</Body>
          </Card>
        )}
      </DetailsLayout.Content>

      <DetailsLayout.Panel className="flex flex-col gap-xs">
        <SegmentedControl
          id="membership-plan-panel-tabs"
          fullWidth
          options={panelOptions}
          value={panelTab}
          onChangeValue={(value) => setPanelTab(value as PanelTab)}
        />

        <Body size="md">
          {panelTab === PANEL_TABS.DETAILS
            ? t("panel.detailsPlaceholder")
            : t("panel.paymentMethodPlaceholder")}
        </Body>
      </DetailsLayout.Panel>
    </DetailsLayout>
  );
};

const MembershipPlanPageGuard: FC = () => {
  const { id: rawContractId, membershipPlanId: rawMembershipPlanId } =
    useParams();

  const contractId =
    rawContractId && /^\d+$/.test(rawContractId)
      ? Number(rawContractId)
      : undefined;
  const membershipPlanId =
    rawMembershipPlanId && /^\d+$/.test(rawMembershipPlanId)
      ? Number(rawMembershipPlanId)
      : undefined;

  invariant(contractId, "Invalid contract id");
  invariant(membershipPlanId, "Invalid membership plan id");

  return (
    <MembershipPlanPageInner
      contractId={contractId}
      membershipPlanId={membershipPlanId}
    />
  );
};

export const MembershipPlanPage: FC = () => {
  return (
    <ContractDetailsSuspense>
      <MembershipPlanPageGuard />
    </ContractDetailsSuspense>
  );
};

export { MembershipPlanPage as default };
