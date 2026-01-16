import { z } from "zod";

import {
  getLocalNow,
  modifyTime,
  toDateTime,
} from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";
import type {
  SessionCreationFormAdvancedOptionsData,
  SessionCreationFormData,
} from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { LevelFormData } from "./types";

export type SessionCreationFormSchema = z.ZodType<SessionCreationFormData>;

export type SessionCreationFormAdvancedOptionsSchema =
  z.ZodType<SessionCreationFormAdvancedOptionsData>;

export const MAX_YEARS_AHEAD = 3;

// Will merge the schemas for each section here
export const useSessionSchema = () => {
  const { t, i18n } = useTranslation("sessionCreation");
  const locale = i18n.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const configureSessionSchema = z
    .object({
      allowCustomNameAndDescription: z.boolean(),
      name_override: z.string(),
      description_override: z.string(),
      manager_only: z.boolean(),
      credits: z.number().min(0),
      waiting_list_max_size: z.number().min(0),
      // TODO : ADD VALIDATION FOR EFFECTIF BASED ON ROOM BLUEPRINT CAPACITY
      effectif: z.number().min(0),
      available_on_partnership: z.boolean(),
      partner_max_booking_count: z.number().min(0),
      startDateTime: z
        .date({
          required_error: t("addSessionModal.errors.requiredField"),
          invalid_type_error: t(
            "addSessionModal.steps.configureSession.timeAndDate.errors.invalidDate",
          ),
        })
        .refine(
          (date) => {
            const maxDate = modifyTime({
              datetime: getLocalNow({ zone: companyTimeZone, locale }),
              duration: { year: MAX_YEARS_AHEAD },
              operator: "plus",
            });
            return toDateTime(date).setZone(companyTimeZone) <= maxDate;
          },
          {
            message: t(
              "addSessionModal.steps.configureSession.timeAndDate.errors.dateTooFar",
            ),
          },
        ),
      duration_minute: z
        .number({
          required_error: t("addSessionModal.errors.requiredField"),
        })
        .positive(
          t(
            "addSessionModal.steps.configureSession.timeAndDate.errors.durationNull",
          ),
        ),
      isRecurring: z.boolean(),
      recurrenceType: z.nativeEnum(RecurrenceType),
      recurrenceWeekdays: z.object({
        1: z.boolean(),
        2: z.boolean(),
        3: z.boolean(),
        4: z.boolean(),
        5: z.boolean(),
        6: z.boolean(),
        7: z.boolean(),
      }),
      recurrenceUnit: z.nativeEnum(CustomRecurrenceUnit),
      recurrenceInterval: z.number().int().positive(),
      recurrencePattern: z.nativeEnum(MonthlyRecurrencePattern),
      recurrenceEndDate: z.date().nullable(),
      level: z.number().int(),
      is_hybrid: z.boolean(),
      coach: z.number().nullable(),
      coach_payment_rule: z.number().nullable(),
      // Two options here: empty string (no link, if zoom app enabled or if the selected group activity is not livestream) or valid URL
      broadcast_link: z.string().refine(
        (val) => {
          if (val === "") return true;
          try {
            new URL(val);
            return (
              (val.startsWith("http://") || val.startsWith("https://")) &&
              !val.includes(" ")
            );
          } catch {
            return false;
          }
        },
        {
          message: t(
            "addSessionModal.steps.configureSession.settings.broadcast.error",
          ),
        },
      ),
      establishment: z.number().nullable(),
      room_blueprint: z.number().nullish(),
    })
    .refine(
      (data) => {
        return data.coach !== null;
      },
      {
        message: t("addSessionModal.errors.requiredField"),
        path: ["coach"],
      },
    )
    .refine(
      (data) => {
        return data.establishment !== null;
      },
      {
        message: t("addSessionModal.errors.requiredField"),
        path: ["establishment"],
      },
    )
    .refine(
      (data) => {
        if (!data.isRecurring) return true;
        return !!data.recurrenceType;
      },
      {
        message: t(
          "addSessionModal.steps.configureSession.timeAndDate.errors.recurrenceType",
        ),
        path: ["recurrenceType"],
      },
    )
    .refine(
      (data) => {
        if (!data.isRecurring) return true;
        return !!data.recurrenceEndDate;
      },
      {
        message: t(
          "addSessionModal.steps.configureSession.timeAndDate.errors.recurrenceEndDate",
        ),
        path: ["recurrenceEndDate"],
      },
    )
    .refine(
      (data) => {
        if (!data.isRecurring || !data.recurrenceEndDate) return true;
        return (
          toDateTime(data.recurrenceEndDate, companyTimeZone) >
          toDateTime(data.startDateTime, companyTimeZone)
        );
      },
      {
        message: t(
          "addSessionModal.steps.configureSession.timeAndDate.errors.recurrenceEndDateBeforeStartDate",
        ),
        path: ["recurrenceEndDate"],
      },
    )
    .refine(
      (data) => {
        if (!data.isRecurring || !data.recurrenceEndDate) return true;

        const maxDate = modifyTime({
          datetime: getLocalNow({ zone: companyTimeZone, locale }),
          duration: { year: MAX_YEARS_AHEAD },
          operator: "plus",
        });
        return (
          toDateTime(data.recurrenceEndDate).setZone(companyTimeZone) <= maxDate
        );
      },
      {
        message: t(
          "addSessionModal.steps.configureSession.timeAndDate.errors.dateTooFar",
        ),
        path: ["recurrenceEndDate"],
      },
    )
    .refine(
      (data) => {
        if (!data.isRecurring) return true;
        if (data.recurrenceType !== RecurrenceType.WEEKLY) return true;
        if (!data.recurrenceWeekdays) return false;
        return Object.values(data.recurrenceWeekdays).some(
          (selected) => selected,
        );
      },
      {
        message: t(
          "addSessionModal.steps.configureSession.timeAndDate.errors.recurrenceWeekdays",
        ),
        path: ["recurrenceWeekdays"],
      },
    )
    .refine(
      (data) => {
        if (!data.isRecurring) return true;
        if (data.recurrenceType !== RecurrenceType.CUSTOM) return true;
        return !!data.recurrenceUnit;
      },
      {
        message: t(
          "addSessionModal.steps.configureSession.timeAndDate.errors.recurrenceUnit",
        ),
        path: ["recurrenceUnit"],
      },
    )
    .refine(
      (data) => {
        if (!data.isRecurring) return true;
        if (data.recurrenceType !== RecurrenceType.CUSTOM) return true;
        return !!data.recurrenceInterval;
      },
      {
        message: t(
          "addSessionModal.steps.configureSession.timeAndDate.errors.recurrenceInterval",
        ),
        path: ["recurrenceInterval"],
      },
    )
    .refine(
      (data) => {
        if (!data.isRecurring) return true;
        if (data.recurrenceType !== RecurrenceType.CUSTOM) return true;
        if (data.recurrenceUnit !== CustomRecurrenceUnit.WEEKS) return true;
        if (!data.recurrenceWeekdays) return false;
        return Object.values(data.recurrenceWeekdays).some(
          (selected) => selected,
        );
      },
      {
        message: t(
          "addSessionModal.steps.configureSession.timeAndDate.errors.recurrenceWeekdays",
        ),
        path: ["recurrenceWeekdays"],
      },
    )
    .refine(
      (data) => {
        if (!data.isRecurring) return true;
        if (data.recurrenceType !== RecurrenceType.CUSTOM) return true;
        if (data.recurrenceUnit !== CustomRecurrenceUnit.MONTHS) return true;
        return !!data.recurrencePattern;
      },
      {
        message: t(
          "addSessionModal.steps.configureSession.timeAndDate.errors.recurrencePattern",
        ),
        path: ["recurrencePattern"],
      },
    )
    .refine(
      (data) =>
        !data.available_on_partnership ||
        data.partner_max_booking_count <= data.effectif,
      {
        message: t(
          "addSessionModal.steps.configureSession.settings.partnership.capacity.error",
        ),
        path: ["partner_max_booking_count"],
      },
    ) satisfies SessionCreationFormSchema;

  const advancedOptionsSchema = z.object({
    allow_guest_offer: z.boolean(),
    blacklist_tags: z.array(z.number().int()),
    whitelist_tags: z.array(z.number().int()),
  }) satisfies SessionCreationFormAdvancedOptionsSchema;

  return { configureSessionSchema, advancedOptionsSchema };
};

export const useLevelSchema = () => {
  const { t } = useTranslation("sessionCreation");
  return z.object({
    name: z
      .string()
      .min(1, t("addSessionModal.errors.requiredField"))
      .max(50, t("addSessionModal.errors.levelNameTooLong")),
    color: z.string(),
  }) satisfies z.ZodType<LevelFormData>;
};
