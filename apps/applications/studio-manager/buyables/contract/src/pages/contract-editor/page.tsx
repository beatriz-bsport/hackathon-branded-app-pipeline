import type { FC } from "react";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { ContractDetailsSuspense } from "#src/components/contract-details-suspense";
import { useDetailsConfig } from "#src/hooks/layout/use-details-config";

const ContractEditorPageInner: FC = () => {
  const { detailsLayoutConfig, headerConfig, contract } = useDetailsConfig();
  const { detailsLayoutProps } = detailsLayoutConfig;

  return (
    <>
      {/** NB: will have ControlledForm wrapper later */}
      <DetailsLayout {...detailsLayoutProps} withPanel={true}>
        <DetailsLayout.Header pageTitle={contract.name} {...headerConfig} />
        <DetailsLayout.Content>
          {/** TEMPORARY SECTION */}
          <div className="max-w-component-select text-wrap break-words">
            {JSON.stringify(contract)}
          </div>
          {/** END OF TEMPORARY SECTION */}
        </DetailsLayout.Content>
      </DetailsLayout>
    </>
  );
};

export const ContractEditorPage: FC = () => {
  return (
    <ContractDetailsSuspense>
      <ContractEditorPageInner />
    </ContractDetailsSuspense>
  );
};
