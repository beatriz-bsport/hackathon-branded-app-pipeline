import React from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { redirectUrls } from "#src/components/financial-services/global-alert/constants";
import { DueDateChip } from "#src/components/financial-services/global-alert/due-date-chip";
import type { GlobalAlertKind } from "#src/components/financial-services/global-alert/types";
import { useAlertContent } from "#src/components/financial-services/global-alert/use-alert-content";

type BlockingModalProps = {
  kind: GlobalAlertKind;
  dueDate?: string;
  onNavigate: (url: string) => void;
  openIntercom?: () => void;
  openAppleAgreements?: () => void;
};

/**
 * Full-screen non-dismissible modal for blocking alerts.
 * The user must act on the CTA before they can continue using the back-office.
 * The optional `dueDate` chip appears inline with the title.
 */
export const BlockingModal: React.FC<BlockingModalProps> = ({
  kind,
  dueDate,
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
    <Modal
      open
      size="md"
      title={
        dueDate ? (
          <span className="flex items-center gap-xs">
            {title}
            <DueDateChip dueDate={dueDate} severity={"blocking"} />
          </span>
        ) : (
          title
        )
      }
      description={description}
      disableClose
      disableClickOutsideClose
      confirmButton={{
        label: ctaLabel,
        color: "main",
        onClick: handleCta,
      }}
    />
  );
};
