import { useEffect } from "react";

/**
 * Close the modal when the escape key is pressed
 * @param onClose - Function to call when the escape key is pressed
 * @param open - Boolean indicating if the modal is open
 */
const useEscapeKeydownListener = (onClose: () => void, open: boolean) => {
  useEffect(() => {
    const handleEscapePress = ({ key }: KeyboardEvent) =>
      key === "Escape" && onClose?.();

    if (typeof document !== "undefined" && open) {
      document.addEventListener("keydown", handleEscapePress);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("keydown", handleEscapePress);
      }
    };
  }, [open, onClose]);
};

export default useEscapeKeydownListener;
