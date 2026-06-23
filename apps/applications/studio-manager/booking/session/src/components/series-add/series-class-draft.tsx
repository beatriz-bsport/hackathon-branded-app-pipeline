import { z } from "zod";

import {
  getLocalNow,
  getStartOf,
  modifyTime,
} from "@bsport/datetime-manipulation";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import {
  useDateTimeSchemaObject,
  useRefineDateTimeSchema,
} from "#src/components/SessionForm/schemas";
import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";
import type {
  SeriesClassDraftFormData,
  SeriesClassDraftFormSchema,
} from "#src/types";
import { useTranslation } from "#src/utils/i18n";

export const getDefaultSeriesClassDraftFormValues =
  (): SeriesClassDraftFormData => {
    const now = getLocalNow({ zone: getCompanyTimezone() });
    const today8AM = now.set({
      hour: 8,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const defaultEndDate = modifyTime({
      datetime: now,
      duration: { day: 1 },
      operator: "plus",
    });

    return {
      coach: null,
      coach_payment_rule: null,
      credits: 1,
      duration_minute: 60,
      effectif: 10,
      establishment: null,
      isRecurring: false,
      recurrenceEndDate: getStartOf({
        dateTime: defaultEndDate,
        unit: "day",
      }),
      recurrenceInterval: 1,
      recurrencePattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
      recurrenceType: RecurrenceType.WEEKLY,
      recurrenceUnit: CustomRecurrenceUnit.DAYS,
      recurrenceWeekdays: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
      },
      room_blueprint: null,
      roomBlueprintCapacity: null,
      startDateTime: today8AM,
    };
  };

export const useSeriesClassDraftFormSchema = (): SeriesClassDraftFormSchema => {
  const { t } = useTranslation("sessionCreation");
  const dateTimeSchema = useDateTimeSchemaObject();

  const schema = dateTimeSchema.extend(
    z.object({
      coach: z.number().nullable(),
      coach_payment_rule: z.number().nullable(),
      credits: z.number().min(0),
      effectif: z.number().min(0),
      establishment: z.number().nullable(),
      room_blueprint: z.number().nullable(),
      roomBlueprintCapacity: z.number().nullable(),
    }).shape,
  ) satisfies SeriesClassDraftFormSchema;

  return useRefineDateTimeSchema(schema)
    .refine((data) => data.coach !== null, {
      message: t("addSessionModal.errors.requiredField"),
      path: ["coach"],
    })
    .refine((data) => data.establishment !== null, {
      message: t("addSessionModal.errors.requiredField"),
      path: ["establishment"],
    }) satisfies SeriesClassDraftFormSchema;
};
