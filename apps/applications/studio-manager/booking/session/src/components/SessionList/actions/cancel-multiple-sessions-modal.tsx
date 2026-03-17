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
import {
  sessionListCancelMultipleSessionTimePeriodSelectedEvent,
  sessionListCancelMultipleSessionsConfirmButtonClickedEvent,
} from "#src/events/session-list/events";
import { useCancelMultipleSessions } from "#src/hooks/session-api/bulk-actions/use-cancel-multiple-sessions";
import { useFetchNumberOfSessionsToCancel } from "#src/hooks/session-api/bulk-actions/use-fetch-number-of-cancelled-sessions";
import { useFetchSessions } from "#src/hooks/session-api/fetch/use-fetch-sessions";
import {
  selectFilters,
  selectSelectedDate,
  useSessionListStore,
} from "#src/stores/session-list";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { Trans, useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

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
    if (date[0] && date[1]) {
      analyticsTrackSafeEvent(
        sessionListCancelMultipleSessionTimePeriodSelectedEvent,
        {
          time_period_value: {
            start_date: date[0].toISODate()!,
            end_date: date[1].toISODate()!,
          },
        },
      );
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

  const hasCancelActivitySessionsPermission = useObjectLevelPermission(
    "session.activity.allowed_actions.delete",
  );
  const hasCancelWorkshopSessionsPermission = useObjectLevelPermission(
    "session.workshop.allowed_actions.delete",
  );

  const globalFilter = useMemo(() => {
    if (
      hasCancelActivitySessionsPermission &&
      hasCancelWorkshopSessionsPermission
    ) {
      return {};
    }
    if (hasCancelActivitySessionsPermission) {
      return { is_workshop: false };
    }
    return { is_workshop: true };
  }, [
    hasCancelActivitySessionsPermission,
    hasCancelWorkshopSessionsPermission,
  ]);

  const filters = useSessionListStore(selectFilters);
  const filterParams = getParamsFromFilters(filters);
  const cancelSessionsParams = { ...filterParams, ...globalFilter };

  const { data: numberOfCancelledSessions } = useFetchNumberOfSessionsToCancel(
    cancelRange ? cancelRange[0] : null,
    cancelRange ? cancelRange[1] : null,
    cancelSessionsParams,
  );

  const { data: groupSessions } = useFetchSessions(
    cancelRange ? cancelRange[0] : null,
    cancelRange ? cancelRange[1] : null,
    { ...cancelSessionsParams, available: true, with_group: true },
  );

  const cancelMultipleSessions = useCancelMultipleSessions();

  const handleCancelMultipleSessions = () => {
    if (confirmTick && cancelRange && cancelRange[0] && cancelRange[1]) {
      analyticsTrackSafeEvent(
        sessionListCancelMultipleSessionsConfirmButtonClickedEvent,
        {
          time_period_value: {
            start_date: cancelRange[0].toISODate()!,
            end_date: cancelRange[1].toISODate()!,
          },
        },
      );
      onClose();
      cancelMultipleSessions.mutate({
        startDate: cancelRange[0],
        endDate: cancelRange[1],
        params: cancelSessionsParams,
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
        {globalFilter.is_workshop !== undefined && (
          <Alert status="info">
            {globalFilter.is_workshop
              ? t("cancelMultipleSessionsModal.workshopOnly")
              : t("cancelMultipleSessionsModal.activityOnly")}
          </Alert>
        )}
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
          <Body size="sm" htmlVariant="p">
            {t("cancelMultipleSessionsModal.helperText")}
          </Body>
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
