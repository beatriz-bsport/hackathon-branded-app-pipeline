import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { BookingFlowState } from "./types";

export const getInitialState = (): BookingFlowState => ({
  variant: "single",
  memberId: null,
  consumerPaymentPackId: null,
  paymentPackId: null,
  sessionIds: [],
  spotIndex: null,
  keepCredits: false,
  notifyMember: true,
  discount: null,
  billingGroupId: null,
});

export const bookingFlowStore = createStore<BookingFlowState>(getInitialState);

/**
 * @description
 * Hook to access the booking flow state.
 * You can:
 * - Retrieve a specific item from the store by providing a selector:
 *   ```tsx
 *   const memberId = useBookingFlowStore((state) => state.memberId);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 */
export const useBookingFlowStore = bindStore(bookingFlowStore);
