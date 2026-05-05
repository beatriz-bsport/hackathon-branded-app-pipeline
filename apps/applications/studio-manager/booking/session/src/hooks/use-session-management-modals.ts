import { useCallback, useReducer } from "react";

export enum SessionManagementModalType {
  CANCEL = "cancel",
  RESTORE = "restore",
  DUPLICATE = "duplicate",
  DELETE = "delete",
  CANCEL_BOOKING = "cancel_booking",
  PAUSE_WAITLIST = "pause_waitlist",
  REACTIVATE_WAITLIST = "reactivate_waitlist",
  VIEW_WAITLIST = "view_waitlist",
  DISCARD_BOOKING_OPTION = "discard_booking_option",
}

export type SessionManagementModalParams = {
  bookingId?: number;
  bookingOptionId?: number;
};

export type SessionManagementModalState = {
  type: SessionManagementModalType;
  bookingId?: number | null; // Used for booking related modals, e.g. CancelBookingModal
  bookingOptionId?: number | null; // Used for booking option related modals, e.g. DiscardBookingOptionModal
} | null;

type Action =
  | {
      action: "open";
      type: SessionManagementModalType;
      bookingId?: number | null;
      bookingOptionId?: number | null;
    }
  | { action: "close" };

const reducer = (
  _state: SessionManagementModalState,
  action: Action,
): SessionManagementModalState => {
  switch (action.action) {
    case "open":
      return {
        type: action.type,
        bookingId: action.bookingId,
        bookingOptionId: action.bookingOptionId,
      };
    case "close":
      return null;
  }
};

/**
 * Custom hook to manage the state of session management modals.
 * It provides functions to open and close modals, and keeps track of which modal is currently open.
 */
export const useSessionManagementModals = () => {
  const [modalState, dispatch] = useReducer(reducer, null);

  const openModal = useCallback(
    (
      type: SessionManagementModalType,
      { bookingId, bookingOptionId }: SessionManagementModalParams = {},
    ) => {
      dispatch({ action: "open", type, bookingId, bookingOptionId });
    },
    [],
  );

  const closeModal = useCallback(() => {
    dispatch({ action: "close" });
  }, []);

  return { modalState, openModal, closeModal } as const;
};
