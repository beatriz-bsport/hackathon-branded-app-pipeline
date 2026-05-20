import type { ChipProps, WithTooltip } from "@bsport/kaizen-primitive-core";

import { useBillingPlanStatusTranslations } from "./get-status";

const COMMON_CHIPS_CONFIG = {
  size: "lg",
  type: "weak",
} as const;

function getChipConfig({
  name,
  withLabel,
  withTooltip,
}: {
  name: string;
  withLabel?: boolean;
  withTooltip?: boolean;
}) {
  return {
    label: withLabel ? name : undefined,
    tooltipProps: withTooltip
      ? {
          label: name,
        }
      : undefined,
  };
}

/**
 * Generate chip configuration for each client-facing status
 */
export const useBillingPlanStatusChipConfigs = ({
  withLabel,
  withTooltip,
}: {
  withLabel?: boolean;
  withTooltip?: boolean;
}) => {
  const statuses = useBillingPlanStatusTranslations();

  return {
    valid: {
      ...COMMON_CHIPS_CONFIG,
      ...getChipConfig({ name: statuses.valid, withLabel, withTooltip }),
      color: "positive",
      iconLeft: "check-circle",
    },
    paused: {
      ...COMMON_CHIPS_CONFIG,
      ...getChipConfig({ name: statuses.paused, withLabel, withTooltip }),
      color: "info",
      iconLeft: "pause-square",
    },
    canceled: {
      ...COMMON_CHIPS_CONFIG,
      ...getChipConfig({ name: statuses.canceled, withLabel, withTooltip }),
      color: "warning",
      iconLeft: "stop-circle",
    },
    ended: {
      ...COMMON_CHIPS_CONFIG,
      ...getChipConfig({ name: statuses.ended, withLabel, withTooltip }),
      color: "default",
      iconLeft: "slash-circle-02",
    },
  } as const satisfies Record<string, WithTooltip<ChipProps>>;
};
