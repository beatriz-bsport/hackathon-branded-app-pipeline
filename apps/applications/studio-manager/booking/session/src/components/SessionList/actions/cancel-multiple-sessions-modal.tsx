import { FC, useCallback, useEffect, useMemo, useState } from "react";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import {
  DateTime,
  getLocalNow,
  isSameDay,
} from "@bsport/datetime-manipulation";
import {
  Alert,
  Body,
  Checkbox,
  DatePicker,
  Modal,
  SelectedDate,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SessionSummaryList } from "#src/components/common/session-summary-list";
import { useCancelMultipleSessions } from "#src/hooks/session-api/bulk-actions/use-cancel-multiple-sessions";
import { useFetchNumberOfSessionsToCancel } from "#src/hooks/session-api/bulk-actions/use-fetch-number-of-cancelled-sessions";
import { useFetchSessions } from "#src/hooks/session-api/fetch/use-fetch-sessions";
import {
  selectFilters,
  selectSelectedDate,
  useSessionListStore,
} from "#src/stores/session-list";
import { Trans, useTranslation } from "#src/utils/i18n";

import { getParamsFromFilters } from "../Filters/getParamsFromFilters";

export const CancelMultipleSessionsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const currentSelectedDate = useSessionListStore(selectSelectedDate);

  const [cancelRange, setCancelRange] = useState<
    [DateTime | null, DateTime | null] | null
  >(null);
  const [confirmTick, setConfirmTick] = useState(false);
  const confirmTickValue = confirmTick ? "checked" : "unchecked";
  const today = useMemo(
    () => getLocalNow({ zone: companyTimezone }),
    [companyTimezone],
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
    return [today, today];
  }, [currentSelectedDate, today]);

  const handleDateChange = (date: SelectedDate) => {
    if (!date || !Array.isArray(date)) {
      return;
    }
    setCancelRange([date[0], date[1]]);
  };

  const disablePastDates = (date: DateTime) => {
    return date < today.startOf("day");
  };

  const getFormattedDate = (date: DateTime | null) => {
    return date
      ? formatDateTimeFromDate(date, DATETIME_FORMATS.FULL_DATE, {
          locale: i18n.language,
        })
      : "";
  };

  const filters = useSessionListStore(selectFilters);
  const filterParams = getParamsFromFilters(filters);

  const { data: numberOfCancelledSessions } = useFetchNumberOfSessionsToCancel(
    cancelRange ? cancelRange[0] : null,
    cancelRange ? cancelRange[1] : null,
    filterParams,
  );

  const { data: groupSessions } = useFetchSessions(
    cancelRange ? cancelRange[0] : null,
    cancelRange ? cancelRange[1] : null,
    { ...filterParams, available: true, with_group: true },
  );

  const cancelMultipleSessions = useCancelMultipleSessions();

  const handleCancelMultipleSessions = () => {
    if (confirmTick && cancelRange && cancelRange[0] && cancelRange[1]) {
      onClose();
      cancelMultipleSessions.mutate({
        startDate: cancelRange[0],
        endDate: cancelRange[1],
        params: filterParams,
        locale: i18n.language,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCancelRange(
        getDefaultDateRange() as [DateTime | null, DateTime | null],
      );
      setConfirmTick(false);
    }
  }, [isOpen, getDefaultDateRange]);

  return (
    <Modal
      open={isOpen}
      size="lg"
      title={t("cancelMultipleSessionsModal.title")}
      onClose={onClose}
      confirmButton={{
        label: t("cancelMultipleSessionsModal.confirmButton"),
        color: "critical",
        onClick: handleCancelMultipleSessions,
        disabled:
          !confirmTick || !cancelRange || !cancelRange[0] || !cancelRange[1],
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
            disableDate={disablePastDates}
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
                  sessionsNumber:
                    numberOfCancelledSessions - (groupSessions?.length ?? 0),
                  startDate: getFormattedDate(cancelRange[0]),
                  endDate: getFormattedDate(cancelRange[1]),
                }}
                count={
                  cancelRange[0] &&
                  cancelRange[1] &&
                  isSameDay(cancelRange[0], cancelRange[1])
                    ? 1
                    : 2
                }
              />
            </Body>
          </Alert>
        )}
        {groupSessions && groupSessions.length > 0 && (
          <>
            <Alert status="critical">
              <Body htmlVariant="p" size="md" weight="weak" color="critical">
                <Trans
                  // @ts-expect-error it works at runtime
                  t={t}
                  ns="sessionList"
                  i18nKey="cancelMultipleSessionsModal.groupSessionAlert"
                  components={{ strong: <strong /> }}
                />
              </Body>
            </Alert>
            <SessionSummaryList sessions={groupSessions} />
          </>
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
