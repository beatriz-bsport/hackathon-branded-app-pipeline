import { useCallback, useEffect } from "react";

export type CloseTrigger =
  | "cancel_button"
  | "cross_button"
  | "escape_key"
  | "backdrop_click";

type UseGuardedModalCloseParams = {
  skipEscapeListener: boolean;
  shouldGuard: boolean;
  closeConfirmationMessage?: string;
  close: (trigger: CloseTrigger) => void;
};

export const useGuardedModalClose = ({
  skipEscapeListener,
  shouldGuard,
  closeConfirmationMessage,
  close,
}: UseGuardedModalCloseParams) => {
  const requestClose = useCallback(
    (trigger: CloseTrigger) => {
      if (
        shouldGuard &&
        closeConfirmationMessage != null &&
        !window.confirm(closeConfirmationMessage)
      ) {
        return;
      }

      close(trigger);
    },
    [shouldGuard, closeConfirmationMessage, close],
  );

  const handleCancelClose = useCallback(
    () => requestClose("cancel_button"),
    [requestClose],
  );

  const handleCrossClick = useCallback(
    () => requestClose("cross_button"),
    [requestClose],
  );

  const handleClickOutside = useCallback(
    () => requestClose("backdrop_click"),
    [requestClose],
  );

  useEffect(() => {
    if (skipEscapeListener) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      // Intercept ESC before Dialog internal close logic runs.
      event.preventDefault();
      event.stopImmediatePropagation();
      requestClose("escape_key");
    };

    document.addEventListener("keydown", handleEscapeKey, true);
    return () => document.removeEventListener("keydown", handleEscapeKey, true);
  }, [skipEscapeListener, requestClose]);

  return { handleCrossClick, handleClickOutside, handleCancelClose };
};
