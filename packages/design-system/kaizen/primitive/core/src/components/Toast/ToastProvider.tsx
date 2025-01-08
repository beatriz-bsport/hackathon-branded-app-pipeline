import React, { createRef } from "react";
import { ToastProps } from "./Toast";
import ToastManager, { ToastManagerHandles } from "./ToastManager";

// Reference to manage toasts without needing context
const toastManagerRef = createRef<ToastManagerHandles>();

/**
 * Function to add a toast message to the UI.
 * Ensure that `ToastProvider` is rendered once in the app to initialize ToastManager.
 * @param toastProps - Properties defining the toast's appearance and behavior.
 */
export const toast = (toastProps: ToastProps) => {
  if (!toastManagerRef.current) {
    console.warn(
      "ToastManager is not initialized. Ensure ToastProvider is rendered in the app.",
    );
    return;
  }
  toastManagerRef.current.addToast(toastProps);
};

/**
 * ToastProvider component to initialize the ToastManager.
 * Should be rendered once where toasts are needed.
 */
export const ToastProvider = () => <ToastManager ref={toastManagerRef} />;
