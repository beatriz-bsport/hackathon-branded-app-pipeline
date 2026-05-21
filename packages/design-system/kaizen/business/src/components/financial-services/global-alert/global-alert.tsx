import React from "react";

import { AggregatedAlertsDrawer } from "#src/components/financial-services/global-alert/aggregated-alerts-drawer";
import { BlockingModal } from "#src/components/financial-services/global-alert/blocking-modal";
import { SingleAlertBanner } from "#src/components/financial-services/global-alert/single-alert-banner";
import {
  type GlobalAlertEntry,
  type GlobalAlertKind,
  type NonBlockingGlobalAlertSeverity,
  globalAlertKinds,
} from "#src/components/financial-services/global-alert/types";

export type GlobalAlertProps = {
  open: boolean;
  /**
   * Map of active alerts. Key is the alert kind; value is the alert entry (severity + optional due date).
   * Omit a key (or set it to `undefined`) to deactivate that alert.
   * Duplicate kinds are impossible by construction.
   */
  alerts: Partial<{ [kind in GlobalAlertKind]: GlobalAlertEntry }>;
  /** Called when the user dismisses (single alert or aggregate modal). The parent owns the alert map. */
  onDismiss?: () => void;
  /** Called when the user clicks a CTA. The parent handles the actual navigation. */
  onNavigate: (url: string) => void;
  /** Called when the user clicks the CTA for `"apple-developer-program-enrollment"` alerts — opens the Intercom chat. */
  openIntercom?: () => void;
};

/**
 * Surfaces account-level actions that require attention from studio owners and managers.
 *
 * Renders one of three layouts depending on the active alerts:
 * - **Single alert** — floating dismissible banner
 * - **Multiple alerts** — aggregate banner + detail drawer
 * - **Blocking alert** — non-dismissible full-screen modal
 *
 * The parent owns the alert map (`alerts`) and controls visibility (`open`).
 * Navigation, redirect URLs, and content strings are resolved internally from `kind`.
 */
export const GlobalAlert: React.FC<GlobalAlertProps> = ({
  open,
  alerts,
  onDismiss,
  onNavigate,
  openIntercom,
}) => {
  if (!open) return null;

  if (Object.values(alerts).filter(Boolean).length === 0) return null;

  const blockingKind = globalAlertKinds.find(
    (kind) => alerts[kind]?.severity === "blocking",
  );

  if (blockingKind) {
    return (
      <BlockingModal
        kind={blockingKind}
        dueDate={alerts[blockingKind]?.dueDate}
        onNavigate={onNavigate}
        openIntercom={openIntercom}
      />
    );
  }

  const nonBlockingAlerts = globalAlertKinds.filter((kind) => alerts[kind]);

  if (nonBlockingAlerts.length === 1) {
    const entry = alerts[nonBlockingAlerts[0]]!;
    return (
      <SingleAlertBanner
        kind={nonBlockingAlerts[0]}
        severity={entry.severity as NonBlockingGlobalAlertSeverity}
        dueDate={entry.dueDate}
        onDismiss={onDismiss}
        onNavigate={onNavigate}
        openIntercom={openIntercom}
      />
    );
  }

  return (
    <AggregatedAlertsDrawer
      alerts={
        alerts as Partial<{
          [kind in GlobalAlertKind]: {
            severity: NonBlockingGlobalAlertSeverity;
            dueDate?: (typeof alerts)[kind] extends { dueDate?: infer D }
              ? D
              : never;
          };
        }>
      }
      onDismiss={onDismiss}
      onNavigate={onNavigate}
      openIntercom={openIntercom}
    />
  );
};

GlobalAlert.displayName = "KaizenGlobalAlert";
