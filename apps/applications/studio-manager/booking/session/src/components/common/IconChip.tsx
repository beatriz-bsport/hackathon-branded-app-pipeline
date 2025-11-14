import React from "react";

import { Chip, type IconName, Tooltip } from "@bsport/kaizen-primitive-core";

type IconChipProps = {
  tooltip: string;
  icon: IconName;
};

export const IconChip: React.FC<IconChipProps> = ({ tooltip, icon }) => (
  <Tooltip label={tooltip} placement="bottom" className="whitespace-normal">
    <Chip color="default" size="lg" type="weak" iconLeft={icon} />
  </Tooltip>
);
