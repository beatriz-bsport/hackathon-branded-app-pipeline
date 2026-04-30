import { type ChangeEvent, useState } from "react";

import { Body, Select, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { NUMERIC_COMPARATOR_OPERATORS } from "./constants";
import type { NumericComparatorFilterValue } from "./types";
import {
  defaultNumericComparatorFilterValue,
  getSanitizedPositiveInteger,
  isNumericComparatorOperator,
} from "./utils";

type NumericComparatorFilterProps = {
  id: string;
  value?: NumericComparatorFilterValue;
  defaultValue?: NumericComparatorFilterValue;
  onChange?: (value: NumericComparatorFilterValue) => void;
  disabled?: boolean;
  className?: string;
  suffix?: string;
};

/**
 * Numeric comparator primitive filter supporting single-value and range comparisons.
 */
export const NumericComparatorFilter = ({
  id,
  value,
  defaultValue,
  onChange,
  disabled = false,
  className,
  suffix,
}: NumericComparatorFilterProps) => {
  const { t } = useTranslation("details");
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] =
    useState<NumericComparatorFilterValue>(
      defaultValue ?? defaultNumericComparatorFilterValue,
    );
  const currentValue = isControlled ? value : internalValue;

  const emitChange = (nextValue: NumericComparatorFilterValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleOperatorChange = (nextOperator: string) => {
    if (!isNumericComparatorOperator(nextOperator)) return;

    emitChange({
      ...currentValue,
      operator: nextOperator,
      secondValue:
        nextOperator === NUMERIC_COMPARATOR_OPERATORS.between
          ? currentValue.secondValue
          : null,
    });
  };

  const handleNumberChange =
    (key: "firstValue" | "secondValue") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = getSanitizedPositiveInteger(event.target.value);

      emitChange({
        ...currentValue,
        [key]: sanitizedValue,
      });
    };

  const comparatorItems = [
    {
      id: NUMERIC_COMPARATOR_OPERATORS.equal,
      label: t("filters.numericComparator.operators.equal"),
    },
    {
      id: NUMERIC_COMPARATOR_OPERATORS.between,
      label: t("filters.numericComparator.operators.between"),
    },
    {
      id: NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual,
      label: t("filters.numericComparator.operators.lowerOrEqual"),
    },
    {
      id: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
      label: t("filters.numericComparator.operators.greaterOrEqual"),
    },
  ];

  const isBetween =
    currentValue.operator === NUMERIC_COMPARATOR_OPERATORS.between;
  const suffixText = suffix ?? undefined;

  return (
    <div className={className}>
      <div
        className={
          currentValue.operator === NUMERIC_COMPARATOR_OPERATORS.between
            ? "flex flex-col gap-xs items-start"
            : "flex flex-row gap-xs items-start"
        }
      >
        <Select
          id={`${id}-operator`}
          items={comparatorItems}
          value={currentValue.operator}
          onChange={handleOperatorChange}
          disabled={disabled}
          fullWidth
        />
        <div className="flex flex-row gap-xs items-center">
          <TextField
            id={`${id}-first-value`}
            type="number"
            min={0}
            value={
              currentValue.firstValue === null
                ? ""
                : currentValue.firstValue.toString()
            }
            onChange={handleNumberChange("firstValue")}
            disabled={disabled}
            suffix={
              suffixText ? { type: "text", value: suffixText } : undefined
            }
            fullWidth
          />

          {isBetween && (
            <>
              <Body size="sm" color="weak">
                {t("filters.numericComparator.fields.and")}
              </Body>
              <TextField
                id={`${id}-second-value`}
                type="number"
                min={currentValue.firstValue ?? 0}
                value={
                  currentValue.secondValue === null
                    ? ""
                    : currentValue.secondValue.toString()
                }
                onChange={handleNumberChange("secondValue")}
                disabled={disabled}
                suffix={
                  suffixText ? { type: "text", value: suffixText } : undefined
                }
                fullWidth
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
