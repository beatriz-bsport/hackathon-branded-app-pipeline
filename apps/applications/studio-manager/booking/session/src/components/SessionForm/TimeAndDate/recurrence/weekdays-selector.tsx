import { FC, useCallback, useEffect } from "react";

import { getISOWeekday } from "@bsport/datetime-manipulation";
import { FormField, useFormContext } from "@bsport/form";
import {
  Button,
  Chip,
  Menu,
  MenuProps,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { Label } from "#src/components/SessionForm/label";
import {
  CustomRecurrenceUnit,
  type ISOWeekday,
  RecurrenceType,
} from "#src/helpers/recurrence/types";
import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const RecurrenceWeekdaysSelector: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation(["common", "sessionCreation"]);

  const { watch, setValue, formState, clearErrors } =
    useFormContext<SessionCreationFormData>();

  const error = formState.errors.recurrenceWeekdays;

  const isRecurring = watch("isRecurring");

  const recurrenceType = watch("recurrenceType");

  const recurrenceUnit = watch("recurrenceUnit");

  const startDateTime = watch("startDateTime");

  const selectedWeekdays = watch("recurrenceWeekdays");

  const onSelectOption = useCallback(
    (
      optionId: string,
      { shouldDirty = true }: { shouldDirty?: boolean } = {},
    ) => {
      const weekday = Number(optionId) as ISOWeekday;
      const isSelected = selectedWeekdays[weekday];

      const updatedWeekdays = {
        ...selectedWeekdays,
        [weekday]: !isSelected,
      };

      setValue("recurrenceWeekdays", updatedWeekdays, {
        shouldValidate: true,
        shouldDirty,
      });
    },
    [setValue, selectedWeekdays],
  );

  // Set default weekday when startDateTime changes and no weekdays are selected
  useEffect(() => {
    if (!startDateTime) return;
    const anySelected =
      selectedWeekdays && Object.values(selectedWeekdays).some(Boolean);

    if (!anySelected) {
      const startDay = getISOWeekday(startDateTime);
      onSelectOption(startDay.toString());
    }
  }, [startDateTime, selectedWeekdays, onSelectOption]);

  // Clear recurrenceWeekdays error when conditions change such that validation no longer applies
  useEffect(() => {
    if (!isRecurring) {
      // Errors are cleared when recurrence is disabled
      // in RecurrenceToggle component
      return;
    }

    // For WEEKLY recurrence type
    if (recurrenceType === RecurrenceType.WEEKLY) {
      return; // Validation should apply
    }

    // For CUSTOM recurrence type with WEEKS unit
    if (
      recurrenceType === RecurrenceType.CUSTOM &&
      recurrenceUnit === CustomRecurrenceUnit.WEEKS
    ) {
      return; // Validation should apply
    }

    // In all other cases, clear the error
    clearErrors("recurrenceWeekdays");
  }, [isRecurring, recurrenceType, recurrenceUnit, clearErrors]);

  if (
    recurrenceType !== RecurrenceType.WEEKLY &&
    recurrenceUnit !== CustomRecurrenceUnit.WEEKS
  ) {
    return null;
  }

  const getSelectedWeekdayIds = (): string[] => {
    if (!selectedWeekdays) return [];
    return Object.keys(selectedWeekdays).filter(
      (key) => selectedWeekdays[Number(key) as ISOWeekday],
    );
  };

  const ISOWeekdays: ISOWeekday[] = [1, 2, 3, 4, 5, 6, 7];

  const options = ISOWeekdays.map((day) => ({
    id: day.toString(),
    label: t(`session.weekdays.${day}`, { ns: "common" }),
  }));

  const selectedChips = (() => {
    if (!selectedWeekdays) return [];
    return options.filter(
      (option) => selectedWeekdays[Number(option.id) as ISOWeekday],
    );
  })();

  const handleRemoveWeekday = (weekdayId: string) => {
    const selectedWeekdays = watch("recurrenceWeekdays");
    const weekday = Number(weekdayId) as ISOWeekday;
    const updatedWeekdays = {
      ...selectedWeekdays,
      [weekday]: false,
    };
    setValue("recurrenceWeekdays", updatedWeekdays, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
      <Popover>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => (
            <div className="flex flex-col gap-2xs">
              <Label
                text={t(
                  "addSessionModal.steps.configureSession.timeAndDate.recurrence.weekdaysSelector.label",
                  { ns: "sessionCreation" },
                )}
              />
              <Button
                id={`${fieldIdPrefix}-weekdays-selector`}
                label={t(
                  "addSessionModal.steps.configureSession.timeAndDate.recurrence.weekdaysSelector.placeholder",
                  { ns: "sessionCreation" },
                )}
                intent="default"
                color="main"
                size="md"
                iconRight="chevron-down"
                onClick={() => setIsPopoverOpened(true)}
              />
            </div>
          )}
        </Popover.Anchor>
        <Popover.Content placement="bottom-left" className="max-w-xs">
          {() => {
            return (
              <FormField<
                SessionCreationFormData,
                "recurrenceWeekdays",
                MenuProps
              >
                name="recurrenceWeekdays"
                mapProps={() => ({
                  onSelectOption,
                  selectedValues: getSelectedWeekdayIds(),
                })}
              >
                <Menu multiSelect items={options} />
              </FormField>
            );
          }}
        </Popover.Content>
      </Popover>
      {!!error && (
        <p
          data-component="Recurrence-Weekdays-Error"
          className="text-body-sm leading-xs text-ellipsis text-onsurface-status-critical-strong"
        >
          {error.message}
        </p>
      )}
      {selectedChips.length > 0 && (
        <div className="flex gap-md">
          {selectedChips.map((chip) => (
            <Chip
              key={chip.id}
              label={chip.label}
              dismissible
              type="weak"
              color="main"
              size="lg"
              onClick={() => handleRemoveWeekday(chip.id)}
            />
          ))}
        </div>
      )}
    </>
  );
};
