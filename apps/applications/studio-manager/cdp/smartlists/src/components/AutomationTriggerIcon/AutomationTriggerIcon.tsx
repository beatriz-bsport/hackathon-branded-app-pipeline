import type { ComponentProps } from "react";

import { Icon, type IconName, cx } from "@bsport/kaizen-primitive-core";

import { EventKind } from "#src/api/constants";

type AutomationTriggerIconProps = Omit<ComponentProps<typeof Icon>, "icon"> & {
  trigger: EventKind;
};

const EVENT_KIND_ICON_MAP = {
  [EventKind.JOIN]: "log-in-03",
  [EventKind.LEAVE]: "log-out-01",
} as const satisfies Record<EventKind, IconName>;

const EVENT_KIND_COLOR_CLASS_MAP = {
  [EventKind.JOIN]: "text-onsurface-status-positive-weak",
  [EventKind.LEAVE]: "text-onsurface-status-critical-weak",
} as const satisfies Record<EventKind, string>;

export const AutomationTriggerIcon = ({
  trigger,
  className,
  ...iconProps
}: AutomationTriggerIconProps) => {
  return (
    <Icon
      icon={EVENT_KIND_ICON_MAP[trigger]}
      className={cx(EVENT_KIND_COLOR_CLASS_MAP[trigger], className)}
      {...iconProps}
    />
  );
};
