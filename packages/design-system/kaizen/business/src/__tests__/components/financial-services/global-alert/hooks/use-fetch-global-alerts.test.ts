import type {
  QueryObserverLoadingErrorResult,
  QueryObserverLoadingResult,
  QueryObserverPendingResult,
  QueryObserverSuccessResult,
} from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CustomerEntity } from "@bsport/api-financial-services/customer-entity";
import { STRIPE_ACCOUNT_ACTION } from "@bsport/api-financial-services/stripe-account";
import type { StripeAccountStatus } from "@bsport/api-financial-services/stripe-account";
import {
  SUBSCRIPTION_PAYMENT_ACTION,
  SUBSCRIPTION_PAYMENT_BLOCKING,
} from "@bsport/api-financial-services/subscription-payment-status";
import type { SubscriptionPaymentStatus } from "@bsport/api-financial-services/subscription-payment-status";
import type { AdpModalVisibilityConfiguration } from "@bsport/api-member-experience/adp-modal";

import { useFetchAdpModalVisibility } from "#src/components/financial-services/global-alert/hooks/use-fetch-adp-modal-visibility";
import { useFetchCustomerEntity } from "#src/components/financial-services/global-alert/hooks/use-fetch-customer-entity";
import { useFetchGlobalAlerts } from "#src/components/financial-services/global-alert/hooks/use-fetch-global-alerts";
import { useFetchStripeAccount } from "#src/components/financial-services/global-alert/hooks/use-fetch-stripe-account";
import { useFetchSubscriptionPaymentStatus } from "#src/components/financial-services/global-alert/hooks/use-fetch-subscription-payment-status";

vi.mock(
  "#src/components/financial-services/global-alert/hooks/use-fetch-subscription-payment-status",
  () => ({ useFetchSubscriptionPaymentStatus: vi.fn() }),
);
vi.mock(
  "#src/components/financial-services/global-alert/hooks/use-fetch-stripe-account",
  () => ({ useFetchStripeAccount: vi.fn() }),
);
vi.mock(
  "#src/components/financial-services/global-alert/hooks/use-fetch-customer-entity",
  () => ({ useFetchCustomerEntity: vi.fn() }),
);
vi.mock(
  "#src/components/financial-services/global-alert/hooks/use-fetch-adp-modal-visibility",
  () => ({ useFetchAdpModalVisibility: vi.fn() }),
);
// ── Typed query-state factories ──────────────────────────────────────────────

const baseFields = {
  dataUpdatedAt: 0,
  errorUpdatedAt: 0,
  failureCount: 0,
  errorUpdateCount: 0,
  isFetched: false,
  isFetchedAfterMount: false,
  isFetching: false,
  isPaused: false,
  isRefetching: false,
  isStale: false,
  isEnabled: true,
  isInitialLoading: false,
  refetch: vi.fn(),
} as const;

function pendingResult<T>(): QueryObserverPendingResult<T> {
  return {
    ...baseFields,
    data: undefined,
    error: null,
    failureReason: null,
    isError: false,
    isPending: true,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: false,
    isPlaceholderData: false,
    status: "pending",
    fetchStatus: "idle",
    promise: new Promise<T>(() => {}),
  };
}

function loadingResult<T>(): QueryObserverLoadingResult<T> {
  return {
    ...baseFields,
    data: undefined,
    error: null,
    failureReason: null,
    isError: false,
    isPending: true,
    isLoading: true,
    isInitialLoading: true,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: false,
    isPlaceholderData: false,
    status: "pending",
    fetchStatus: "fetching",
    isFetching: true,
    promise: new Promise<T>(() => {}),
  };
}

function errorResult<T>(): QueryObserverLoadingErrorResult<T> {
  const error = new Error("Test error");
  return {
    ...baseFields,
    data: undefined,
    error,
    failureReason: error,
    failureCount: 1,
    errorUpdateCount: 1,
    isError: true,
    isPending: false,
    isLoading: false,
    isLoadingError: true,
    isRefetchError: false,
    isSuccess: false,
    isPlaceholderData: false,
    status: "error",
    fetchStatus: "idle",
    promise: new Promise<T>(() => {}),
  };
}

function successResult<T>(data: T): QueryObserverSuccessResult<T> {
  return {
    ...baseFields,
    data,
    error: null,
    failureReason: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    isPlaceholderData: false,
    isFetched: true,
    isFetchedAfterMount: true,
    status: "success",
    fetchStatus: "idle",
    dataUpdatedAt: Date.now(),
    promise: Promise.resolve(data),
  };
}

// ── Test setup ───────────────────────────────────────────────────────────────

const mockSubscription = vi.mocked(useFetchSubscriptionPaymentStatus);
const mockStripe = vi.mocked(useFetchStripeAccount);
const mockCustomerEntity = vi.mocked(useFetchCustomerEntity);
const mockAdp = vi.mocked(useFetchAdpModalVisibility);

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockSubscription.mockReturnValue(pendingResult<SubscriptionPaymentStatus>());
  mockStripe.mockReturnValue(pendingResult<StripeAccountStatus>());
  mockCustomerEntity.mockReturnValue(pendingResult<CustomerEntity>());
  mockAdp.mockReturnValue(pendingResult<AdpModalVisibilityConfiguration>());
});

