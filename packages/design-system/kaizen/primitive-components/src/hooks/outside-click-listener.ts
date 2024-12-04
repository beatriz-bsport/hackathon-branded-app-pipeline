import { RefObject, useEffect } from "react";

/**
 * Hook that adds an event listener to the document for clicks outside the
 * provided references.
 * @param ref The references to watch for clicks outside.
 * @param onClose Function to call when the outside click is detected.
 * @param open Whether the component is open and should be watching for clicks.
 */
const useOutsideClickListener = (
  ref: RefObject<HTMLElement>,
  onClose: () => void,
  open: boolean,
) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    if (typeof document !== "undefined" && open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("mousedown", handleOutsideClick);
      }
    };
  }, [ref, open, onClose]);
};

export default useOutsideClickListener;
