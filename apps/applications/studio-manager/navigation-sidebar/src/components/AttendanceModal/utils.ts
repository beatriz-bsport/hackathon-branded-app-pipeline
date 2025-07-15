export const ATTENDANCE_STEPS = {
  INITIAL: "initial",
  CLOCKED_IN: "clocked-in",
  CLOCKED_OUT: "clocked-out",
} as const;

export const getAttendanceStep = ({
  clockInTime,
  clockOutTime,
}: {
  clockInTime?: number;
  clockOutTime?: number;
}) => {
  if (!clockInTime && !clockOutTime) return ATTENDANCE_STEPS.INITIAL;

  if (clockInTime && !clockOutTime) return ATTENDANCE_STEPS.CLOCKED_IN;

  return ATTENDANCE_STEPS.CLOCKED_OUT;
};

export const getConfirmButtonConfig = (params: {
  clockInTime?: number;
  clockOutTime?: number;
  clockIn: () => void;
  clockOut: () => void;
}) => {
  const step = getAttendanceStep(params);
  if (step === ATTENDANCE_STEPS.INITIAL) {
    return {
      i18nkey: "clockIn" as const,
      iconLeft: "play-circle-solid" as const,
      color: "main" as const,
      onClick: params.clockIn,
    };
  }

  if (step === ATTENDANCE_STEPS.CLOCKED_IN) {
    return {
      i18nkey: "clockOut" as const,
      iconLeft: "stop-circle-solid" as const,
      color: "critical" as const,
      onClick: params.clockOut,
    };
  }

  return undefined;
};
