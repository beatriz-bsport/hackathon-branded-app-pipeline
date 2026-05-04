import type { PropsWithChildren, ReactElement, ReactNode } from "react";

import { QueryBoundary as BackboneQueryBoundary } from "@bsport/sm-backbone";

export type QueryBoundaryProps = PropsWithChildren<{
  loadingFallback: ReactNode;
  errorFallback: (props: { error: Error; onRetry: () => void }) => ReactElement;
}>;

export const QueryBoundary = ({
  children,
  loadingFallback,
  errorFallback,
}: QueryBoundaryProps) => {
  return (
    <BackboneQueryBoundary
      appName={__CONTRACT__.__SENTRY_SCOPE_TAG__}
      loadingFallback={loadingFallback}
      errorFallback={errorFallback}
    >
      {children}
    </BackboneQueryBoundary>
  );
};
