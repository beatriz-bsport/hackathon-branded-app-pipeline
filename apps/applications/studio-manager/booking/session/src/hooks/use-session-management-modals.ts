import { useCallback, useReducer } from "react";

export enum SessionManagementModalType {
  CANCEL = "cancel",
  RESTORE = "restore",
  DUPLICATE = "duplicate",
  DELETE = "delete",
}

export type SessionManagementModalState = {
  type: SessionManagementModalType;
} | null;

type Action =
  | { action: "open"; type: SessionManagementModalType }
  | { action: "close" };

const reducer = (
  _state: SessionManagementModalState,
  action: Action,
): SessionManagementModalState => {
  switch (action.action) {
    case "open":
      return { type: action.type };
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

  const openModal = useCallback((type: SessionManagementModalType) => {
    dispatch({ action: "open", type });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ action: "close" });
  }, []);

  return { modalState, openModal, closeModal } as const;
};
