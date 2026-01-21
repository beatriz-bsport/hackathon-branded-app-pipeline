import { type RefObject, useEffect } from "react";

/**
 * Close the modal/popover/sidebar when the escape key is pressed
 * For modals with backdropRef: Only closes if this modal is the topmost one (last visible dialog in DOM)
 * For other components: Closes immediately when escape is pressed
 * @param onClose - Function to call when the escape key is pressed
 * @param open - Boolean indicating if the component is open
 * @param backdropRef - Optional ref to the dialog backdrop element (for modal topmost dialog logic)
 */
const useEscapeKeydownListener = (
  onClose: () => void,
  open: boolean,
  backdropRef?: RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !open) return;

      // If backdropRef is provided, use topmost dialog logic (for modals)
      if (backdropRef) {
        if (!backdropRef.current) return;

        // Find all visible dialogs (opacity-100 means visible)
        const allDialogs = document.querySelectorAll<HTMLElement>(
          '[data-component="Kaizen-Dialog"]',
        );
        const visibleDialogs = Array.from(allDialogs).filter((dialog) =>
          dialog.classList.contains("opacity-100"),
        );

        // Only close if this dialog is the topmost (last) visible dialog
        if (
          visibleDialogs.length > 0 &&
          backdropRef.current === visibleDialogs[visibleDialogs.length - 1]
        ) {
          onClose?.();
        }
      } else {
        // Simple escape key handling for non-modal components (popover, sidebar, etc.)
        onClose?.();
      }
    };

    if (typeof document !== "undefined" && open) {
      document.addEventListener("keydown", handleEscapePress);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("keydown", handleEscapePress);
      }
    };
  }, [open, onClose, backdropRef]);
};

export default useEscapeKeydownListener;
