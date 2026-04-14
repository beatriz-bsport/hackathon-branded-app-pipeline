import { z } from "zod";

import { BILLING_INTERVALS } from "@bsport/api-buyables/contract";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "./constants";
import type { ContractFormSchema } from "./types";

const INTERVALS = [
  BILLING_INTERVALS.DAY,
  BILLING_INTERVALS.WEEK,
  BILLING_INTERVALS.MONTH,
  BILLING_INTERVALS.YEAR,
] as const;

export const useContractNameSchema = () => {
  const { t } = useTranslation("contract-details");

  return z.object({
    // Identity section
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
 * Returns the adequate Zod schema based on the type of the Contract.
 * Instead of handling multiple signatures of forms and functions for the 2 versions,
 * this feature manages a single form state but with conditional constraints.
 */
export function useContractFormSchema({
  isRevampedContract,
}: {
  isRevampedContract: boolean;
}): ContractFormSchema {
  const { t } = useTranslation("contract-details");

  const requiredErrorMessage = t("formFields.errors.fieldIsRequired");
  const nullableNumber = z
    .number()
    .nullable()
    .transform(() => null);

  const nameSchema = useContractNameSchema();

  // Schema for both type of contracts
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

    // Case 2: hasCustomInterval = true → min_price & max_price are required
    z.object({
      hasCustomInterval: z.literal(true),
      month_billing_day: nullableNumber,
      recurrence_basis: z
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
      // Case 1: has_mandatory_commitment_period = false → unit and value not required
      z.object({
        has_mandatory_commitment_period: z.literal(false),
        commitment_period_unit: z.enum(INTERVALS).nullable(),
        commitment_period_value: nullableNumber,
      }),

      // Case 2: has_mandatory_commitment_period = true → unit and value required
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

  const baseSchema = z
    .object({
      manager_only: z.boolean(),

      description: z
        .string()
        .min(FIELD_CONSTRAINTS.TEXTFIELD_LENGTH_MIN, requiredErrorMessage),

      recurrent_price: z
        .number({ required_error: requiredErrorMessage })
        .min(FIELD_CONSTRAINTS.PRICE_MIN),

      flat_fee: z
        .number({ required_error: requiredErrorMessage })
        .min(FIELD_CONSTRAINTS.PRICE_MIN),

      interval: z.enum(INTERVALS),

      auto_renewal: z.boolean(),
      nb_interval_after_auto_renewal: z.number().nullable(),

      contract: z
        .string()
        .min(FIELD_CONSTRAINTS.TEXTFIELD_LENGTH_MIN, requiredErrorMessage)
        .max(FIELD_CONSTRAINTS.TERMS_LENGTH_MAX), // e.g. terms
    })
    .and(nameSchema)
    .and(commitmentPeriodSchema)
    .and(billingCycleSchema);

  // ----- Revamped config -----
  const revampSubschema = z.object({
    // Revamp fields -> defined
    payment_pack_details: z
      .object({
        bookkeeping_account_id: z.number().nullable(),
        tax: z
          .number()
          .min(FIELD_CONSTRAINTS.TAX_RATE_MIN)
          .max(FIELD_CONSTRAINTS.TAX_RATE_MAX),
      })
      .nullable(),

    // Legacy fields -> nullished
    payment_pack: nullableNumber,
  });

  const revampSchema = baseSchema.and(revampSubschema);

  // ----- Legacy config -----
  const legacySubschema = z.object({
    // Revamp fields -> nullished
    payment_pack_details: z.null(),

    // Legacy fields -> defined
    payment_pack: z.number().nullable(),
  });

  const legacySchema = baseSchema.and(legacySubschema);

  return isRevampedContract ? revampSchema : legacySchema;
}
