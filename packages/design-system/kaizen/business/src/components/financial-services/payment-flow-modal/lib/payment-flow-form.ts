import { z } from "zod";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { type DateTime, getLocalNow } from "@bsport/datetime-manipulation";
import type { SelectedDate } from "@bsport/kaizen-primitive-core";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import {
  DEFAULT_MANUAL_PAYMENT_METHOD,
  type ManualMethodType,
} from "#src/components/financial-services/payment-flow-modal/components/payment-methods/manual/types";
import { i18nInstance, i18nNamespacePrefix } from "#src/i18n";

export const PAYMENT_TAB = {
  ONE_TIME: "one-time",
  INSTALLMENTS: "installments",
} as const;

export type PaymentTab = (typeof PAYMENT_TAB)[keyof typeof PAYMENT_TAB];

export const isPaymentTab = (value: string): value is PaymentTab =>
  value === PAYMENT_TAB.ONE_TIME || value === PAYMENT_TAB.INSTALLMENTS;

export const INVOICE_ALREADY_PAID_ALERT = "This invoice is already paid.";

const manualMethodTypeSchema = z.enum([
  "card_manual_machine",
  "cash",
  "check",
  "vacation_check",
  "transfer",
  "american_express",
  "other",
  "client_credit_balance",
]);

const selectedDateSchema = z.custom<SelectedDate>();

const FINANCIAL_SERVICES_NS = `${i18nNamespacePrefix}_financial-services`;

const installmentI18nKeys = (
  key: string,
  values?: Record<string, number | string>,
) => i18nInstance.t(key, { ns: FINANCIAL_SERVICES_NS, ...values });

export const installmentIntervalSchema = z.enum([
  "day",
  "week",
  "month",
  "year",
]);

export type InstallmentIntervalId = z.infer<typeof installmentIntervalSchema>;

export const INSTALLMENT_INTERVAL_IDS: readonly InstallmentIntervalId[] =
  installmentIntervalSchema.options;
export const DEFAULT_INSTALLMENT_RECURRENCE_BASIS = 1;
export const DEFAULT_INSTALLMENT_NB_INTERVAL = 12;

export const paymentFlowFormSchema = z.object({
  savePaymentMethod: z.boolean(),
  terminalReaderId: z.string().nullable(),
  selectedGiftCardId: z.number().nullable(),
  partialAmountCts: z.number().int().nonnegative(),
  manualType: manualMethodTypeSchema,
  manualDate: selectedDateSchema,
  manualNote: z.string(),
  installmentInterval: installmentIntervalSchema,
  installmentRecurrenceBasis: z.coerce
    .number()
    .int()
    .superRefine((val, ctx) => {
      if (val < DEFAULT_INSTALLMENT_RECURRENCE_BASIS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: installmentI18nKeys(
            "paymentFlowModal.installments.errors.recurrenceBasis",
          ),
        });
      }
    }),
  installmentNbInterval: z.coerce
    .number()
    .int()
    .superRefine((val, ctx) => {
      if (val < DEFAULT_INSTALLMENT_RECURRENCE_BASIS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: installmentI18nKeys(
            "paymentFlowModal.installments.errors.nbIntervalMin",
          ),
        });
      } else if (val > 90) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: installmentI18nKeys(
            "paymentFlowModal.installments.errors.nbIntervalMax",
          ),
        });
      }
    }),
  installmentAnchorDate: selectedDateSchema,
});

export type PaymentFlowFormValues = z.infer<typeof paymentFlowFormSchema> & {
  manualType: ManualMethodType;
};

export const installmentScheduleDetailSchema = paymentFlowFormSchema.pick({
  installmentInterval: true,
  installmentRecurrenceBasis: true,
  installmentNbInterval: true,
});

export type InstallmentScheduleDetailValues = z.infer<
  typeof installmentScheduleDetailSchema
>;

export const getInstallmentSingleAnchorDate = (
  value: SelectedDate,
): DateTime | null => {
  if (value == null || Array.isArray(value)) return null;
  return value;
};

export type InstallmentFullCycleRow = {
  installmentNumber: number;
  dateLabel: string;
  amountLabel: string;
};

/**
 * Builds each installment billing date and amount (cents split with remainder on last),
 */
