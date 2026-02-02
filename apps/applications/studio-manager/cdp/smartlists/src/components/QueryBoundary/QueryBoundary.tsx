import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  type PropsWithChildren,
  ReactElement,
  ReactNode,
  Suspense,
} from "react";

import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

import { CardLoader, SectionErrorFallback } from "./fallbacks";

export type QueryBoundaryProps = PropsWithChildren<{
  loadingFallback?: ReactNode;
  errorFallback?: (props: {
    error: Error;
    onRetry: () => void;
  }) => ReactElement;
}>;

export const QueryBoundary = ({
  children,
  loadingFallback = <CardLoader />,
  errorFallback,
}: QueryBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary();

  const handleErrorBoundary = ({
    error,
    resetError,
  }: {
    error: Error;
    resetError: () => void;
  }) => {
    const handleRetry = () => {
      reset();
      resetError();
    };

    if (errorFallback) {
      return errorFallback({ error, onRetry: handleRetry });
    }

    return <SectionErrorFallback onRetry={handleRetry} />;
  };

  return (
    <ErrorBoundaryWrapper
      appName={__SMARTLISTS__.__SENTRY_SCOPE_TAG__}
      fallback={handleErrorBoundary}
    >
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundaryWrapper>
  );
};
