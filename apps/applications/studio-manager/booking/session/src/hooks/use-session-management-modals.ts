import { useCallback, useReducer } from "react";

export enum SessionManagementModalType {
  CANCEL = "cancel",
  RESTORE = "restore",
  DUPLICATE = "duplicate",
  DELETE = "delete",
  CANCEL_BOOKING = "cancel_booking",
}

export type SessionManagementModalState = {
  type: SessionManagementModalType;
  bookingId?: number | null; // Used for booking related modals, e.g. CancelBookingModal
} | null;

type Action =
  | {
      action: "open";
      type: SessionManagementModalType;
      bookingId?: number | null;
    }
  | { action: "close" };

const reducer = (
  _state: SessionManagementModalState,
  action: Action,
): SessionManagementModalState => {
  switch (action.action) {
    case "open":
      return { type: action.type, bookingId: action.bookingId };
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
    (type: SessionManagementModalType, bookingId?: number) => {
      dispatch({ action: "open", type, bookingId });
    },
    [],
  );

  const closeModal = useCallback(() => {
    dispatch({ action: "close" });
  }, []);

  return { modalState, openModal, closeModal } as const;
};
