import { z } from "zod";

import type {
  CreateGroupActivityPayload,
  EditGroupActivityPayload,
  MetaActivity,
} from "@bsport/api-book";

import { useTranslation } from "#src/utils/i18n";

export const fieldIdPrefix = "add-class";
export const AUTOMATIC_CANCELLATION_DEFAULT_MIN_BOOKINGS = 1;
export const AUTOMATIC_CANCELLATION_DEFAULT_HOURS_BEFORE_START = 6;

export type TimeFieldValue = {
  days: number;
  hours: number;
  minutes: number;
};

export type CustomRestrictionRule = {
  tags: number[];
  first_booking_minutes_until: TimeFieldValue;
  last_booking_minutes: TimeFieldValue;
  last_discard_minutes: TimeFieldValue;
};

export type ClassFormValues = {
  name: string;
  cover_main: File | string | null;
  alt_cover_main: string;
  SCT: string;
  description: string;
  color: string;
  is_workshop: boolean | null;
  first_booking_minutes_until: TimeFieldValue;
  last_booking_minutes: TimeFieldValue;
  last_discard_minutes: TimeFieldValue;
  custom_restriction_rule: CustomRestrictionRule[];
  auto_discard_active: boolean;
  auto_discard_hours_before_start: number;
  auto_discard_min_bookings_nb: number;
};

export const defaultCustomRestrictionRule: CustomRestrictionRule = {
  first_booking_minutes_until: { days: 180, hours: 0, minutes: 0 },
  last_booking_minutes: { days: 0, hours: 0, minutes: 0 },
  last_discard_minutes: { days: 0, hours: 0, minutes: 0 },
  tags: [],
};

export const defaultClassFormValues: ClassFormValues = {
  name: "",
  cover_main: null,
  alt_cover_main: "",
  SCT: "",
  description: "",
  color: "",
  is_workshop: null,
  first_booking_minutes_until: { days: 180, hours: 0, minutes: 0 },
  last_booking_minutes: { days: 0, hours: 0, minutes: 0 },
  last_discard_minutes: { days: 0, hours: 0, minutes: 0 },
  custom_restriction_rule: [],
  auto_discard_active: false,
  auto_discard_hours_before_start:
    AUTOMATIC_CANCELLATION_DEFAULT_HOURS_BEFORE_START,
  auto_discard_min_bookings_nb: AUTOMATIC_CANCELLATION_DEFAULT_MIN_BOOKINGS,
};

const timeFieldSchema = z.object({
  days: z.number().int().min(0),
  hours: z.number().int().min(0),
  minutes: z.number().int().min(0),
});

const customRestrictionSchema = z.object({
  first_booking_minutes_until: timeFieldSchema,
  last_booking_minutes: timeFieldSchema,
  last_discard_minutes: timeFieldSchema,
  tags: z.array(z.number().int()),
});

type ClassFormSchemaMode = "create" | "edit";

export const useClassFormSchema = (mode: ClassFormSchemaMode = "edit") => {
  const { t } = useTranslation("add-edit-form");
  const requiredMessage = t("addEditForm.modal.errors.requiredField");

  return z
    .object({
      name: z.string().trim().min(1, requiredMessage),
      cover_main: z.union([z.instanceof(File), z.string(), z.null()]),
      alt_cover_main: z.string(),
      SCT: z.string().min(1, requiredMessage),
      description: z.string().trim().min(1, requiredMessage),
      color: z.string(),
      is_workshop: z.boolean().nullable(),
      first_booking_minutes_until: timeFieldSchema,
      last_booking_minutes: timeFieldSchema,
      last_discard_minutes: timeFieldSchema,
      custom_restriction_rule:
        mode === "create"
          ? z.array(customRestrictionSchema).max(0)
          : z.array(customRestrictionSchema).max(3),
      auto_discard_active: z.boolean(),
      auto_discard_hours_before_start: z.number().int().min(0),
      auto_discard_min_bookings_nb: z.number().int().min(0),
    })
    .refine((data) => data.is_workshop !== null, {
      message: requiredMessage,
      path: ["is_workshop"],
    });
};

const toMinutes = ({ days, hours, minutes }: TimeFieldValue) =>
  days * 24 * 60 + hours * 60 + minutes;

