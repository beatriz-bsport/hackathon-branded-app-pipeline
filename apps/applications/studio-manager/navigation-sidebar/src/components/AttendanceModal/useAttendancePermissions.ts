import { FEATURE_IDENTIFIERS } from "#src/features/permissions/features";
import { useRolePermissions } from "#src/features/permissions/use-role-permissions";
import { useFeaturePermission } from "#src/utils/permissions";

const SELF_CLOCKIN_ID = "selfClockIn";
const CLOCKIN_FOR_OTHERS = "clockInForOthers";

export type AttendancePermissions = {
  displayFeature: boolean;
  selfClockIn: boolean;
  clockInForOthers: boolean;
};

export const useAttendancePermissions = (): AttendancePermissions => {
  const permissions = useRolePermissions([
    {
      id: SELF_CLOCKIN_ID,
      requiredPermissions: ["navigationMenu.payments.clockIn.selfClockIn"],
    },
    {
      id: CLOCKIN_FOR_OTHERS,
      requiredPermissions: ["navigationMenu.payments.clockIn.clockInForOther"],
    },
  ]);
  const hasUpsell = useFeaturePermission(FEATURE_IDENTIFIERS.CLOCK_IN);
  const hasSelfClockIn = !!permissions.get(SELF_CLOCKIN_ID);
  const hasClockInForOthers = !!permissions.get(CLOCKIN_FOR_OTHERS);

  return {
    displayFeature: hasUpsell && (hasSelfClockIn || hasClockInForOthers),
    selfClockIn: hasSelfClockIn,
    clockInForOthers: hasClockInForOthers,
  };
};
