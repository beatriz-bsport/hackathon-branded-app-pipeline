import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  type ComponentType,
  type PropsWithChildren,
  ReactNode,
  Suspense,
} from "react";

import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

import { CardLoader, SectionErrorFallback } from "./fallbacks";

export type QueryBoundaryProps = PropsWithChildren<{
  loadingFallback?: ReactNode;
  errorFallback?: ComponentType<{
    error: Error;
    onRetry: () => void;
  }>;
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
      const ErrorFallbackComponent = errorFallback;

      return <ErrorFallbackComponent error={error} onRetry={handleRetry} />;
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
