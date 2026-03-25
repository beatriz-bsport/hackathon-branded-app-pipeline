import type { FC } from "react";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { ContractDetailsSuspense } from "#src/components/contract-details-suspense";
import { useDetailsConfig } from "#src/hooks/layout/use-details-config";

const ContractOverviewPageInner: FC = () => {
  const { detailsLayoutConfig, headerConfig, contract } = useDetailsConfig();
  const { detailsLayoutProps } = detailsLayoutConfig;

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel={true}>
      <DetailsLayout.Header pageTitle={contract.name} {...headerConfig} />
      <DetailsLayout.Content>
        This will be the overview page
      </DetailsLayout.Content>
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
