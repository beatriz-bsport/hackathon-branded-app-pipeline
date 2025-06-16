import { PropsWithChildren } from "react";

import { ApplicationScopeProvider, ErrorBoundary } from "@bsport/sentry";

type ErrorBoundaryWrapperProps = PropsWithChildren<{
  appName: string;
}>;

export const ErrorBoundaryWrapper = ({
  appName,
  children,
}: ErrorBoundaryWrapperProps) => {
  return (
    <ApplicationScopeProvider appName={appName}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </ApplicationScopeProvider>
  );
};
