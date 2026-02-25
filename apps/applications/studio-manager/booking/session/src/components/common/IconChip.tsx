import React from "react";

import { Chip, type IconName } from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";

type IconChipProps = {
  tooltip: string;
  icon: IconName;
};

export const IconChip: React.FC<IconChipProps> = ({ tooltip, icon }) => (
  <ResponsiveTooltip
    label={tooltip}
    placement="bottom"
    className="whitespace-normal"
  >
    <Chip color="default" size="lg" type="weak" iconLeft={icon} />
  </ResponsiveTooltip>
);
