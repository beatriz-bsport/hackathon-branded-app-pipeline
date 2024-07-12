import { Dispatch, SetStateAction } from 'react';
import { DateTime } from 'luxon';
import type {
  SubscriptionPause,
  ContractTemplate,
  ContractTemplateFormValues,
  ContractTemplatePayload,
} from './types';
import {
  PassType,
  SubscriptionInvoicingType,
} from '#src/libs/subscription/enums';

export function isPaused(pausesArray?: Array<SubscriptionPause>) {
  if (!pausesArray?.length) return false;
  return pausesArray.reduce(
    (acc, p) =>
      acc ||
      (DateTime.now() >= DateTime.fromISO(p.from_date).startOf('day') &&
        DateTime.now() <= DateTime.fromISO(p.until_date).endOf('day')),
    false,
  );
}

export const computeProrataPriceForSubscription = (
  first_BillingDate: string,
  monthBillingDay: number,
  recurrentPrice: string,
): string => {
  const reccurentPriceFloat = parseFloat(recurrentPrice);
  const firstBillingDate = first_BillingDate
    ? DateTime.fromISO(first_BillingDate)
    : DateTime.now();
  const secondBillingDate = getNextBillingDate(
    firstBillingDate,
    monthBillingDay,
  );
  const daysLeft = Math.abs(
    parseInt(
      firstBillingDate.diff(secondBillingDate, 'days').as('days').toString(),
    ),
  );

  if (daysLeft === 0) {
    return reccurentPriceFloat.toFixed(2);
  }

  const pricePerDay = reccurentPriceFloat / firstBillingDate.daysInMonth;
  return (pricePerDay * daysLeft).toFixed(2);
};

function getNextBillingDate(
  currentDate: DateTime,
  monthBillingDay: number,
): DateTime {
  // Determine the effective billing day to avoid exceeding the max day of the month (28/29/30/31).
  const effectiveBillingDay = Math.min(
    monthBillingDay,
    currentDate.daysInMonth,
  );

  if (currentDate.day === effectiveBillingDay) {
    return currentDate;
  }

  // Clone the currentDate to avoid updating the original currentDate as it is passed by reference.
  let nextBillingDate = currentDate.set({ day: effectiveBillingDay });
  if (nextBillingDate.startOf('day') <= currentDate.startOf('day')) {
    nextBillingDate = nextBillingDate.plus({ months: 1 });
    nextBillingDate = nextBillingDate.set({
      day: Math.min(effectiveBillingDay, nextBillingDate.daysInMonth),
    });
  }
  return nextBillingDate;
}

export const initializeContractTemplateFormValues = (
  contractTemplate: ContractTemplate | null,
  setDrawerInitialValues: Dispatch<SetStateAction<ContractTemplateFormValues>>,
) => {
  if (!contractTemplate) return;

  const initialValues = {
    id: contractTemplate.id,
    name: contractTemplate.name,
    description: contractTemplate.description,
    productType: contractTemplate.private_pass_template
      ? PassType.APPOINTMENT_PASSES
      : PassType.PASSES,
    privatePassTemplate: contractTemplate.private_pass_template,
    paymentPackTemplate: contractTemplate.payment_pack_template,
    contract: contractTemplate.contract,
    recurrentPrice: contractTemplate.recurrent_price,
    recurrenceBasis: contractTemplate.recurrence_basis,
    flatFee: contractTemplate.flat_fee,
    invoicingType: contractTemplate.month_billing_day
      ? SubscriptionInvoicingType.FIXED_DAY
      : SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION,
    interval: contractTemplate.interval,
    numberOfIntervals: contractTemplate.nb_interval,
    monthBillingDay: contractTemplate.month_billing_day,
    managerOnly: contractTemplate.manager_only,
    autoRenewal: contractTemplate.auto_renewal,
    unusableByStaff: !contractTemplate.is_usable_by_staff,
  };

  setDrawerInitialValues(initialValues);
};

export const mapContractTemplateFormValuesToApi = (
  contractTemplate: ContractTemplateFormValues,
): ContractTemplatePayload => {
  return {
    id: contractTemplate.id,
    name: contractTemplate.name,
    description: contractTemplate.description,
    private_pass_template: contractTemplate.privatePassTemplate,
    payment_pack_template: contractTemplate.paymentPackTemplate,
    contract: contractTemplate.contract,
    recurrent_price: contractTemplate.recurrentPrice,
    recurrence_basis: contractTemplate.recurrenceBasis,
    flat_fee: contractTemplate.flatFee,
    month_billing_day:
      contractTemplate.invoicingType === SubscriptionInvoicingType.FIXED_DAY
        ? contractTemplate.monthBillingDay
        : null,
    interval: contractTemplate.interval,
    nb_interval: contractTemplate.numberOfIntervals,
    manager_only: contractTemplate.managerOnly,
    auto_renewal: contractTemplate.autoRenewal,
    is_usable_by_staff: !contractTemplate.unusableByStaff,
  };
};
