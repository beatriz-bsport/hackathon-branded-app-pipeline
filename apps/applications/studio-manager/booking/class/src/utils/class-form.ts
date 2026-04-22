import { z } from "zod";

import type { CreateGroupActivityPayload } from "@bsport/api-book";

import { useTranslation } from "#src/utils/i18n";

export const fieldIdPrefix = "add-class";

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
  is_broadcast: boolean;
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
  is_broadcast: false,
  first_booking_minutes_until: { days: 180, hours: 0, minutes: 0 },
  last_booking_minutes: { days: 0, hours: 0, minutes: 0 },
  last_discard_minutes: { days: 0, hours: 0, minutes: 0 },
  custom_restriction_rule: [],
  auto_discard_active: false,
  auto_discard_hours_before_start: 0,
  auto_discard_min_bookings_nb: 0,
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

export const useClassFormSchema = () => {
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
      is_broadcast: z.boolean(),
      first_booking_minutes_until: timeFieldSchema,
      last_booking_minutes: timeFieldSchema,
      last_discard_minutes: timeFieldSchema,
      custom_restriction_rule: z.array(customRestrictionSchema).max(3),
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

export const toCreateGroupActivityPayload = (
  values: ClassFormValues,
): CreateGroupActivityPayload => ({
  name: values.name.trim(),
  SCT: Number(values.SCT),
  is_workshop: values.is_workshop ?? false,
  cover_main: values.cover_main,
  alt_cover_main: values.alt_cover_main.trim(),
  description: values.description.trim(),
  color: values.color,
  is_broadcast: values.is_broadcast,
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
