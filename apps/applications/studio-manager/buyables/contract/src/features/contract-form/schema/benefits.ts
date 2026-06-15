import { z } from "zod";

import type { TimePeriodSchedule } from "@bsport/kaizen-business-components/buyables/pass-form";

import { BENEFIT_KIND } from "#src/utils/contract-benefit";
import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";

/**
 * Form-shaped schema for `payment_pack_details` (PASS benefit). Penalty
 * fields are kept lax here; their positivity is enforced conditionally in
 * `useBenefitSchema` (only for an unlimited pass with penalties applied and the
 * matching penalty block active).
 */
const passDetailsSchema = z.object({
  theorical_margin_value: z.number().min(FIELD_CONSTRAINTS.MARGIN_MIN),
  max_bookings_per_month: z.number().nullable(),
  max_bookings_per_week: z.number().nullable(),
  max_bookings_per_day: z.number().nullable(),
  max_purchase_per_member: z.number().nullable(),
  penalty_active: z.boolean(),
  penalty_nb_late_cancellations: z.number(),
  penalty_nb_days: z.number(),
  penalty_kind: z.number(),
  penalty_days_blocked: z.number(),
  penalty_account_value: z.number(),
  no_show_penalty_active: z.boolean(),
  no_show_penalty_threshold: z.number(),
  no_show_penalty_time_window_days: z.number(),
  no_show_penalty_kind: z.number(),
  no_show_penalty_days_blocked: z.number(),
  no_show_penalty_amount: z.number(),
  sct_ids: z.array(z.number()),
  meta_activity_ids: z.array(z.number()),
  establishment_ids: z.array(z.number()),
  full_vod_access: z.boolean(),
  only_vod_access: z.boolean(),
  allow_guest_pass: z.boolean(),
  applies_for_payroll: z.boolean(),
  // Frontend-only helper flags
  hasUnlimitedCredits: z.boolean(),
  applyPenalties: z.boolean(),
  offPeakActive: z.boolean(),
  hasMaximumUsage: z.boolean(),
  off_peak_schedule: z.array(z.custom<TimePeriodSchedule>()),
});

/** Penalty magnitude fields that must be positive when their block is active. */
const LATE_CANCELLATION_FIELDS = [
  "penalty_nb_late_cancellations",
  "penalty_nb_days",
  "penalty_days_blocked",
  "penalty_account_value",
] as const;

const NO_SHOW_FIELDS = [
  "no_show_penalty_threshold",
  "no_show_penalty_time_window_days",
  "no_show_penalty_days_blocked",
  "no_show_penalty_amount",
] as const;

/** Form-shaped schema for `private_pass_details` (APPOINTMENT-PASS benefit). */
const appointmentPassDetailsSchema = z.object({
  is_unpaid_private_booking_integration: z.boolean(),
  available: z.boolean(),
  applies_for_payroll: z.boolean(),
  on_behalf_of_teacher: z.boolean(),
  full_vod_access: z.boolean(),
  category_id: z.number().nullable(),
  private_service_ids: z.array(z.number()).nullable(),
  compatibility: z.array(
    z.object({
      private_service: z.number(),
      excluded_slot_ids: z.array(z.number()),
    }),
  ),
});

/** Fields shared by both benefits, mirrored into each detail object at submit. */
const sharedDetailsSchema = z.object({
  credits: z.number().min(FIELD_CONSTRAINTS.CREDITS_MIN).nullable(),
  grants_door_access: z.boolean(),
});

/** A `pass` contract: only `payment_pack_details` is configured. */
export const passSchema = z.object({
  benefitKind: z.literal(BENEFIT_KIND.PASS),
  payment_pack_details: passDetailsSchema,
  private_pass_details: appointmentPassDetailsSchema.nullable(),
  shared_details: sharedDetailsSchema,
});

/** An `appointment-pass` contract: only `private_pass_details` is configured. */
export const appointmentPassSchema = z.object({
  benefitKind: z.literal(BENEFIT_KIND.APPOINTMENT_PASS),
  payment_pack_details: passDetailsSchema.nullable(),
  private_pass_details: appointmentPassDetailsSchema,
  shared_details: sharedDetailsSchema,
});

/** A `universal-pass` contract: both detail objects are configured. */
export const universalPassSchema = z.object({
  benefitKind: z.literal(BENEFIT_KIND.UNIVERSAL_PASS),
  payment_pack_details: passDetailsSchema,
  private_pass_details: appointmentPassDetailsSchema,
  shared_details: sharedDetailsSchema,
});

/**
 * Discriminated benefit schema. The form always carries every detail object;
 * `benefitKind` picks which one is required and the cross-field rules below
 * (credits / penalties) are enforced on top.
 */
export function useBenefitSchema() {
  const { t } = useTranslation("contract-details");
  const requiredErrorMessage = t("formFields.errors.fieldIsRequired");
  const positiveErrorMessage = t("formFields.benefit.penaltiesError.positive");

  return z
    .discriminatedUnion("benefitKind", [
      passSchema,
      appointmentPassSchema,
      universalPassSchema,
    ])
    .superRefine((data, ctx) => {
      const { benefitKind, payment_pack_details, shared_details } = data;

      // Credits are required everywhere except for an unlimited pass.
      const isUnlimitedPass =
        benefitKind === BENEFIT_KIND.PASS &&
        !!payment_pack_details?.hasUnlimitedCredits;

      if (!isUnlimitedPass && shared_details.credits == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["shared_details", "credits"],
          message: requiredErrorMessage,
        });
      }

      // Penalties are bypassed entirely unless the pass is unlimited AND
      // penalties are applied. Within that, each block is validated only when
      // its own toggle is active.
      if (
        !payment_pack_details?.hasUnlimitedCredits ||
        !payment_pack_details.applyPenalties
      ) {
        return;
      }

      const requirePositiveWhenActive = (
        active: boolean,
        fields: ReadonlyArray<keyof typeof payment_pack_details>,
      ) => {
        if (!active) {
          return;
        }
        for (const field of fields) {
          const value = payment_pack_details[field];
          if (value == null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["payment_pack_details", field],
              message: requiredErrorMessage,
            });
          } else if (Number(value) <= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["payment_pack_details", field],
              message: positiveErrorMessage,
            });
          }
        }
      };

      requirePositiveWhenActive(
        payment_pack_details.penalty_active,
        LATE_CANCELLATION_FIELDS,
      );
      requirePositiveWhenActive(
        payment_pack_details.no_show_penalty_active,
        NO_SHOW_FIELDS,
      );
    });
}
