import React from "react";

import type { CanvasElement, CanvasTeacherData } from "@bsport/api-book";

import { useTranslation } from "#src/utils/i18n";

import { translateRotate } from "../canvas-transformer";

export type TeacherElementProps = {
  element: CanvasElement<CanvasTeacherData>;
  coachHeight: number;
  coach?: { id: number; name: string };
};

const TeacherElementComponent: React.FC<TeacherElementProps> = ({
  element,
  coachHeight,
  coach,
}) => {
  const { t } = useTranslation("sessionManagement");
  const ariaLabel = coach
    ? t("spotSelector.coachAriaLabel", { name: coach.name })
    : t("spotSelector.coachPositionAriaLabel");
  return (
    <g transform={translateRotate(element.data)} aria-label={ariaLabel}>
      <rect
        x={-coachHeight / 2}
        y={-coachHeight / 2}
        width={coachHeight}
        height={coachHeight}
        fill="var(--kz-color-luna-grey-300)"
      />
    </g>
  );
};

export const TeacherElement = React.memo(TeacherElementComponent);
