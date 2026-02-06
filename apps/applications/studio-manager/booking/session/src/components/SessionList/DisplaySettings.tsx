import React from "react";

import {
  Body,
  Button,
  SegmentedControl,
  Toggle,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { sessionListCalendarViewChangedEvent } from "#src/events/session-list/events";
import {
  setCalendarView,
  setShowCancelledSessions,
  toggleColumn,
} from "#src/stores/session-list/actions";
import {
  selectCalendarView,
  selectDisplayedColumns,
  selectShowCancelledSessions,
} from "#src/stores/session-list/selectors";
import { useSessionListStore } from "#src/stores/session-list/store";
import { CalendarView, Columns } from "#src/types";
import { analyticsTrackEvent } from "#src/utils/analytics-track-event";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

import { useSessionListColumns } from "./columns";

export const DisplaySettings: React.FC = () => {
  const { t } = useTranslation("sessionList");
  const isMobile = !useMatchMedia("lg");
  const columns = useSessionListColumns(isMobile);
  const displayedColumns = useSessionListStore(selectDisplayedColumns);
  const hasShowCancelledSessionsPermission = useObjectLevelPermission(
    "planning.calendar.allowed_actions.readCancellations",
  );

  const onChangeCalendarView = (value: string) => {
    if (value === CalendarView.DAILY || value === CalendarView.RANGE) {
      setCalendarView(value as CalendarView);
      analyticsTrackEvent(sessionListCalendarViewChangedEvent, {
        calendar_view: value,
      });
    }
  };
  const calendarView = useSessionListStore(selectCalendarView);

  const showCancelledSessions = useSessionListStore(
    selectShowCancelledSessions,
  );

  return (
    <div className="flex flex-col gap-lg max-w-[260px] p-xs">
      <div className="flex flex-col gap-xs">
        <Body size="md" weight="weak">
          {t("displaySettings.calendarView.label")}
        </Body>
        <SegmentedControl
          id="calendar-view"
          options={[
            {
              label: t("displaySettings.calendarView.options.daily"),
              value: CalendarView.DAILY,
            },
            {
              label: t("displaySettings.calendarView.options.range"),
              value: CalendarView.RANGE,
            },
          ]}
          onChangeValue={onChangeCalendarView}
          value={calendarView}
        />
      </div>
      {hasShowCancelledSessionsPermission && (
        <Toggle
          id="show-cancelled-sessions"
          label={t("displaySettings.showCancelledSessions.label")}
          checked={showCancelledSessions}
          onToggleChange={setShowCancelledSessions}
        />
      )}
      <div className="flex flex-col gap-xs">
        <Body size="md" weight="weak">
          {t("displaySettings.displayedColumns.label")}
        </Body>
        <div className="flex flex-wrap gap-xs">
          {columns.map((column) => (
            <Button
              key={column.id}
              label={column.label}
              size="sm"
              intent="default"
              onClick={() => toggleColumn(column.id as Columns)}
              color={
                displayedColumns.includes(column.id as Columns)
                  ? "main"
                  : "selected"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
