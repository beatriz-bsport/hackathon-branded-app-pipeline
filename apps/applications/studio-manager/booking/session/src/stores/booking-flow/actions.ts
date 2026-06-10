import { bookingFlowStore, getInitialState } from "./store";
import type { BookingFlowVariant, DiscountState } from "./types";

export const setVariant = (variant: BookingFlowVariant) => {
  bookingFlowStore.setState({ variant });
};

export const setMember = (memberId: number) => {
  bookingFlowStore.setState({ memberId });
};

export const setPass = (consumerPaymentPackId: number) => {
  bookingFlowStore.setState({
    consumerPaymentPackId,
    paymentPackId: null,
    sessionIds: [],
  });
};

export const setNewPass = (paymentPackId: number | null) => {
  bookingFlowStore.setState({
    paymentPackId,
    consumerPaymentPackId: null,
    sessionIds: [],
  });
};

export const setSessionIds = (sessionIds: number[]) => {
  bookingFlowStore.setState({ sessionIds });
};

export const setSpot = (spotIndex: number) => {
  bookingFlowStore.setState({ spotIndex });
};

export const setKeepCredits = (keepCredits: boolean) => {
  bookingFlowStore.setState({ keepCredits });
};

export const setNotifyMember = (notifyMember: boolean) => {
  bookingFlowStore.setState({ notifyMember });
};

export const setDiscount = (discount: DiscountState | null) => {
  bookingFlowStore.setState({ discount });
};

export const setBillingGroupId = (billingGroupId: number | null) => {
  bookingFlowStore.setState({ billingGroupId });
};

export const resetBookingFlow = () => {
  bookingFlowStore.setState(getInitialState());
};
