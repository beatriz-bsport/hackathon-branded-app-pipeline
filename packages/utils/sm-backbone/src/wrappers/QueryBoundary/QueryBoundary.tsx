import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  Suspense,
} from "react";

import { ErrorBoundaryWrapper } from "#src/wrappers/ErrorBoundaryWrapper";

import {
  QueryBoundaryCardLoader,
  QueryBoundarySectionErrorFallback,
} from "./fallbacks";

export type QueryBoundaryErrorFallbackProps = {
  error: Error;
  onRetry: () => void;
};

export type QueryBoundaryProps = PropsWithChildren<{
  appName: string;
  loadingFallback?: ReactNode;
  errorFallback?: (props: QueryBoundaryErrorFallbackProps) => ReactElement;
}>;

export const QueryBoundary = ({
  appName,
  children,
  loadingFallback = <QueryBoundaryCardLoader />,
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

    return <QueryBoundarySectionErrorFallback onRetry={handleRetry} />;
  };

  return (
    <ErrorBoundaryWrapper appName={appName} fallback={handleErrorBoundary}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundaryWrapper>
  );
};
