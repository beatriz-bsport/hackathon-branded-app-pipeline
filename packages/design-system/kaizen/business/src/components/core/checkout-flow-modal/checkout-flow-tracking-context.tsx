import React, { createContext, useContext } from "react";

import type { CheckoutFlowTrackFn } from "./types";

const noopTrack = (() => {}) as CheckoutFlowTrackFn;

const CheckoutFlowTrackingContext = createContext<CheckoutFlowTrackFn | null>(
  null,
);

type CheckoutFlowTrackingProviderProps = {
  track: CheckoutFlowTrackFn;
  children: React.ReactNode;
};

/**
 * Provides the checkout flow track function to the tree.
 * Use useCheckoutFlowTrack() in child components instead of receiving track via props.
 */
export const CheckoutFlowTrackingProvider: React.FC<
  CheckoutFlowTrackingProviderProps
> = ({ track, children }) => (
  <CheckoutFlowTrackingContext.Provider value={track}>
    {children}
  </CheckoutFlowTrackingContext.Provider>
);

/**
 * Returns the checkout flow track function. Use this inside the checkout flow modal
 * instead of receiving track as a prop.
 * Returns the track function provided by CheckoutFlowTrackingProvider.
 */
export function useCheckoutFlowTrack(): CheckoutFlowTrackFn {
  const track = useContext(CheckoutFlowTrackingContext);
  return track ?? noopTrack;
}