const mockOnNavigate = vi.fn();

const renderAlerts = (adpAppIdentifier = "app-id") =>
  renderHook(() =>
    useFetchGlobalAlerts({
      fetch: mockFetch,
      adpAppIdentifier,
      onNavigate: mockOnNavigate,
    }),
  ).result.current;

// ── Tests ────────────────────────────────────────────────────────────────────

describe("useFetchGlobalAlerts", () => {
  it("returns empty alerts when no data", () => {
    const { globalAlertProps } = renderAlerts();
    expect(globalAlertProps.alerts).toEqual({});
  });

  describe("subscription payment status", () => {
    it("returns unpaid-invoice warning when WARN + failed invoices", () => {
      mockSubscription.mockReturnValue(
        successResult<SubscriptionPaymentStatus>({
          action: SUBSCRIPTION_PAYMENT_ACTION.WARN,
          blocking: 0,
          failed: [{ payment_backend_id: 1, date: "2024-01-01" }],
          disputed: [],
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["unpaid-invoice"]).toEqual({
        severity: "warning",
      });
      expect(globalAlertProps.alerts["disputed-invoice"]).toBeUndefined();
    });

    it("returns disputed-invoice warning when WARN + disputed invoices", () => {
      mockSubscription.mockReturnValue(
        successResult<SubscriptionPaymentStatus>({
          action: SUBSCRIPTION_PAYMENT_ACTION.WARN,
          blocking: 0,
          failed: [],
          disputed: [{ date: "2024-01-01" }],
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["disputed-invoice"]).toEqual({
        severity: "warning",
      });
      expect(globalAlertProps.alerts["unpaid-invoice"]).toBeUndefined();
    });

    it("returns both invoice warnings when WARN + both failed and disputed", () => {
      mockSubscription.mockReturnValue(
        successResult<SubscriptionPaymentStatus>({
          action: SUBSCRIPTION_PAYMENT_ACTION.WARN,
          blocking: 0,
          failed: [{ payment_backend_id: 1, date: "2024-01-01" }],
          disputed: [{ date: "2024-01-01" }],
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["unpaid-invoice"]).toEqual({
        severity: "warning",
      });
      expect(globalAlertProps.alerts["disputed-invoice"]).toEqual({
        severity: "warning",
      });
    });

    it("returns unpaid-invoice blocking when BLOCK_BACKOFFICE + FAILED_PAYMENT", () => {
      mockSubscription.mockReturnValue(
        successResult<SubscriptionPaymentStatus>({
          action: SUBSCRIPTION_PAYMENT_ACTION.BLOCK_BACKOFFICE,
          blocking: SUBSCRIPTION_PAYMENT_BLOCKING.FAILED_PAYMENT,
          failed: [{ payment_backend_id: 1, date: "2024-01-01" }],
          disputed: [],
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["unpaid-invoice"]).toEqual({
        severity: "blocking",
      });
      expect(globalAlertProps.alerts["disputed-invoice"]).toBeUndefined();
    });

    it("returns disputed-invoice blocking when BLOCK_BACKOFFICE + DISPUTED_PAYMENT", () => {
      mockSubscription.mockReturnValue(
        successResult<SubscriptionPaymentStatus>({
          action: SUBSCRIPTION_PAYMENT_ACTION.BLOCK_BACKOFFICE,
          blocking: SUBSCRIPTION_PAYMENT_BLOCKING.DISPUTED_PAYMENT,
          failed: [],
          disputed: [{ date: "2024-01-01" }],
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["disputed-invoice"]).toEqual({
        severity: "blocking",
      });
      expect(globalAlertProps.alerts["unpaid-invoice"]).toBeUndefined();
    });

    it("returns no invoice alert when DO_NOTHING", () => {
      mockSubscription.mockReturnValue(
        successResult<SubscriptionPaymentStatus>({
          action: SUBSCRIPTION_PAYMENT_ACTION.DO_NOTHING,
          blocking: 0,
          failed: [],
          disputed: [],
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["unpaid-invoice"]).toBeUndefined();
      expect(globalAlertProps.alerts["disputed-invoice"]).toBeUndefined();
    });
  });

  describe("stripe account", () => {
    it("returns stripe-not-configured warning without dueDate when WARN + no blocked date", () => {
      mockStripe.mockReturnValue(
        successResult<StripeAccountStatus>({
          action: STRIPE_ACCOUNT_ACTION.WARN,
          reason: "",
          date_account_blocked: null,
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["stripe-not-configured"]).toEqual({
        severity: "warning",
        dueDate: undefined,
      });
    });

    it("returns stripe-not-configured warning with dueDate when WARN + blocked date", () => {
      const dateStr = "2025-06-01";
      mockStripe.mockReturnValue(
        successResult<StripeAccountStatus>({
          action: STRIPE_ACCOUNT_ACTION.WARN,
          reason: "",
          date_account_blocked: dateStr,
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["stripe-not-configured"]).toEqual({
        severity: "warning",
        dueDate: dateStr,
      });
    });

    it("returns stripe-not-configured blocking when BLOCK_BACKOFFICE", () => {
      mockStripe.mockReturnValue(
        successResult<StripeAccountStatus>({
          action: STRIPE_ACCOUNT_ACTION.BLOCK_BACKOFFICE,
          reason: "",
          date_account_blocked: null,
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["stripe-not-configured"]).toEqual({
        severity: "blocking",
      });
    });

    it("returns no stripe alert when DO_NOTHING", () => {
      mockStripe.mockReturnValue(
        successResult<StripeAccountStatus>({
          action: STRIPE_ACCOUNT_ACTION.DO_NOTHING,
          reason: "",
          date_account_blocked: null,
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["stripe-not-configured"]).toBeUndefined();
    });
  });

  describe("customer entity", () => {
    it("returns missing-vat-number blocking when VAT required and missing", () => {
      mockCustomerEntity.mockReturnValue(
        successResult<CustomerEntity>({
          id: 1,
          is_vat_id_collection_required: true,
          is_valid_vat_id_missing: true,
          vat_id: null,
          vat_id_type: null,
          vat_id_verification_status: "missing",
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["missing-vat-number"]).toEqual({
        severity: "blocking",
      });
    });

    it("returns no VAT alert when required but not missing", () => {
      mockCustomerEntity.mockReturnValue(
        successResult<CustomerEntity>({
          id: 1,
          is_vat_id_collection_required: true,
          is_valid_vat_id_missing: false,
          vat_id: "FR12345678901",
          vat_id_type: "eu_vat",
          vat_id_verification_status: "verified",
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["missing-vat-number"]).toBeUndefined();
    });

    it("returns no VAT alert when collection not required", () => {
      mockCustomerEntity.mockReturnValue(
        successResult<CustomerEntity>({
          id: 1,
          is_vat_id_collection_required: false,
          is_valid_vat_id_missing: false,
          vat_id: null,
          vat_id_type: null,
          vat_id_verification_status: "not_required",
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(globalAlertProps.alerts["missing-vat-number"]).toBeUndefined();
    });
  });

  describe("apple developer program enrollment", () => {
    it("returns warning when show-recommend", () => {
      mockAdp.mockReturnValue(
        successResult<AdpModalVisibilityConfiguration>({
          adp_modal_visibility: "show-recommend",
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(
        globalAlertProps.alerts["apple-developer-program-enrollment"],
      ).toEqual({
        severity: "warning",
      });
    });

    it("returns blocking when block-user", () => {
      mockAdp.mockReturnValue(
        successResult<AdpModalVisibilityConfiguration>({
          adp_modal_visibility: "block-user",
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(
        globalAlertProps.alerts["apple-developer-program-enrollment"],
      ).toEqual({
        severity: "blocking",
      });
    });

    it("returns no alert when hide", () => {
      mockAdp.mockReturnValue(
        successResult<AdpModalVisibilityConfiguration>({
          adp_modal_visibility: "hide",
        }),
      );

      const { globalAlertProps } = renderAlerts();

      expect(
        globalAlertProps.alerts["apple-developer-program-enrollment"],
      ).toBeUndefined();
    });
  });

  describe("isLoading", () => {
    it.each([
      [
        "subscription payment status",
        () =>
          mockSubscription.mockReturnValue(
            loadingResult<SubscriptionPaymentStatus>(),
          ),
      ],
      [
        "stripe account",
        () => mockStripe.mockReturnValue(loadingResult<StripeAccountStatus>()),
      ],
      [
        "customer entity",
        () =>
          mockCustomerEntity.mockReturnValue(loadingResult<CustomerEntity>()),
      ],
      [
        "ADP modal",
        () =>
          mockAdp.mockReturnValue(
            loadingResult<AdpModalVisibilityConfiguration>(),
          ),
      ],
    ])("is true when %s is loading", (_, setup) => {
      setup();
      expect(renderAlerts().isLoading).toBe(true);
    });

    it("is false when none is loading", () => {
      expect(renderAlerts().isLoading).toBe(false);
    });
  });

  describe("isError", () => {
    it.each([
      [
        "subscription payment status",
        () =>
          mockSubscription.mockReturnValue(
            errorResult<SubscriptionPaymentStatus>(),
          ),
      ],
      [
        "stripe account",
        () => mockStripe.mockReturnValue(errorResult<StripeAccountStatus>()),
      ],
      [
        "customer entity",
        () => mockCustomerEntity.mockReturnValue(errorResult<CustomerEntity>()),
      ],
      [
        "ADP modal",
        () =>
          mockAdp.mockReturnValue(
            errorResult<AdpModalVisibilityConfiguration>(),
          ),
      ],
    ])("is true when %s has error", (_, setup) => {
      setup();
      expect(renderAlerts().isError).toBe(true);
    });

    it("is false when none has error", () => {
      expect(renderAlerts().isError).toBe(false);
    });
  });
});
