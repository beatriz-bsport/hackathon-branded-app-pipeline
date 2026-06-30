import React, { memo, useCallback, useMemo } from "react";

import {
  Body,
  Button,
  Toggle,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { useAppointmentColumns } from "#src/components/AppointmentList/appointmentColumns";
import { useSessionListColumns } from "#src/components/SessionList/columns";
import { CalendarViewSetting } from "#src/components/shared/calendar-view-setting";
import {
  sessionListCalendarViewChangedEvent,
  sessionListDisplayCancelledSessionClickedEvent,
  sessionListVisibleColumnsClickedEvent,
} from "#src/events/session-list/events";
import { setShowCancelled, toggleColumn } from "#src/stores/calendar/actions";
import {
  selectAppointmentDisplayedColumns,
  selectAppointmentShowCancelled,
  selectSessionDisplayedColumns,
  selectSessionShowCancelled,
} from "#src/stores/calendar/selectors";
import { useCalendarStore } from "#src/stores/calendar/store";
import {
  AppointmentColumn,
  type CalendarDataTab,
  type CalendarView,
  SessionColumns,
} from "#src/types";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

type DisplaySettingsProps = {
  activeTab: CalendarDataTab;
};

/** Columns that are always visible and cannot be toggled off by the user. */
const NON_TOGGLEABLE_SESSION_COLUMNS: SessionColumns[] = [
  SessionColumns.TIME,
  SessionColumns.ACTIONS,
  SessionColumns.ATTENDANCE,
  SessionColumns.MOBILE_ACTIONS,
];

const NON_TOGGLEABLE_APPOINTMENT_COLUMNS: AppointmentColumn[] = [
  AppointmentColumn.TIME,
  AppointmentColumn.ACTIONS,
];

const DisplaySettingsComponent: React.FC<DisplaySettingsProps> = ({
  activeTab,
}) => {
  const { t } = useTranslation("sessionList");
  const isMobile = !useMatchMedia("lg");
  const sessionColumns = useSessionListColumns(isMobile);
  const appointmentColumns = useAppointmentColumns();
  const sessionDisplayedColumns = useCalendarStore(
    selectSessionDisplayedColumns,
  );
  const appointmentDisplayedColumns = useCalendarStore(
    selectAppointmentDisplayedColumns,
  );
  const hasShowCancelledSessionsPermission = useObjectLevelPermission(
    "planning.calendar.allowed_actions.readCancellations",
  );

  const toggleableSessionColumns = useMemo(
    () =>
      sessionColumns.filter(
        (col) =>
          !NON_TOGGLEABLE_SESSION_COLUMNS.includes(col.id as SessionColumns),
      ),
    [sessionColumns],
  );

  const toggleableAppointmentColumns = useMemo(
    () =>
      appointmentColumns.filter(
        (col) =>
          !NON_TOGGLEABLE_APPOINTMENT_COLUMNS.includes(
            col.id as AppointmentColumn,
          ),
      ),
    [appointmentColumns],
  );

  const handleCalendarViewChange = useCallback((calendarView: CalendarView) => {
    analyticsTrackSafeEvent(sessionListCalendarViewChangedEvent, {
      calendar_view: calendarView,
    });
  }, []);

  const handleToggleSessionColumn = useCallback(
    (column: SessionColumns) => {
      const wasVisible = sessionDisplayedColumns.includes(column);
      toggleColumn("classes", column);
      analyticsTrackSafeEvent(sessionListVisibleColumnsClickedEvent, {
        calendar_column_name: column,
        calendar_column_visibility: wasVisible ? "hidden" : "visible",
      });
    },
    [sessionDisplayedColumns],
  );

  // TODO: Add analytics tracking once the schema supports AppointmentColumn (MR 5)
  const handleToggleAppointmentColumn = useCallback(
    (column: AppointmentColumn) => {
      toggleColumn("appointments", column);
    },
    [],
  );

  const handleToggleShowCancelled = useCallback(
    (value: boolean) => {
      setShowCancelled(activeTab, value);
      analyticsTrackSafeEvent(sessionListDisplayCancelledSessionClickedEvent, {
        cancelled_sessions_displayed: value,
      });
    },
    [activeTab],
  );

  const showCancelled = useCalendarStore(
    activeTab === "classes"
      ? selectSessionShowCancelled
      : selectAppointmentShowCancelled,
  );

  const isClassesTab = activeTab === "classes";

  return (
    <div className="flex flex-col gap-lg max-w-[260px] p-xs">
      <CalendarViewSetting onCalendarViewChange={handleCalendarViewChange} />
      {hasShowCancelledSessionsPermission && (
        <Toggle
          id="show-cancelled"
          label={
            isClassesTab
              ? t("displaySettings.showCancelledSessions.label")
              : t("displaySettings.showCancelledAppointments.label")
          }
          checked={showCancelled}
          onToggleChange={handleToggleShowCancelled}
        />
      )}
      <div className="flex flex-col gap-xs">
        <Body size="md" weight="weak">
          {t("displaySettings.displayedColumns.label")}
        </Body>
        <div className="flex flex-wrap gap-xs">
          {isClassesTab
            ? toggleableSessionColumns.map((column) => (
                <Button
                  key={column.id}
                  label={column.label}
                  size="sm"
                  intent="default"
                  onClick={() =>
                    handleToggleSessionColumn(column.id as SessionColumns)
                  }
                  color={
                    sessionDisplayedColumns.includes(
                      column.id as SessionColumns,
                    )
                      ? "selected"
                      : "main"
                  }
                />
              ))
            : toggleableAppointmentColumns.map((column) => (
                <Button
                  key={column.id}
                  label={column.label}
                  size="sm"
                  intent="default"
                  onClick={() =>
                    handleToggleAppointmentColumn(
                      column.id as AppointmentColumn,
                    )
                  }
                  color={
                    appointmentDisplayedColumns.includes(
                      column.id as AppointmentColumn,
                    )
                      ? "selected"
                      : "main"
                  }
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export const DisplaySettings = memo(DisplaySettingsComponent);
