import React, { useState } from "react";

import {
  Alert,
  Body,
  Button,
  DetailDrawer,
  Divider,
  Title,
} from "@bsport/kaizen-primitive-core";

import {
  globalAlertKinds,
  redirectUrls,
} from "#src/components/financial-services/global-alert/constants";
import { DueDateChip } from "#src/components/financial-services/global-alert/due-date-chip";
import {
  type GlobalAlertEntry,
  type GlobalAlertKind,
  type NonBlockingGlobalAlertSeverity,
} from "#src/components/financial-services/global-alert/types";
import { useAlertContent } from "#src/components/financial-services/global-alert/use-alert-content";
import { i18nInstance, useTranslation } from "#src/i18n";

type NonBlockingEntry = GlobalAlertEntry & {
  severity: NonBlockingGlobalAlertSeverity;
};

type AlertDrawerItemProps = {
  kind: GlobalAlertKind;
  severity: NonBlockingGlobalAlertSeverity;
  dueDate?: string;
  onNavigate: (url: string) => void;
  openIntercom?: () => void;
  openAppleAgreements?: () => void;
};

/**
 * A single action row inside the aggregated alerts drawer.
 * Renders the alert title (with an optional due-date chip), description, and CTA button.
 */
const AlertDrawerItem: React.FC<AlertDrawerItemProps> = ({
  kind,
  severity,
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
    <div className="flex flex-col gap-xs">
      <div className="flex items-center gap-xs">
        <Title htmlVariant="h4" weight="strong">
          {title}
        </Title>
        {dueDate && <DueDateChip dueDate={dueDate} severity={severity} />}
      </div>
      {description && (
        <Body color="weak" htmlVariant="p" size="sm">
          {description}
        </Body>
      )}
      <Button
        intent="default"
        color="main"
        size="sm"
        label={ctaLabel}
        onClick={handleCta}
      />
    </div>
  );
};

type AggregatedAlertsDrawerProps = {
  alerts: Partial<{ [kind in GlobalAlertKind]: NonBlockingEntry }>;
  onDismiss?: () => void;
  onNavigate: (url: string) => void;
  openIntercom?: () => void;
  openAppleAgreements?: () => void;
};

/**
 * Aggregate layout for two or more non-blocking alerts.
 * Shows a floating banner summarising the count; clicking "Review" opens a
 * `DetailDrawer` that lists each action with its title, description, due-date chip, and CTA.
 * The banner severity is `"warning"` if any active alert is `"warning"`, otherwise `"info"`.
 */
export const AggregatedAlertsDrawer: React.FC<AggregatedAlertsDrawerProps> = ({
  alerts,
  onDismiss,
  onNavigate,
  openIntercom,
  openAppleAgreements,
}) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const alertsToShow = globalAlertKinds.filter((kind) => alerts[kind]);

  const bannerStatus: NonBlockingGlobalAlertSeverity = alertsToShow.some(
    (kind) => alerts[kind]?.severity === "warning",
  )
    ? "warning"
    : "info";

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 m-sm">
        <Alert
          status={bannerStatus}
          type="strong"
          layout="banner"
          buttonLabel={t("globalAlertModal.aggregate.ctaLabel")}
          onButtonClick={() => setIsDrawerOpen(true)}
          onClearClick={onDismiss}
        >
          {t("globalAlertModal.aggregate.title", {
            count: alertsToShow.length,
          })}
        </Alert>
      </div>
      <DetailDrawer
        id="global-alert-detail-drawer"
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <div className="flex flex-col gap-xs">
          <Title htmlVariant="h3" weight="strong">
            {t("globalAlertModal.aggregate.drawerTitle")}
          </Title>
          <Body color="weak" size="sm">
            {t("globalAlertModal.aggregate.drawerDescription", {
              count: alertsToShow.length,
            })}
          </Body>
        </div>
        {alertsToShow.map((kind) => {
          const entry = alerts[kind];
          if (!entry) return null;

          return (
            <React.Fragment key={kind}>
              <Divider />
              <AlertDrawerItem
                kind={kind}
                severity={entry.severity}
                dueDate={entry.dueDate}
                onNavigate={onNavigate}
                openIntercom={openIntercom}
                openAppleAgreements={openAppleAgreements}
              />
            </React.Fragment>
          );
        })}
      </DetailDrawer>
    </>
  );
};
