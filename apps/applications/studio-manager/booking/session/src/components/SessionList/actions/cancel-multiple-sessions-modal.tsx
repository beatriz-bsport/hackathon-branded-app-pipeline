import { FC, useCallback, useEffect, useState } from "react";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { DateTime, getLocalNow } from "@bsport/datetime-manipulation";
import {
  Alert,
  Body,
  Checkbox,
  DatePicker,
  Modal,
  SelectedDate,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchNumberOfSessionsToCancel } from "#src/hooks/bulk-actions/use-fetch-number-of-cancelled-sessions";
import {
  selectSelectedDate,
  useSessionListStore,
} from "#src/stores/session-list";
import { Trans, useTranslation } from "#src/utils/i18n";

export const CancelMultipleSessionsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const currentSelectedDate = useSessionListStore(selectSelectedDate);

  const [cancelRange, setCancelRange] = useState<
    [DateTime | null, DateTime | null] | null
  >(null);
  const [confirmTick, setConfirmTick] = useState(false);
  const confirmTickValue = confirmTick ? "checked" : "unchecked";

  const { data: numberOfCancelledSessions } = useFetchNumberOfSessionsToCancel(
    cancelRange ? cancelRange[0] : null,
    cancelRange ? cancelRange[1] : null,
    {},
  );

  const getDefaultDateRange = useCallback((): SelectedDate => {
    if (currentSelectedDate.type === "single" && currentSelectedDate.date) {
      return [currentSelectedDate.date, currentSelectedDate.date];
    }
    if (
      currentSelectedDate.type === "range" &&
      currentSelectedDate.minDate &&
      currentSelectedDate.maxDate
    ) {
      return [currentSelectedDate.minDate, currentSelectedDate.maxDate];
    }
    const today = getLocalNow({ zone: companyTimezone });
    return [today, today];
  }, [currentSelectedDate, companyTimezone]);

  const handleDateChange = (date: SelectedDate) => {
    if (!date || !Array.isArray(date)) {
      return;
    }
    setCancelRange([date[0], date[1]]);
  };

  const getFormattedDate = (date: DateTime | null) => {
    return date ? formatDateTimeFromDate(date, DATETIME_FORMATS.FULL_DATE) : "";
  };

  useEffect(() => {
    if (isOpen) {
      setCancelRange(
        getDefaultDateRange() as [DateTime | null, DateTime | null],
      );
    }
  }, [isOpen, getDefaultDateRange]);

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("cancelMultipleSessionsModal.title")}
      onClose={onClose}
      confirmButton={{
        label: t("cancelMultipleSessionsModal.confirmButton"),
        color: "critical",
      }}
      cancelButton={{
        label: t("cancelMultipleSessionsModal.cancelButton"),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="lg">
          {t("cancelMultipleSessionsModal.description")}
        </Body>
        <div className="flex flex-col gap-xs">
          <Body size="md" htmlVariant="p">
            {t("cancelMultipleSessionsModal.dateRangeLabel")}
          </Body>
          <DatePicker
            id="bulk-cancel-date-picker"
            mode="range"
            displayAs="popover"
            defaultValue={getDefaultDateRange()}
            onSelect={handleDateChange}
          />
        </div>
        {numberOfCancelledSessions !== undefined && cancelRange && (
          <Alert status="critical">
            <Body htmlVariant="p" size="md" weight="weak" color="critical">
              <Trans
                // @ts-expect-error it works at runtime
                t={t}
                ns="sessionList"
                i18nKey="cancelMultipleSessionsModal.cancelAlert"
                components={{ strong: <strong /> }}
                values={{
                  sessionsNumber: numberOfCancelledSessions,
                  startDate: getFormattedDate(cancelRange[0]),
                  endDate: getFormattedDate(cancelRange[1]),
                }}
              />
            </Body>
          </Alert>
        )}
        <div className="flex flex-col gap-xs">
          <Body size="md" htmlVariant="p">
            {t("cancelMultipleSessionsModal.confirmTickLabel")}
          </Body>
          <Checkbox
            label={t("cancelMultipleSessionsModal.confirmTickDescription")}
            value={confirmTickValue}
            id="confirm-cancel-multiple-sessions-checkbox"
            onChange={setConfirmTick}
          ></Checkbox>
        </div>
      </div>
    </Modal>
  );
};
