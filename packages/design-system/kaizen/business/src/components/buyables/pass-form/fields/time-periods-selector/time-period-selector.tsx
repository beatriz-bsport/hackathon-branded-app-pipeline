import { Activity, FC } from "react";

import {
  WeekStartDay,
  getWeekStartDayFromLocale,
  getWeekdays,
} from "@bsport/datetime-manipulation";
import {
  Body,
  Button,
  TimePicker,
  Toggle,
  ToggleButton,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { TimePeriodSchedule } from "./types";
import { SLOT_DURATIONS, createTimeSlot } from "./utils";

type TimePeriodSelectorProps = {
  value: TimePeriodSchedule;
  onChange: (value: TimePeriodSchedule) => void;
  deleteTimePeriod?: () => void;
};

/**
 * Update one TimePeriodSchedule entry.
 * If All day is toggled, the component does not override the timeSlots, it changes only slotDurationChoice.
 * Why ? To not lose the preselected timeSlots when updating the variant.
 * Finally, it's the data updater that should compute the right final slot.
 */
export const TimePeriodSelector: FC<TimePeriodSelectorProps> = ({
  deleteTimePeriod,
  onChange,
  value,
}) => {
  const { t, i18n } = useTranslation("buyables", { i18n: i18nInstance });

  const isAllDay = value.slotDurationChoice === SLOT_DURATIONS.ALL_DAY;

  const updateTimeSlot = ({
    slotIndex,
    timeStart,
    timeEnd,
  }: {
    slotIndex: number;
    timeStart: string;
    timeEnd: string;
  }) => {
    onChange({
      ...value,
      timeSlots: value.timeSlots.map((item, index) =>
        index === slotIndex ? [timeStart, timeEnd] : item,
      ),
    });
  };

  const removeTimeSlot = (slotIndex: number) => {
    onChange({
      ...value,
      timeSlots: value.timeSlots.filter((_, index) => index !== slotIndex),
    });
  };

  const addTimeSlot = () => {
    onChange({
      ...value,
      timeSlots: [...value.timeSlots, createTimeSlot()],
    });
  };

  const weekStartDay = getWeekStartDayFromLocale(i18n.language);
  // List of days (first letter) organized based on the language (can start with monday or sunday)
  const weekdays = getWeekdays("narrow", i18n.language);

  const toggleWeekday = ({
    weekdayIndex,
    checked,
  }: {
    weekdayIndex: WeekStartDay;
    checked: boolean;
  }) => {
    onChange({
      ...value,
      selectedWeekDays: {
        ...value.selectedWeekDays,
        [weekdayIndex]: checked,
      },
    });
  };

  /**
   * Since weekdays is ordered base on the language (it can start by Monday, Sunday, or Saturday),
   * we need to map the index of the list to the right WeekDay, which is
   * 1 = Monday, 2 = Tuesday, 3 = Wednesday, etc ...
   */
  const getWeekdayIndex = (baseIndex: number) => {
    return (((weekStartDay - 1 + baseIndex) % 7) + 1) as WeekStartDay;
  };

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex flex-row justify-start items-center gap-sm">
        <Body weight="strong">{t("passForm.timeRestrictions.timePeriod")}</Body>
        <Button
          intent="flat"
          icon="x-close"
          label={t("passForm.timeRestrictions.buttonLabels.removeTimeSchedule")}
          color="default"
          size="md"
          kind="icon-button"
          disabled={!deleteTimePeriod}
          onClick={deleteTimePeriod}
        />
      </div>

      <div className="flex flex-row flex-wrap items-center gap-xs">
        {weekdays.map((weekday, index) => {
          const weekdayIndex = getWeekdayIndex(index);
          return (
            <ToggleButton
              key={`${index}-${weekday}`}
              size="sm"
              id={`${value.identifier}-toggle-weekday-${index}-${weekday}`}
              checkedConfig={{
                label: weekday.toUpperCase(),
              }}
              uncheckedConfig={{
                label: weekday.toUpperCase(),
              }}
              checked={value.selectedWeekDays[weekdayIndex]}
              onChange={({ checked }) =>
                toggleWeekday({ weekdayIndex, checked })
              }
            />
          );
        })}
      </div>

      <Toggle
        id={`${value.identifier}-toggle-all-day`}
        label={t("passForm.timeRestrictions.allDay")}
        onToggleChange={(checked) => {
          onChange({
            ...value,
            slotDurationChoice: checked
              ? SLOT_DURATIONS.ALL_DAY
              : SLOT_DURATIONS.TIME_SLOT,
          });
        }}
        checked={isAllDay}
      />

      <Activity mode={isAllDay ? "hidden" : "visible"}>
        {value.timeSlots.map((item, slotIndex) => {
          const [timeStart, timeEnd] = item;
          return (
            <div
              key={`${value.identifier}-slot-${slotIndex}-${item.join("-")}`}
              className="flex flex-row flex-wrap items-center gap-sm"
            >
              <TimePicker
                id={`${value.identifier}-slot-${slotIndex}-time-start`}
                interval={5}
                value={timeStart}
                onChange={(newTime) =>
                  updateTimeSlot({ slotIndex, timeStart: newTime, timeEnd })
                }
              />

              <TimePicker
                id={`${value.identifier}-slot-${slotIndex}-time-end`}
                interval={5}
                value={timeEnd}
                onChange={(newTime) =>
                  updateTimeSlot({ slotIndex, timeStart, timeEnd: newTime })
                }
              />

              <Button
                intent="default"
                icon="x-close"
                label={t(
                  "passForm.timeRestrictions.buttonLabels.removeTimeSlot",
                )}
                color="main"
                size="md"
                kind="icon-button"
                disabled={value.timeSlots.length <= 1}
                onClick={() => removeTimeSlot(slotIndex)}
              />

              {slotIndex === value.timeSlots.length - 1 && (
                <Button
                  intent="default"
                  icon="plus"
                  label={t(
                    "passForm.timeRestrictions.buttonLabels.addTimeSlot",
                  )}
                  color="main"
                  size="md"
                  kind="icon-button"
                  onClick={addTimeSlot}
                />
              )}
            </div>
          );
        })}
      </Activity>
    </div>
  );
};
