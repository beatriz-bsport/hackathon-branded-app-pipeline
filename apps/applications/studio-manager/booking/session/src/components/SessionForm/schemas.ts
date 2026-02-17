import { z } from "zod";

import {
  getLocalNow,
  modifyTime,
  toDateTime,
} from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { TeacherSubstitutionPropagationMode } from "#src/constants";
import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";
import type {
  SessionCreationDateTimeFormData,
  SessionCreationFormAdvancedOptionsData,
  SessionCreationFormData,
} from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { LevelFormData, SessionEditFormData } from "./types";

export type SessionCreationFormSchema = z.ZodType<SessionCreationFormData>;

export type SessionCreationFormAdvancedOptionsSchema =
  z.ZodType<SessionCreationFormAdvancedOptionsData>;

export type SessionFormData = SessionCreationFormData &
  SessionCreationFormAdvancedOptionsData;

export type SessionFormSchema = z.ZodType<SessionFormData>;

export type SessionEditFormSchema = z.ZodType<SessionEditFormData>;

export const MAX_YEARS_AHEAD = 3;

export const useDateTimeSchemaObject = () => {
  const { t, i18n } = useTranslation("sessionCreation");
  const locale = i18n.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  return z.object({
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
  });
};

export const useRefineDateTimeSchema = <
  T extends SessionCreationDateTimeFormData,
>(
  schema: z.ZodType<T>,
) => {
  const { t, i18n } = useTranslation("sessionCreation");
  const locale = i18n.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  return schema
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
    );
};
// Will merge the schemas for each section here
export const useSessionSchema = () => {
  const { t } = useTranslation("sessionCreation");

  const dateTimeSchema = useDateTimeSchemaObject();
  const configureSessionSchemaObject = dateTimeSchema.extend(
    z.object({
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
      room_blueprint: z.number().nullable(),
      roomBlueprintCapacity: z.number().nullable(),
      sync_on_spivi: z.boolean().optional(),
      wellhub_product_id: z.number().nullish(),
    }).shape,
  ) satisfies SessionCreationFormSchema;

  const refineDateTimeSchema = useRefineDateTimeSchema(
    configureSessionSchemaObject,
  );

  const configureSessionSchema = refineDateTimeSchema
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
      (data) =>
        !data.available_on_partnership ||
        data.partner_max_booking_count <= data.effectif,
      {
        message: t(
          "addSessionModal.steps.configureSession.settings.partnership.capacity.error",
        ),
        path: ["partner_max_booking_count"],
      },
    )
    .refine(
      (data) =>
        data.roomBlueprintCapacity != null
          ? data.effectif <= data.roomBlueprintCapacity
          : true,
      {
        message: t(
          "addSessionModal.steps.configureSession.settings.exceedsRoomCapacity",
        ),
        path: ["effectif"],
      },
    )
    .refine((data) => (data.sync_on_spivi ? !!data.room_blueprint : true), {
      message: t(
        "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.spotScheduling.error",
      ),
      path: ["effectif"],
    }) satisfies SessionCreationFormSchema;

  const advancedOptionsSchema = z.object({
    allow_guest_offer: z.boolean(),
    blacklist_tags: z.array(z.number().int()),
    whitelist_tags: z.array(z.number().int()),
  }) satisfies SessionCreationFormAdvancedOptionsSchema;

  const sessionSchema = z.intersection(
    configureSessionSchema,
    advancedOptionsSchema,
  );

  return { configureSessionSchema, advancedOptionsSchema, sessionSchema };
};

export const useSessionEditSchema = () => {
  const { t, i18n } = useTranslation("sessionCreation");
  const locale = i18n.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const sessionEditSchema = z
    .object({
      // Date & Time
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
      // Details
      name_override: z.string(),
      description_override: z.string(),

      // Settings
      manager_only: z.boolean(),
      credits: z.number().min(0),
      waiting_list_max_size: z.number().min(0),
      effectif: z.number().min(0),
      available_on_partnership: z.boolean(),
      partner_max_booking_count: z.number().min(0),
      level: z.number().int(),
      coach: z.number(),
      coach_payment_rule: z.number().nullable(),
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
      establishment: z.number(),
      room_blueprint: z.number().nullable(),
      roomBlueprintCapacity: z.number().nullable(),
      sync_on_spivi: z.boolean().optional(),
      wellhub_product_id: z.number().nullish(),

      // Advanced options
      allow_guest_offer: z.boolean(),
      blacklist_tags: z.array(z.number().int()),
      whitelist_tags: z.array(z.number().int()),

      // Edit-specific fields
      meta_activity: z.number(),
      overrideTeacherPayrollRule: z.boolean(),
      coach_override: z.number().nullable(),
      credit_price_override: z.number().optional(),
      custom_selection_ids: z.array(z.number().int()),
      custom_selection: z.boolean(),
      modifyAllDates: z.boolean(),
      notifyConsumers: z.boolean(),
      propagate_coach_override_value: z.nativeEnum(
        TeacherSubstitutionPropagationMode,
      ),
    })
    .refine(
      (data) =>
        !data.overrideTeacherPayrollRule || data.coach_payment_rule != null,
      {
        message: t("addSessionModal.errors.requiredField"),
        path: ["coach_payment_rule"],
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
    )
    .refine(
      (data) =>
        data.roomBlueprintCapacity != null
          ? data.effectif <= data.roomBlueprintCapacity
          : true,
      {
        message: t(
          "addSessionModal.steps.configureSession.settings.exceedsRoomCapacity",
        ),
        path: ["effectif"],
      },
    )
    .refine((data) => (data.sync_on_spivi ? !!data.room_blueprint : true), {
      message: t(
        "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.spotScheduling.error",
      ),
      path: ["effectif"],
    }) satisfies z.ZodType<SessionEditFormData>;

  return { sessionEditSchema };
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