export const buildInstallmentFullCycleRows = (
  schedule: InstallmentScheduleDetailValues,
  anchor: DateTime | null,
  invoiceTotalAmountCts: number,
  displayLocale = "en",
): InstallmentFullCycleRow[] | undefined => {
  if (anchor == null) return undefined;
  if (!Number.isFinite(invoiceTotalAmountCts) || invoiceTotalAmountCts <= 0) {
    return undefined;
  }

  const nb = schedule.installmentNbInterval;
  if (!Number.isFinite(nb) || nb < 1) return undefined;

  const step = schedule.installmentRecurrenceBasis;
  const interval = schedule.installmentInterval;
  const baseCts = Math.floor(invoiceTotalAmountCts / nb);
  const remainderCts = invoiceTotalAmountCts - baseCts * nb;

  const rows: InstallmentFullCycleRow[] = [];

  for (let i = 0; i < nb; i++) {
    const offset = i * step;
    let when = anchor;
    switch (interval) {
      case "day":
        when = anchor.plus({ days: offset });
        break;
      case "week":
        when = anchor.plus({ weeks: offset });
        break;
      case "month":
        when = anchor.plus({ months: offset });
        break;
      case "year":
        when = anchor.plus({ years: offset });
        break;
    }

    const amountCts = baseCts + (i === nb - 1 ? remainderCts : 0);

    rows.push({
      installmentNumber: i + 1,
      dateLabel: when.setLocale(displayLocale).toFormat("d MMM yyyy"),
      amountLabel: getCurrencyDisplayWithPrice(amountCts / 100),
    });
  }

  return rows;
};

const scheduleIntervalUnit = (
  interval: InstallmentIntervalId,
  count: number,
): string => {
  switch (interval) {
    case "day":
      return installmentI18nKeys(
        "paymentFlowModal.installments.scheduleIntervalDay",
        { count },
      );
    case "week":
      return installmentI18nKeys(
        "paymentFlowModal.installments.scheduleIntervalWeek",
        { count },
      );
    case "month":
      return installmentI18nKeys(
        "paymentFlowModal.installments.scheduleIntervalMonth",
        {
          count,
        },
      );
    case "year":
      return installmentI18nKeys(
        "paymentFlowModal.installments.scheduleIntervalYear",
        { count },
      );
  }
};

/** Full installment schedule explainer sentence (installments tab, under total). */
export const buildInstallmentScheduleExplainerText = (
  values: InstallmentScheduleDetailValues,
): string => {
  const recurrenceBasis = values.installmentRecurrenceBasis;
  const nbInterval = values.installmentNbInterval;
  const interval = values.installmentInterval;
  const totalIntervalDuration = nbInterval * recurrenceBasis;

  const recurrenceSpan = `${recurrenceBasis} ${scheduleIntervalUnit(interval, recurrenceBasis)}`;
  const totalSpan = `${totalIntervalDuration} ${scheduleIntervalUnit(interval, totalIntervalDuration)} ${installmentI18nKeys(
    "paymentFlowModal.installments.scheduleBillingWord",
    { count: totalIntervalDuration },
  )}`;

  return installmentI18nKeys(
    "paymentFlowModal.installments.scheduleExplainer",
    {
      recurrenceSpan,
      totalSpan,
      invoiceCount: nbInterval,
    },
  );
};

/** Caption under the total on the installments tab (amount per billing period). */
export const buildInstallmentPerIntervalCaptionText = (
  invoiceTotalAmount: number,
  values: InstallmentScheduleDetailValues,
): string | undefined => {
  if (!Number.isFinite(invoiceTotalAmount) || invoiceTotalAmount <= 0) {
    return undefined;
  }

  const nbInterval = values.installmentNbInterval;
  if (!Number.isFinite(nbInterval) || nbInterval < 1) {
    return undefined;
  }

  const recurrenceBasis = values.installmentRecurrenceBasis;
  const interval = values.installmentInterval;
  const perInstallmentAmount = invoiceTotalAmount / nbInterval;
  const recurrenceSpan = `${recurrenceBasis} ${scheduleIntervalUnit(interval, recurrenceBasis)}`;

  return installmentI18nKeys(
    "paymentFlowModal.installments.perIntervalCaption",
    {
      amount: getCurrencyDisplayWithPrice(perInstallmentAmount),
      recurrenceSpan,
    },
  );
};

export const getPaymentFlowDefaultValues = (): PaymentFlowFormValues => ({
  savePaymentMethod: false,
  terminalReaderId: null,
  selectedGiftCardId: null,
  partialAmountCts: 0,
  manualType: DEFAULT_MANUAL_PAYMENT_METHOD,
  manualDate: getLocalNow({ zone: getCompanyTimezone() }),
  manualNote: "",
  installmentInterval: "month",
  installmentRecurrenceBasis: DEFAULT_INSTALLMENT_RECURRENCE_BASIS,
  installmentNbInterval: DEFAULT_INSTALLMENT_NB_INTERVAL,
  installmentAnchorDate: getLocalNow({ zone: getCompanyTimezone() }),
});
