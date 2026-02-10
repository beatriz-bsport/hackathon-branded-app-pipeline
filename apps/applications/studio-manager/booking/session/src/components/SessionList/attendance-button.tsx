import React from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type AttendanceButtonProps = {
  isValidated: boolean;
  available: boolean;
  onClick?: () => void;
};

export const AttendanceButton: React.FC<AttendanceButtonProps> = ({
  isValidated,
  available,
  onClick,
}) => {
  const { t } = useTranslation("sessionList");
  return isValidated ? (
    <Button
      label={t("table.validatedAttendance")}
      size="sm"
      intent="default"
      color="selected"
      iconRight="check"
    />
  ) : (
    <Button
      label={t("table.attendanceButton")}
      size="sm"
      intent="default"
      color="main"
      disabled={!available}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
    />
  );
};
