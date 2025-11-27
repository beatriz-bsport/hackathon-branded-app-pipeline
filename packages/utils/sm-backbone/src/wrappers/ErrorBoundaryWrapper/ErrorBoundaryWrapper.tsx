import { ComponentProps, type PropsWithChildren } from "react";

import { ErrorFallback } from "@bsport/kaizen-primitive-core";
import {
  ApplicationScopeProvider,
  ErrorBoundary,
  sendFeedback,
} from "@bsport/sentry";

import { dataAccessLayer } from "#src/data-access-layer";

type ErrorBoundaryWrapperProps = PropsWithChildren<{
  appName: string;
  fallback?: ComponentProps<typeof ErrorBoundary>["fallback"];
}>;

const ErrorFallbackWithSentryFeedback = ({
  onSendFeedback,
}: {
  onSendFeedback: ({ feedbackContent }: { feedbackContent: string }) => void;
}) => {
  return (
    <ErrorFallback
      className="mx-auto"
      actionProps={ErrorFallback.DEFAULT_ACTION_PROPS}
      onSendFeedback={onSendFeedback}
    />
  );
};

export const ErrorBoundaryWrapper = ({
  appName,
  children,
  fallback,
}: ErrorBoundaryWrapperProps) => {
  const userData = dataAccessLayer.useUserAccess();

  const onSendFeedback = ({ feedbackContent }: { feedbackContent: string }) => {
    const url = window?.location.href;
    const feedbackParams = {
      name: userData?.name,
      email: userData?.username,
      message: feedbackContent,
      url,
    };
    sendFeedback(feedbackParams, { includeReplay: true });
  };

  return (
    <ApplicationScopeProvider appName={appName}>
      <ErrorBoundary
        fallback={
          fallback ?? (
            <ErrorFallbackWithSentryFeedback onSendFeedback={onSendFeedback} />
          )
        }
      >
        {children}
      </ErrorBoundary>
    </ApplicationScopeProvider>
  );
};