const buildGroupActivityPayloadBase = (values: ClassFormValues) => ({
  name: values.name.trim(),
  SCT: Number(values.SCT),
  cover_main: values.cover_main,
  alt_cover_main: values.alt_cover_main,
  is_broadcast: false, // TODO: We're now skipping this field in the new revamped for now
  description: values.description.trim(),
  color: values.color,
  first_booking_minutes_until: toMinutes(values.first_booking_minutes_until),
  last_booking_minutes: toMinutes(values.last_booking_minutes),
  last_discard_minutes: toMinutes(values.last_discard_minutes),
  custom_restriction_rule: values.custom_restriction_rule.map((rule) => ({
    tags: rule.tags,
    first_booking_minutes_until: toMinutes(rule.first_booking_minutes_until),
    last_booking_minutes: toMinutes(rule.last_booking_minutes),
    last_discard_minutes: toMinutes(rule.last_discard_minutes),
  })),
  auto_discard_active: values.auto_discard_active,
  ...(values.auto_discard_active
    ? {
        auto_discard_hours_before_start: values.auto_discard_hours_before_start,
        auto_discard_min_bookings_nb: values.auto_discard_min_bookings_nb,
      }
    : {}),
});

const fromMinutes = (total: number): TimeFieldValue => {
  const days = Math.floor(total / 1440);
  const remaining = total - days * 1440;
  const hours = Math.floor(remaining / 60);
  const minutes = remaining % 60;
  return { days, hours, minutes };
};

export const fromMetaActivityToFormData = (
  metaActivity: MetaActivity,
): ClassFormValues => ({
  name: metaActivity.name,
  cover_main: metaActivity.cover_main ?? null,
  alt_cover_main: metaActivity.alt_cover_main ?? "",
  SCT: String(metaActivity.SCT),
  description: metaActivity.description ?? "",
  color: metaActivity.color ?? "",
  is_workshop: metaActivity.is_workshop,
  first_booking_minutes_until: fromMinutes(
    metaActivity.first_booking_minutes_until ?? 0,
  ),
  last_booking_minutes: fromMinutes(metaActivity.last_booking_minutes ?? 0),
  last_discard_minutes: fromMinutes(metaActivity.last_discard_minutes ?? 0),
  custom_restriction_rule: (metaActivity.custom_restriction_rule ?? []).map(
    (rule) => ({
      tags: rule.tags,
      first_booking_minutes_until: fromMinutes(
        rule.first_booking_minutes_until,
      ),
      last_booking_minutes: fromMinutes(rule.last_booking_minutes),
      last_discard_minutes: fromMinutes(rule.last_discard_minutes),
    }),
  ),
  auto_discard_active: metaActivity.auto_discard_active ?? false,
  auto_discard_hours_before_start:
    metaActivity.auto_discard_hours_before_start ?? 0,
  auto_discard_min_bookings_nb: metaActivity.auto_discard_min_bookings_nb ?? 0,
});

export const toCreateGroupActivityPayload = (
  values: ClassFormValues,
): CreateGroupActivityPayload => ({
  ...buildGroupActivityPayloadBase(values),
  custom_restriction_rule: [],
  is_workshop: values.is_workshop ?? false,
});

export const toEditGroupActivityPayload = (
  values: ClassFormValues,
): EditGroupActivityPayload => {
  const base = buildGroupActivityPayloadBase(values);
  // String = existing URL (unchanged). Omit so server keeps current image.
  // File = new upload, null = explicit clear — both send as-is.
  if (typeof base.cover_main === "string") {
    const { cover_main: _omitted, ...rest } = base;
    return rest;
  }
  return base;
};

export const STEP_1_FIELDS = [
  "is_workshop",
  "name",
  "SCT",
  "description",
] as const satisfies readonly (keyof ClassFormValues)[];

export const STEP_2_FIELDS = [
  "first_booking_minutes_until",
  "last_booking_minutes",
  "last_discard_minutes",
  "auto_discard_active",
  "auto_discard_hours_before_start",
  "auto_discard_min_bookings_nb",
] as const satisfies readonly (keyof ClassFormValues)[];
