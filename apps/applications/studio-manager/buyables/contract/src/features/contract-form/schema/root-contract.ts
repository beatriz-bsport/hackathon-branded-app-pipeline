import { z } from "zod";

import { BILLING_INTERVALS } from "@bsport/api-buyables/contract";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";

const INTERVALS = [
  BILLING_INTERVALS.DAY,
  BILLING_INTERVALS.WEEK,
  BILLING_INTERVALS.MONTH,
  BILLING_INTERVALS.YEAR,
] as const;

export const useContractNameSchema = () => {
  const { t } = useTranslation("contract-details");

  return z.object({
    name: z
      .string()
      .min(
        FIELD_CONSTRAINTS.TEXTFIELD_LENGTH_MIN,
        t("formFields.errors.fieldIsRequired"),
      )
      .max(
        FIELD_CONSTRAINTS.NAME_LENGTH_MAX,
        t("formFields.name.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.NAME_LENGTH_MAX,
        }),
      ),
  });
};

/**
 * Schema for the contract-only fields (identity, price, billing cycle, terms,
 * commitment period, visibility). The benefit configuration is validated
 * separately, see `./benefits`.
 */
export function useRootContractSchema() {
  const { t } = useTranslation("contract-details");

  const requiredErrorMessage = t("formFields.errors.fieldIsRequired");
  const nullableNumber = z
    .number()
    .nullable()
    .transform(() => null);

  const nameSchema = useContractNameSchema();

  const billingCycleSchema = z.discriminatedUnion("hasCustomInterval", [
    // Case 1: hasCustomInterval = false → month_billing_day required
    z.object({
      hasCustomInterval: z.literal(false),
      month_billing_day: z
        .number()
        .int()
        .min(FIELD_CONSTRAINTS.MONTH_DAY_MIN)
        .max(FIELD_CONSTRAINTS.MONTH_DAY_MAX),
      recurrence_basis: z.number(),
      nb_interval: z
        .number()
        .int()
        .min(FIELD_CONSTRAINTS.NB_FIXED_INTERVAL_MIN)
        .max(FIELD_CONSTRAINTS.NB_FIXED_INTERVAL_MAX),
    }),

    // Case 2: hasCustomInterval = true → custom recurrence
    z.object({
      hasCustomInterval: z.literal(true),
      month_billing_day: nullableNumber,
      recurrence_basis: z.coerce
        .number()
        .int()
        .min(FIELD_CONSTRAINTS.RECURRENCE_BASIS_MIN),
      nb_interval: z
        .number()
        .int()
        .min(FIELD_CONSTRAINTS.NB_CUSTOM_INTERVAL_MIN),
    }),
  ]);

  const commitmentPeriodSchema = z.discriminatedUnion(
    "has_mandatory_commitment_period",
    [
      // Case 1: not mandatory → unit and value not required
      z.object({
        has_mandatory_commitment_period: z.literal(false),
        commitment_period_unit: z.enum(INTERVALS).nullable(),
        commitment_period_value: nullableNumber,
      }),

      // Case 2: mandatory → unit and value required
      z.object({
        has_mandatory_commitment_period: z.literal(true),
        commitment_period_unit: z.enum(INTERVALS),
        commitment_period_value: z
          .number()
          .int()
          .min(FIELD_CONSTRAINTS.COMMITMENT_VALUE_MIN, requiredErrorMessage)
          .max(FIELD_CONSTRAINTS.COMMITMENT_VALUE_MAX),
      }),
    ],
  );

  return z
    .object({
      description: z
        .string()
        .min(FIELD_CONSTRAINTS.TEXTFIELD_LENGTH_MIN, requiredErrorMessage),

      recurrent_price: z.coerce
        .number({ required_error: requiredErrorMessage })
        .min(FIELD_CONSTRAINTS.PRICE_MIN),

      flat_fee: z.coerce
        .number({ required_error: requiredErrorMessage })
        .min(FIELD_CONSTRAINTS.PRICE_MIN),

      interval: z.enum(INTERVALS),

      auto_renewal: z.boolean(),
      nb_interval_after_auto_renewal: z.number().nullable(),

      contract: z
        .string()
        .min(FIELD_CONSTRAINTS.TEXTFIELD_LENGTH_MIN, requiredErrorMessage),

      manager_only: z.boolean(),
      highlighted_as_recommended: z.boolean(),
      is_usable_by_staff: z.boolean(),

      tags_on_first_billing: z.array(z.number()),

      tax: z.coerce
        .number()
        .min(FIELD_CONSTRAINTS.TAX_RATE_MIN)
        .max(FIELD_CONSTRAINTS.TAX_RATE_MAX),
      bookkeeping_account_id: z.number().nullable(),
    })
    .and(nameSchema)
    .and(commitmentPeriodSchema)
    .and(billingCycleSchema);
}
