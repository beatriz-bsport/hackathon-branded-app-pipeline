import React from "react";

import { Button, Loader, Modal } from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { AttendanceSteps } from "./AttendanceSteps";
import type { AttendancePermissions } from "./useAttendancePermissions";
import { useCurrentAttendance } from "./useCurrentAttendance";
import { getConfirmButtonConfig } from "./utils";

type AttendanceModalProps = {
  onClose: () => void;
  permissions: AttendancePermissions;
  userId: number;
  userName: string;
  navigateInContext: (to: string, isRevamp?: boolean) => void;
  className?: string;
};

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  onClose,
  permissions,
  userId,
  userName,
  navigateInContext,
  className,
}) => {
  const { t } = useTranslation("features");

  const { isLoading, isInitialLoading, currentAttendance, clockIn, clockOut } =
    useCurrentAttendance();

  const confirmButton = getConfirmButtonConfig({
    clockInTime: currentAttendance?.date_start,
    clockOutTime: currentAttendance?.date_end,
    clockIn: () => clockIn({ userId }),
    clockOut: () => {
      if (currentAttendance) {
        clockOut({ attendanceId: currentAttendance.id });
      } else {
        console.warn(
          "Can not clock-out. Reason : current attendance is not defined.",
        );
      }
    },
  });

  return (
    <Modal
      open
      size="sm"
      title={t("attendance.title")}
      confirmButton={
        confirmButton
          ? {
              label: t(`attendance.buttons.${confirmButton.i18nkey}`),
              color: confirmButton.color,
              iconLeft: confirmButton.iconLeft,
              onClick: confirmButton.onClick,
              disabled: isLoading,
            }
          : undefined
      }
      cancelButton={{
        onClick: onClose,
        label: t("attendance.buttons.close"),
        disabled: isLoading,
      }}
      onClose={onClose}
      className={className ?? ""}
    >
      <div className="flex flex-col items-start gap-md py-xs">
        {isInitialLoading ? (
          <Loader size="md" className="self-center" />
        ) : (
          <>
            {permissions.selfClockIn && (
              <AttendanceSteps
                userName={userName}
                clockInTime={currentAttendance?.date_start}
                clockOutTime={currentAttendance?.date_end}
              />
            )}
            {permissions.clockInForOthers && (
              <Button
                iconRight="share-03"
                intent="default"
                size="md"
                color="main"
                label={t("attendance.clockInForStaff")}
                onClick={() => {
                  navigateInContext(LEGACY_URLS.attendance);
                  onClose();
                }}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
