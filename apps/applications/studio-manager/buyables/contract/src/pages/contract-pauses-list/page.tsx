import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { ContractDetailsSuspense } from "#src/components/contract-details-suspense";
import { useDetailsConfig } from "#src/hooks/layout/use-details-config";

const ContractPausesListPageInner: FC = () => {
  const { headerConfig, contract } = useDetailsConfig();

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={contract.name} {...headerConfig} />
      <ListLayout.Content>This will be the pauses page</ListLayout.Content>
    </ListLayout>
  );
};

export const ContractPausesListPage: FC = () => {
  return (
    <ContractDetailsSuspense>
      <ContractPausesListPageInner />
    </ContractDetailsSuspense>
  );
};
