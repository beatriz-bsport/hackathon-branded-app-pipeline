import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { ContractDetailsSuspense } from "#src/components/contract-details-suspense";
import { ContractPauseList } from "#src/features/contract-pause-list";
import { useDetailsConfig } from "#src/hooks/layout/use-details-config";

const ContractPausesListPageInner: FC = () => {
  const { headerConfig, contract, modals } = useDetailsConfig();

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={contract.name} {...headerConfig} />

      <ListLayout.Content>
        <ContractPauseList contract={contract} />
      </ListLayout.Content>

      {modals}
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
