import React from "react";

import { Chip, type IconName, Tooltip } from "@bsport/kaizen-primitive-core";

type VisibilityBadgeProps = {
  tooltip: string;
  icon: IconName;
};

export const VisibilityBadge: React.FC<VisibilityBadgeProps> = ({
  tooltip,
  icon,
}) => (
  <Tooltip label={tooltip} placement="bottom" className="whitespace-normal">
    <Chip color="default" size="lg" type="weak" iconLeft={icon} />
  </Tooltip>
);
