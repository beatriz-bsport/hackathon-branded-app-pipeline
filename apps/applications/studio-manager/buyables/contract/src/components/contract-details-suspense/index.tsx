import type { FC, ReactNode } from "react";

import { QueryBoundary } from "#src/components/query-boundary";

import { DetailsFetchError } from "./details-fetch-error";
import { DetailsLoadingPage } from "./details-loading-page";

type ContractDetailsSuspenseProps = {
  children: ReactNode;
};

export const ContractDetailsSuspense: FC<ContractDetailsSuspenseProps> = ({
  children,
}) => {
  return (
    <QueryBoundary
      loadingFallback={<DetailsLoadingPage />}
      errorFallback={() => <DetailsFetchError />}
    >
      {children}
    </QueryBoundary>
  );
};
