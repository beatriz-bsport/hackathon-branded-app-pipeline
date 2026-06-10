import { z } from "zod";

import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";

import {
  ABSOLUTE_DATE_OPERATOR_BETWEEN,
  DATE_FILTER_TYPE_ABSOLUTE,
} from "#src/components/primitive-filters/date-filter/constants";
import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";

import { mapDateFilterType } from "./smartlist-date-utils";

type SmartlistDateSubFilterValidationMessages = {
  dateRequired: string;
  dateBetweenRequired: string;
  durationRequired: string;
  durationBetweenRequired: string;
};

type RefineSmartlistDateSubFilterParams = {
  isActive: boolean;
  fieldPath: string;
  dateValue: DateFilterValue;
  context: z.RefinementCtx;
  messages: SmartlistDateSubFilterValidationMessages;
};

/**
 * Shared conditional validation for an active smartlist date sub-filter slot.
 */
export const refineSmartlistDateSubFilter = ({
  isActive,
  fieldPath,
  dateValue,
  context,
  messages,
}: RefineSmartlistDateSubFilterParams) => {
  if (!isActive) {
    return;
  }

  const dateFilterType = mapDateFilterType(dateValue);

  if (dateValue.dateType === DATE_FILTER_TYPE_ABSOLUTE) {
    const { operator, fromDate, toDate } = dateValue.absolute;
    if (
      operator === ABSOLUTE_DATE_OPERATOR_BETWEEN &&
      (!fromDate || !toDate || fromDate.trim() === "" || toDate.trim() === "")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [fieldPath, "absolute", "toDate"],
        message: messages.dateBetweenRequired,
      });
      return;
    }
    if (
      operator !== ABSOLUTE_DATE_OPERATOR_BETWEEN &&
      (!fromDate || fromDate.trim() === "")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [fieldPath, "absolute", "fromDate"],
        message: messages.dateRequired,
      });
    }
    return;
  }

  const { firstDays, secondDays } = dateValue.relative;

  if (dateFilterType === SmartlistDateFilterType.DURATION_BETWEEN) {
    if (secondDays === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [fieldPath, "relative", "secondDays"],
        message: messages.durationBetweenRequired,
      });
    }
    if (firstDays === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [fieldPath, "relative", "firstDays"],
        message: messages.durationRequired,
      });
    }
    return;
  }

  if (firstDays === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: [fieldPath, "relative", "firstDays"],
      message: messages.durationRequired,
    });
  }
};
