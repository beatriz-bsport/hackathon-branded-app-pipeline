import { ChangeEvent, useState } from "react";

import {
  Alert,
  Body,
  Card,
  DatePicker,
  Item,
  SegmentedControl,
  Select,
  type SelectedDate,
  TextField,
  cx,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  PAST_DATE_OPERATORS,
  RELATIVE_DATE_OPERATORS,
} from "./constants";
import type { DateFilterValue } from "./types";
import {
  createDefaultDateFilterValue,
  getDatePickerValue,
  getRelativeAlertMessage,
  isAbsoluteDateOperator,
  isDateFilterType,
  isRelativeDateOperator,
} from "./utils";

type DateFilterProps = {
  id: string;
  value?: DateFilterValue;
  defaultValue?: DateFilterValue;
  onChange?: (value: DateFilterValue) => void;
  disabled?: boolean;
  className?: string;
  errors?: {
    absoluteOperator?: string;
    absoluteFromDate?: string;
    absoluteToDate?: string;
    relativeOperator?: string;
    relativeFirstDays?: string;
    relativeSecondDays?: string;
  };
};

/**
 * Date primitive filter that supports absolute and relative date logic in controlled mode.
 */
export const DateFilter = ({
  id,
  value,
  defaultValue,
  onChange,
  disabled = false,
  className,
  errors,
}: DateFilterProps) => {
  const { t } = useTranslation("details");
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<DateFilterValue>(
    defaultValue ?? createDefaultDateFilterValue(),
  );
  const currentValue = isControlled ? value : internalValue;

  const emitChange = (nextValue: DateFilterValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const onDateTypeChange = (nextType: string) => {
    if (!isDateFilterType(nextType)) return;

    emitChange({
      ...currentValue,
      dateType: nextType,
    });
  };

  const onAbsoluteOperatorChange = (nextOperator: string) => {
    if (!isAbsoluteDateOperator(nextOperator)) return;

    emitChange({
      ...currentValue,
      absolute: {
        ...currentValue.absolute,
        operator: nextOperator,
        toDate:
          nextOperator === ABSOLUTE_DATE_OPERATORS.between
            ? currentValue.absolute.toDate
            : null,
      },
    });
  };

  const onRelativeOperatorChange = (nextOperator: string) => {
    if (!isRelativeDateOperator(nextOperator)) return;

    emitChange({
      ...currentValue,
      relative: {
        operator: nextOperator,
        firstDays: null,
        secondDays: null,
      },
    });
  };

  const onAbsoluteDateChange = (
    key: "fromDate" | "toDate",
    date: SelectedDate,
  ) => {
    const selectedDate = date && !Array.isArray(date) ? date.toISODate() : null;
    let nextFromDate =
      key === "fromDate" ? selectedDate : currentValue.absolute.fromDate;
    let nextToDate =
      key === "toDate" ? selectedDate : currentValue.absolute.toDate;

    if (nextFromDate && nextToDate && nextFromDate > nextToDate) {
      const earlierDate = nextFromDate < nextToDate ? nextFromDate : nextToDate;
      const laterDate = nextFromDate > nextToDate ? nextFromDate : nextToDate;
      nextFromDate = earlierDate;
      nextToDate = laterDate;
    }

    emitChange({
      ...currentValue,
      absolute: {
        ...currentValue.absolute,
        fromDate: nextFromDate,
        toDate: nextToDate,
      },
    });
  };

  const onRelativeNumberChange = (
    key: "firstDays" | "secondDays",
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const rawValue = event.target.value;
    const parsedValue = rawValue === "" ? null : Math.trunc(Number(rawValue));
    const sanitizedValue =
      parsedValue === null || Number.isNaN(parsedValue)
        ? null
        : Math.max(0, parsedValue);

    emitChange({
      ...currentValue,
      relative: {
        ...currentValue.relative,
        [key]: sanitizedValue,
      },
    });
  };

  const isAbsoluteBetween =
    currentValue.absolute.operator === ABSOLUTE_DATE_OPERATORS.between;
  const isRelativeBetween =
    currentValue.relative.operator === RELATIVE_DATE_OPERATORS.pastBetween ||
    currentValue.relative.operator === RELATIVE_DATE_OPERATORS.futureBetween;
  const relativeAlertMessagePayload = getRelativeAlertMessage(
    currentValue.relative.operator,
    currentValue.relative.firstDays,
    currentValue.relative.secondDays,
  );
  const relativeAlertMessage = relativeAlertMessagePayload
    ? t(`filters.date.alerts.${relativeAlertMessagePayload.key}`, {
        ...relativeAlertMessagePayload.values,
      })
    : null;

  const absoluteOperatorItems = [
    {
      id: ABSOLUTE_DATE_OPERATORS.onOrBefore,
      label: t("filters.date.operators.absolute.onOrBefore"),
    },
    {
      id: ABSOLUTE_DATE_OPERATORS.onOrAfter,
      label: t("filters.date.operators.absolute.onOrAfter"),
    },
    {
      id: ABSOLUTE_DATE_OPERATORS.exactlyOn,
      label: t("filters.date.operators.absolute.exactlyOn"),
    },
    {
      id: ABSOLUTE_DATE_OPERATORS.between,
      label: t("filters.date.operators.absolute.between"),
    },
  ];

  const relativeOperatorItems = [
    { type: "title", label: t("filters.date.operators.relative.pastLabel") },
    {
      id: RELATIVE_DATE_OPERATORS.pastMoreThan,
      label: t("filters.date.operators.relative.pastMoreThan"),
    },
    {
      id: RELATIVE_DATE_OPERATORS.pastExactly,
      label: t("filters.date.operators.relative.pastExactly"),
    },
    {
      id: RELATIVE_DATE_OPERATORS.pastBetween,
      label: t("filters.date.operators.relative.pastBetween"),
    },
    { type: "divider" },
    { type: "title", label: t("filters.date.operators.relative.futureLabel") },
    {
      id: RELATIVE_DATE_OPERATORS.futureMoreThan,
      label: t("filters.date.operators.relative.futureMoreThan"),
    },
    {
      id: RELATIVE_DATE_OPERATORS.futureExactly,
      label: t("filters.date.operators.relative.futureExactly"),
    },
    {
      id: RELATIVE_DATE_OPERATORS.futureBetween,
      label: t("filters.date.operators.relative.futureBetween"),
    },
  ] satisfies Item[];

  const segmentedControlOptions = [
    {
      value: DATE_FILTER_TYPES.absolute,
      label: t("filters.date.types.fixed"),
    },
    {
      value: DATE_FILTER_TYPES.relative,
      label: t("filters.date.types.relative"),
    },
  ];
  const hasErrors = Boolean(
    errors?.absoluteOperator ||
      errors?.absoluteFromDate ||
      errors?.absoluteToDate ||
      errors?.relativeOperator ||
      errors?.relativeFirstDays ||
      errors?.relativeSecondDays,
  );

  return (
    <Card
      className={cx(className, { "shadow-border-thin-critical": hasErrors })}
      padding="none"
    >
      <div className="flex flex-col gap-xs p-xs">
        <SegmentedControl
          id={`${id}-type`}
          className="h-[26px]"
          options={segmentedControlOptions}
          value={currentValue.dateType}
          onChangeValue={onDateTypeChange}
          fullWidth
          disabled={disabled}
        />

        {currentValue.dateType === DATE_FILTER_TYPES.absolute ? (
          <div className="flex flex-col gap-xs">
            <Body size="sm" color="weak">
              {t("filters.date.fixedHint")}
            </Body>
            <Select
              id={`${id}-absolute-operator`}
              items={absoluteOperatorItems}
              value={currentValue.absolute.operator}
              onChange={onAbsoluteOperatorChange}
              disabled={disabled}
              fullWidth
              status={errors?.absoluteOperator ? "critical" : "default"}
              errorText={errors?.absoluteOperator}
            />

            <div className="flex flex-row gap-xs">
              <DatePicker
                id={`${id}-absolute-from`}
                mode="single"
                displayAs="popover"
                isInputField
                dateValue={getDatePickerValue(currentValue.absolute.fromDate)}
                onSelect={(next) => onAbsoluteDateChange("fromDate", next)}
                disabled={disabled}
                status={errors?.absoluteFromDate ? "error" : "default"}
                statusText={errors?.absoluteFromDate}
              />

              {isAbsoluteBetween && (
                <DatePicker
                  id={`${id}-absolute-to`}
                  mode="single"
                  displayAs="popover"
                  isInputField
                  dateValue={getDatePickerValue(currentValue.absolute.toDate)}
                  onSelect={(next) => onAbsoluteDateChange("toDate", next)}
                  disabled={disabled}
                  status={errors?.absoluteToDate ? "error" : "default"}
                  statusText={errors?.absoluteToDate}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-xs">
            <Select
              id={`${id}-relative-operator`}
              items={relativeOperatorItems}
              value={currentValue.relative.operator}
              onChange={onRelativeOperatorChange}
              disabled={disabled}
              fullWidth
              status={errors?.relativeOperator ? "critical" : "default"}
              errorText={errors?.relativeOperator}
            />

            <div
              className={isRelativeBetween ? "flex flex-row gap-xs w-full" : ""}
            >
              <TextField
                id={`${id}-relative-first-days`}
                type="number"
                min={0}
                step={1}
                value={
                  currentValue.relative.firstDays === null
                    ? ""
                    : currentValue.relative.firstDays.toString()
                }
                onChange={(event) => onRelativeNumberChange("firstDays", event)}
                disabled={disabled}
                suffix={{
                  type: "text",
                  value: PAST_DATE_OPERATORS.includes(
                    currentValue.relative.operator,
                  )
                    ? t("filters.date.fields.daysAgo")
                    : t("filters.date.fields.daysFromNow"),
                }}
                fullWidth
                status={errors?.relativeFirstDays ? "error" : "default"}
                statusText={errors?.relativeFirstDays}
                customNode={
                  isRelativeBetween ? (
                    <Body className="self-center" size="sm">
                      {t("filters.date.fields.and")}
                    </Body>
                  ) : undefined
                }
              />

              {isRelativeBetween ? (
                <TextField
                  id={`${id}-relative-second-days`}
                  type="number"
                  min={0}
                  step={1}
                  value={
                    currentValue.relative.secondDays === null
                      ? ""
                      : currentValue.relative.secondDays.toString()
                  }
                  onChange={(event) =>
                    onRelativeNumberChange("secondDays", event)
                  }
                  disabled={disabled}
                  suffix={{
                    type: "text",
                    value:
                      currentValue.relative.operator ===
                      RELATIVE_DATE_OPERATORS.pastBetween
                        ? t("filters.date.fields.daysAgo")
                        : t("filters.date.fields.daysFromNow"),
                  }}
                  fullWidth
                  status={errors?.relativeSecondDays ? "error" : "default"}
                  statusText={errors?.relativeSecondDays}
                />
              ) : null}
            </div>

            {relativeAlertMessage && (
              <Alert status="default" type="weak">
                {relativeAlertMessage}
              </Alert>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
