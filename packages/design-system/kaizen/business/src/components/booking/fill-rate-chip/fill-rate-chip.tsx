import type { FC } from "react";

import type { ChipProps, IconName } from "@bsport/kaizen-primitive-core";
import { Chip, Tooltip } from "@bsport/kaizen-primitive-core";

type ChipColor = NonNullable<ChipProps["color"]>;

const getChipVariant = (
  fillRate: number,
): { color: ChipColor; icon: IconName } => {
  if (fillRate < 50) {
    return { color: "critical", icon: "alert-circle" };
  }
  if (fillRate < 70) {
    return { color: "warning", icon: "contrast-02" };
  }
  return { color: "positive", icon: "check-circle" };
};

export type FillRateChipProps = {
  fillRate: number;
  size?: ChipProps["size"];
  tooltipLabel?: string;
  tooltipPlacement?: "top" | "top-right";
};

export const FillRateChip: FC<FillRateChipProps> = ({
  fillRate,
  size = "lg",
  tooltipLabel,
  tooltipPlacement = "top",
}) => {
  const { color, icon } = getChipVariant(fillRate);

  const chip = (
    <Chip
      type="weak"
      size={size}
      color={color}
      iconLeft={icon}
      label={`${fillRate}%`}
    />
  );

  if (!tooltipLabel) {
    return chip;
  }

  return (
    <Tooltip placement={tooltipPlacement} label={tooltipLabel}>
      {chip}
    </Tooltip>
  );
};
