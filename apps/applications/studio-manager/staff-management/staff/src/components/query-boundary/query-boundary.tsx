import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
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
    error: unknown;
    resetError: () => void;
  }) => {
    const handleRetry = () => {
      reset();
      resetError();
    };

    if (errorFallback) {
      const normalizedError =
        error instanceof Error ? error : new Error(String(error));
      return errorFallback({ error: normalizedError, onRetry: handleRetry });
    }

    return <SectionErrorFallback onRetry={handleRetry} />;
  };

  return (
    <ErrorBoundaryWrapper
      appName={__STAFF__.__SENTRY_SCOPE_TAG__}
      fallback={handleErrorBoundary}
    >
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundaryWrapper>
  );
};
