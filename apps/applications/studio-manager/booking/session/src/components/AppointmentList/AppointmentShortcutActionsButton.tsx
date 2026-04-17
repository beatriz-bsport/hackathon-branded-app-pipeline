import React from "react";

import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { openCancelAppointmentModal } from "#src/stores/calendar";
import type { EnrichedAppointment } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

type AppointmentShortcutActionsButtonProps = {
  appointment: EnrichedAppointment;
};

export const AppointmentShortcutActionsButton: React.FC<
  AppointmentShortcutActionsButtonProps
> = ({ appointment }) => {
  const { t } = useTranslation("sessionList");

  const getMenuItems = (
    setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>,
  ): Item[] => [
    {
      id: "reschedule-shortcut",
      label: t("appointmentTable.shortcutActions.reschedule"),
      iconLeft: "calendar",
      type: "button",
      disabled: true,
      onClick: () => {},
    },
    {
      id: "swap-pass-shortcut",
      label: t("appointmentTable.shortcutActions.swapPass"),
      iconLeft: "refresh-cw-04",
      type: "button",
      disabled: true,
      onClick: () => {},
    },
    {
      id: "swap-teacher-shortcut",
      label: t("appointmentTable.shortcutActions.swapTeacher"),
      iconLeft: "refresh-cw-04",
      type: "button",
      disabled: true,
      onClick: () => {},
    },
    {
      id: "cancel-shortcut",
      label: t("appointmentTable.shortcutActions.cancel"),
      iconLeft: "calendar-minus-02",
      type: "button",
      disabled: appointment.isCancelled,
      onClick: () => {
        setIsPopoverOpened(false);
        openCancelAppointmentModal(appointment);
      },
    },
  ];

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            icon="dots-vertical"
            onClick={(event) => {
              event.stopPropagation();
              setIsPopoverOpened(true);
            }}
            size="md"
            intent="flat"
            color="default"
            label={t("appointmentTable.shortcutActions.label")}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {({ setIsPopoverOpened }) => (
          <div className="flex flex-col gap-sm">
            <Menu items={getMenuItems(setIsPopoverOpened)} />
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
