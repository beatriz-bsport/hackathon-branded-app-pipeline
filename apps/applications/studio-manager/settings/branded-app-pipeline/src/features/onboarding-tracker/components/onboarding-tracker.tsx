import { type FC, useCallback, useMemo } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { ALL_CHECKLIST_ITEMS, PHASES } from "../data/phases";
import { useAppDetailsForm } from "../hooks/use-app-details-form";
import { useChecklistProgress } from "../hooks/use-checklist-progress";
import { AppDetailsSection } from "./app-details-section";
import { AppleOrgAlert } from "./apple-org-alert";
import { FocusCard } from "./focus-card";
import { PhaseCard } from "./phase-card";

export const OnboardingTracker: FC = () => {
  const { t } = useTranslation("common");
  const { isCompleted, toggleItem } = useChecklistProgress();
  const { details, updateField } = useAppDetailsForm();

  const completedCount = ALL_CHECKLIST_ITEMS.filter((item) =>
    isCompleted(item.id),
  ).length;
  const nextItem = ALL_CHECKLIST_ITEMS.find((item) => !isCompleted(item.id));
  const currentPhaseId = useMemo(
    () =>
      nextItem
        ? PHASES.find((phase) =>
            phase.items.some((item) => item.id === nextItem.id),
          )?.id
        : undefined,
    [nextItem],
  );

  const handleGoToNextStep = useCallback(() => {
    if (!nextItem) return;
    document
      .getElementById(`checklist-item-${nextItem.id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [nextItem]);

  return (
    <div className="flex flex-col gap-md p-lg">
      <Body size="md" color="weak">
        {t("pageSubtitle")}
      </Body>

      <FocusCard
        completedCount={completedCount}
        totalCount={ALL_CHECKLIST_ITEMS.length}
        nextItemTitle={nextItem ? t(`items.${nextItem.id}.title`) : undefined}
        onGoToStep={handleGoToNextStep}
      />

      <AppDetailsSection details={details} onChangeField={updateField} />

      <AppleOrgAlert />

      <div className="flex flex-col gap-md">
        {PHASES.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isCurrent={phase.id === currentPhaseId}
            isItemCompleted={isCompleted}
            onToggleItem={toggleItem}
          />
        ))}
      </div>
    </div>
  );
};
