import { FC, useState } from "react";

import { type DateTime, fromIsoString } from "@bsport/datetime-manipulation";
import {
  Alert,
  DatePicker,
  Modal,
  TimePicker,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useRescheduleAppointment } from "#src/hooks/appointment/actions/use-reschedule-appointment";
import { useCheckResourceAllocation } from "#src/hooks/appointment/fetch/useCheckResourceAllocation";
import type { EnrichedAppointment } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import {
  type UnavailableResource,
  UnavailableResourcesAlert,
} from "./UnavailableResourcesAlert";
import { getAppointmentModalDescription } from "./get-appointment-modal-description";

type RescheduleAppointmentModalProps = {
  appointment: EnrichedAppointment;
  isOpen: boolean;
  onClose: () => void;
};

export const RescheduleAppointmentModal: FC<
  RescheduleAppointmentModalProps
> = ({ appointment, isOpen, onClose }) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const originalDateTime = fromIsoString(appointment.date_start, {
    zone: companyTimezone,
  });

  const [selectedDate, setSelectedDate] = useState<DateTime>(originalDateTime);
  const [selectedTime, setSelectedTime] = useState<string>(
    originalDateTime.toFormat("HH:mm"),
  );
  const [failedCombination, setFailedCombination] = useState<string | null>(
    null,
  );

  const rescheduleAppointment = useRescheduleAppointment();

  const { unavailable, isChecking, checkAvailability, resetAvailability } =
    useCheckResourceAllocation(appointment);

  const buildIsoString = (date: DateTime, time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    return date.set({ hour, minute, second: 0, millisecond: 0 }).toISO()!;
  };

  const currentCombination = buildIsoString(selectedDate, selectedTime);

  const originalIso = originalDateTime
    .set({ second: 0, millisecond: 0 })
    .toISO();

  const isUnchanged = currentCombination === originalIso;
  const isFailedCombination = currentCombination === failedCombination;

  const hasUnavailableResources =
    unavailable.coach || unavailable.establishment;

  const handleConfirm = async () => {
    if (!hasUnavailableResources) {
      const isAvailable = await checkAvailability(currentCombination);
      if (!isAvailable) return;
    }

    rescheduleAppointment.mutate(
      {
        id: appointment.id,
        params: { date_start: currentCombination },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          setFailedCombination(currentCombination);
        },
      },
    );
  };

  const handleDateChange = (
    date: DateTime | [DateTime | null, DateTime | null] | null,
  ) => {
    if (!date || Array.isArray(date)) return;
    setSelectedDate(date.setZone(companyTimezone));
    resetAvailability();
    setFailedCombination(null);
  };

  const handleTimeChange = (newTime: string) => {
    if (!newTime) return;
    setSelectedTime(newTime);
    resetAvailability();
    setFailedCombination(null);
  };

  const description = getAppointmentModalDescription(appointment, {
    locale: i18n.language,
    timeZone: companyTimezone,
  });

  const unavailableResources: UnavailableResource[] = [
    ...(unavailable.coach
      ? [
          {
            name: appointment.teacherName,
            type: t("resourceAllocation.teacher"),
          },
        ]
      : []),
    ...(unavailable.establishment
      ? [
          {
            name: appointment.establishmentName,
            type: t("resourceAllocation.establishment"),
          },
        ]
      : []),
  ];

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("rescheduleAppointmentModal.title")}
      description={description}
      onClose={onClose}
      confirmButton={{
        label: t("rescheduleAppointmentModal.confirmButton"),
        onClick: handleConfirm,
        disabled:
          isUnchanged ||
          isFailedCombination ||
          isChecking ||
          rescheduleAppointment.isPending,
      }}
      cancelButton={{
        label: t("rescheduleAppointmentModal.cancelButton"),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-sm md:flex-row md:gap-md">
          <DatePicker
            displayAs="popover"
            isInputField
            id="reschedule-appointment-date"
            label={t("rescheduleAppointmentModal.dateLabel")}
            required
            mode="single"
            defaultValue={originalDateTime}
            onSelect={(date) => {
              if (!Array.isArray(date)) {
                handleDateChange(date);
              }
            }}
          />
          <TimePicker
            id="reschedule-appointment-time"
            label={t("rescheduleAppointmentModal.timeLabel")}
            required
            interval={15}
            value={selectedTime}
            onChange={handleTimeChange}
          />
        </div>

        <Alert status="default">
          {t("rescheduleAppointmentModal.infoMessage")}
        </Alert>

        {hasUnavailableResources && (
          <UnavailableResourcesAlert
            resources={unavailableResources}
            confirmationMessage={t("resourceAllocation.rescheduleConfirmation")}
          />
        )}
      </div>
    </Modal>
  );
};
