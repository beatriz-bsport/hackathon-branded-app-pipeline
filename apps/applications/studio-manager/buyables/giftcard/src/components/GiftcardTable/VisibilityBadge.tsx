import type { FC } from "react";

import { Chip, type IconName, Tooltip } from "@bsport/kaizen-primitive-core";

type VisibilityBadgeProps = {
  icon: IconName;
  label: string;
  tooltip: string;
};

export const VisibilityBadge: FC<VisibilityBadgeProps> = ({
  icon,
  label,
  tooltip,
}) => (
  <Tooltip label={tooltip} placement="bottom" className="whitespace-normal">
    <Chip color="default" size="lg" type="weak" iconLeft={icon} label={label} />
  </Tooltip>
);
