import type { FC } from "react";

import { SegmentedControl } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

// eslint-disable-next-line react-refresh/only-export-components
export const CONTROL_SUCCESS = {
  PAUSED: "paused-membership-plans",
  NOT_PAUSED: "not-paused-membership-plans",
} as const;

export type ControlSuccessKind =
  (typeof CONTROL_SUCCESS)[keyof typeof CONTROL_SUCCESS];

type MembershipPlanEffectSelectorProps = {
  value: ControlSuccessKind;
  onChange: (nextVal: ControlSuccessKind) => void;
};

/**
 * UI for selecting paused/unpaused membership plans
 */
export const MembershipPlanEffectSelector: FC<
  MembershipPlanEffectSelectorProps
> = ({ value, onChange }) => {
  const { t } = useTranslation("contract-features");

  return (
    <SegmentedControl
      id="contract-pause-detail-drawer-control-availability"
      options={[
        {
          label: t("pauseDetailDrawer.control.available"),
          value: CONTROL_SUCCESS.PAUSED,
        },
        {
          label: t("pauseDetailDrawer.control.unavailable"),
          value: CONTROL_SUCCESS.NOT_PAUSED,
        },
      ]}
      fullWidth
      value={value}
      onChangeValue={(nextVal) => {
        onChange(
          nextVal === CONTROL_SUCCESS.NOT_PAUSED
            ? CONTROL_SUCCESS.NOT_PAUSED
            : CONTROL_SUCCESS.PAUSED,
        );
      }}
    />
  );
};
