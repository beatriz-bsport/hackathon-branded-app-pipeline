import type { FC } from "react";

import { Body, Button, Card, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export interface FocusCardProps {
  completedCount: number;
  totalCount: number;
  nextItemTitle?: string;
  onGoToStep: () => void;
}

export const FocusCard: FC<FocusCardProps> = ({
  completedCount,
  totalCount,
  nextItemTitle,
  onGoToStep,
}) => {
  const { t } = useTranslation("common");
  const isComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <Card elevated className="flex items-center justify-between gap-md">
      <div className="flex flex-col gap-2xs">
        <Title htmlVariant="h5">{t("focusCard.title")}</Title>
        <Body size="sm" color="weak">
          {isComplete
            ? t("focusCard.allDone")
            : (nextItemTitle ?? t("focusCard.greatProgress"))}
        </Body>
      </div>
      {!isComplete && (
        <Button
          label={t("focusCard.cta")}
          intent="call-to-action"
          color="main"
          size="sm"
          onClick={onGoToStep}
        />
      )}
    </Card>
  );
};
