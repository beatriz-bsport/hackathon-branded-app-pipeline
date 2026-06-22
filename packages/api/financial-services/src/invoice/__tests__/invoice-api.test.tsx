import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode, createElement } from "react";
import { describe, expect, it } from "vitest";

import { createTestFetch } from "@bsport/fetch/test";

import { server } from "#src/__tests__/setup";
import { invoiceKeys, unpaidInvoiceCountQueryOptions } from "#src/invoice/api";
import { makeUnpaidInvoiceHandlers } from "#src/invoice/mocks";

const MEMBER_ID = 1000;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const useUnpaidInvoiceCountQuery = (memberId: number = MEMBER_ID) =>
  useQuery(unpaidInvoiceCountQueryOptions(createTestFetch(), memberId));

const renderUnpaidInvoiceCountQuery = (memberId: number = MEMBER_ID) => {
  const queryClient = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  return {
    queryClient,
    ...renderHook(() => useUnpaidInvoiceCountQuery(memberId), { wrapper }),
  };
};

describe("unpaidInvoiceCountQueryOptions", () => {
  it("returns the unpaid count from the paginated `count` field", async () => {
    server.use(...makeUnpaidInvoiceHandlers({ count: 3, delayMs: 0 }));

    const { result } = renderUnpaidInvoiceCountQuery();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(3);
  });

  it("defaults to zero when there are no unpaid invoices", async () => {
    const { result } = renderUnpaidInvoiceCountQuery();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(0);
  });

  it("stores the count under the member-scoped query key", async () => {
    server.use(...makeUnpaidInvoiceHandlers({ count: 5, delayMs: 0 }));

    const { queryClient, result } = renderUnpaidInvoiceCountQuery();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(invoiceKeys.unpaidCount(MEMBER_ID))).toBe(
      result.current.data,
    );
  });

  it("enters an error state when the endpoint fails", async () => {
    server.use(...makeUnpaidInvoiceHandlers({ delayMs: 0, errorOnLoad: true }));

    const { result } = renderUnpaidInvoiceCountQuery();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
