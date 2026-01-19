import React from "react";

import { Body, SegmentedControl, Toggle } from "@bsport/kaizen-primitive-core";

import {
  CalendarView,
  selectCalendarView,
  selectShowCancelledSessions,
  setCalendarView,
  setShowCancelledSessions,
  useSessionListStore,
} from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

export const DisplaySettings: React.FC = () => {
  const { t } = useTranslation("sessionList");
  const hasShowCancelledSessionsPermission = useObjectLevelPermission(
    "planning.calendar.allowed_actions.readCancellations",
  );

  const onChangeCalendarView = (value: string) => {
    if (value === CalendarView.DAILY || value === CalendarView.RANGE) {
      setCalendarView(value as CalendarView);
    }
  };
  const calendarView = useSessionListStore(selectCalendarView);

  const showCancelledSessions = useSessionListStore(
    selectShowCancelledSessions,
  );

  return (
    <div className="flex flex-col gap-lg">
      <div className="p-xs flex flex-col gap-xs">
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
    </div>
  );
};
