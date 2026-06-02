import type { FC } from "react";

import { Card, DetailsLayout } from "@bsport/kaizen-primitive-core";

import { ContractDetailsSuspense } from "#src/components/contract-details-suspense";
import { QueryBoundary } from "#src/components/query-boundary";
import {
  MembershipPlanList,
  MembershipPlanListLoading,
} from "#src/features/membership-plan-list";
import { useDetailsConfig } from "#src/hooks/layout/use-details-config";

const ContractOverviewPageInner: FC = () => {
  const { detailsLayoutConfig, headerConfig, contract, modals } =
    useDetailsConfig();
  const { detailsLayoutProps } = detailsLayoutConfig;

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel={true}>
      <DetailsLayout.Header pageTitle={contract.name} {...headerConfig} />

      <DetailsLayout.Content>
        <QueryBoundary loadingFallback={<MembershipPlanListLoading />}>
          <Card padding="none">
            <MembershipPlanList contractId={contract.id} />
          </Card>
        </QueryBoundary>
      </DetailsLayout.Content>

      {modals}
    </DetailsLayout>
  );
};

export const ContractOverviewPage: FC = () => {
  return (
    <ContractDetailsSuspense>
      <ContractOverviewPageInner />
    </ContractDetailsSuspense>
  );
};
