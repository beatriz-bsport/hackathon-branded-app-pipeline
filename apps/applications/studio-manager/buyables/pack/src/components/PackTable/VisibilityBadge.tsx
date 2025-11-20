import React from "react";

import { Chip, type IconName, Tooltip } from "@bsport/kaizen-primitive-core";

type VisibilityBadgeProps = {
  icon: IconName;
  isMobile: boolean;
  label: string;
  tooltip: string;
};

export const VisibilityBadge: React.FC<VisibilityBadgeProps> = ({
  icon,
  isMobile,
  label,
  tooltip,
}) => (
  <Tooltip label={tooltip} placement="bottom" className="whitespace-normal">
    <Chip
      color="default"
      size="lg"
      type="weak"
      iconLeft={icon}
      label={isMobile ? undefined : label}
    />
  </Tooltip>
);
