import React from "react";

import { Alert } from "@bsport/kaizen-primitive-core";

import { redirectUrls } from "#src/components/financial-services/global-alert/constants";
import { DueDateChip } from "#src/components/financial-services/global-alert/due-date-chip";
import type {
  GlobalAlertKind,
  NonBlockingGlobalAlertSeverity,
} from "#src/components/financial-services/global-alert/types";
import { useAlertContent } from "#src/components/financial-services/global-alert/use-alert-content";

type SingleAlertBannerProps = {
  kind: GlobalAlertKind;
  severity: NonBlockingGlobalAlertSeverity;
  dueDate?: string;
  onDismiss?: () => void;
  onNavigate: (url: string) => void;
  openIntercom?: () => void;
  openAppleAgreements?: () => void;
};

/**
 * Floating banner anchored to the top of the viewport for a single non-blocking alert.
 * Dismissible via the clear button; the optional `dueDate` chip appears inline with the title.
 */
export const SingleAlertBanner: React.FC<SingleAlertBannerProps> = ({
  kind,
  severity,
  dueDate,
  onDismiss,
  onNavigate,
  openIntercom,
  openAppleAgreements,
}) => {
  const { title, description, ctaLabel } = useAlertContent(kind);
  const handleCta =
    kind === "apple-developer-program-enrollment" && openIntercom
      ? openIntercom
      : kind === "apple-developer-pending-agreements" && openAppleAgreements
        ? openAppleAgreements
        : () => onNavigate(redirectUrls[kind]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 m-sm">
      <Alert
        status={severity}
        type="strong"
        layout="banner"
        title={title}
        titleSuffix={
          dueDate ? (
            <DueDateChip dueDate={dueDate} severity={severity} />
          ) : undefined
        }
        buttonLabel={ctaLabel}
        onButtonClick={handleCta}
        onClearClick={onDismiss}
      >
        {description}
      </Alert>
    </div>
  );
};
