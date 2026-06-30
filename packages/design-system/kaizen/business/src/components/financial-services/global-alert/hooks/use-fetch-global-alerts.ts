import { useMemo, useState } from "react";

import { STRIPE_ACCOUNT_ACTION } from "@bsport/api-financial-services/stripe-account";
import {
  SUBSCRIPTION_PAYMENT_ACTION,
  SUBSCRIPTION_PAYMENT_BLOCKING,
} from "@bsport/api-financial-services/subscription-payment-status";
import { ADP_MODAL_KIND } from "@bsport/api-member-experience/adp-modal";
import type { Fetch } from "@bsport/fetch";

import type { GlobalAlertProps } from "#src/components/financial-services/global-alert/global-alert";
import type {
  GlobalAlertEntry,
  GlobalAlertKind,
} from "#src/components/financial-services/global-alert/types";

import { useFetchAdpModalVisibility } from "./use-fetch-adp-modal-visibility";
import { useFetchCustomerEntity } from "./use-fetch-customer-entity";
import { useFetchStripeAccount } from "./use-fetch-stripe-account";
import { useFetchSubscriptionPaymentStatus } from "./use-fetch-subscription-payment-status";

export type UseFetchGlobalAlertsParams = {
  fetch: Fetch;
  adpAppIdentifier: string;
  onNavigate: (url: string) => void;
  openIntercom?: () => void;
  openAppleAgreements?: () => void;
};

export type UseFetchGlobalAlertsResult = {
  globalAlertProps: GlobalAlertProps;
  isLoading: boolean;
  isError: boolean;
};

/** Orchestrates subscription, Stripe, customer-entity, and ADP queries into `globalAlertProps`; blocking alerts override `isDismissed` and keep the banner open. */
export const useFetchGlobalAlerts = ({
  fetch,
  adpAppIdentifier,
  onNavigate,
  openIntercom,
  openAppleAgreements,
}: UseFetchGlobalAlertsParams): UseFetchGlobalAlertsResult => {
  const [isDismissed, setIsDismissed] = useState(false);

  const subscriptionStatus = useFetchSubscriptionPaymentStatus(fetch);
  const stripeAccount = useFetchStripeAccount(fetch);
  const customerEntity = useFetchCustomerEntity(fetch);
  const adpModal = useFetchAdpModalVisibility({
    fetch,
    appIdentifier: adpAppIdentifier,
  });

  const isAnyLoading =
    subscriptionStatus.isLoading ||
    stripeAccount.isLoading ||
    customerEntity.isLoading ||
    adpModal.isLoading;

  const alerts = useMemo(() => {
    const result: Partial<Record<GlobalAlertKind, GlobalAlertEntry>> = {};

    if (subscriptionStatus.data) {
      const { action, blocking, failed, disputed } = subscriptionStatus.data;

      if (action === SUBSCRIPTION_PAYMENT_ACTION.WARN) {
        if (failed.length > 0) {
          result["unpaid-invoice"] = { severity: "warning" };
        }
        if (disputed.length > 0) {
          result["disputed-invoice"] = { severity: "warning" };
        }
      } else if (action === SUBSCRIPTION_PAYMENT_ACTION.BLOCK_BACKOFFICE) {
        if (blocking === SUBSCRIPTION_PAYMENT_BLOCKING.FAILED_PAYMENT) {
          result["unpaid-invoice"] = { severity: "blocking" };
        } else if (
          blocking === SUBSCRIPTION_PAYMENT_BLOCKING.DISPUTED_PAYMENT
        ) {
          result["disputed-invoice"] = { severity: "blocking" };
        }
      }
    }

    if (stripeAccount.data) {
      const { action, date_account_blocked } = stripeAccount.data;

      if (action === STRIPE_ACCOUNT_ACTION.WARN) {
        result["stripe-not-configured"] = {
          severity: "warning",
          dueDate: date_account_blocked ?? undefined,
        };
      } else if (action === STRIPE_ACCOUNT_ACTION.BLOCK_BACKOFFICE) {
        result["stripe-not-configured"] = { severity: "blocking" };
      }
    }

    if (
      customerEntity.data?.is_vat_id_collection_required &&
      customerEntity.data?.is_valid_vat_id_missing
    ) {
      result["missing-vat-number"] = { severity: "blocking" };
    }

    if (adpModal.data) {
      const { adp_modal_visibility, adp_modal_kind } = adpModal.data;
      const kind =
        adp_modal_kind === ADP_MODAL_KIND.PENDING_AGREEMENTS
          ? "apple-developer-pending-agreements"
          : "apple-developer-program-enrollment";

      if (adp_modal_visibility === "show-recommend") {
        result[kind] = { severity: "warning" };
      } else if (adp_modal_visibility === "block-user") {
        result[kind] = { severity: "blocking" };
      }
    }

    return result;
  }, [
    subscriptionStatus.data,
    stripeAccount.data,
    customerEntity.data,
    adpModal.data,
  ]);

  const hasBlockingAlert = Object.values(alerts).some(
    (a) => a?.severity === "blocking",
  );

  return {
    globalAlertProps: {
      open: hasBlockingAlert || (!isDismissed && !isAnyLoading),
      alerts,
      onDismiss: () => {
        setIsDismissed(true);
      },
      onNavigate,
      openIntercom,
      openAppleAgreements,
    },
    isLoading: isAnyLoading,
    isError:
      subscriptionStatus.isError ||
      stripeAccount.isError ||
      customerEntity.isError ||
      adpModal.isError,
  };
};
