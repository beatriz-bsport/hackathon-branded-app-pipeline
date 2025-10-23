import { RefObject, useEffect, useRef } from "react";

/**
 * Hook that adds an event listener to the document for clicks outside the
 * provided references.
 * @param ref The references to watch for clicks outside.
 * @param onClose Function to call when the outside click is detected.
 * @param open Whether the component is open and should be watching for clicks.
 */
const useOutsideClickListener = (
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  open: boolean,
) => {
  const isHandlingRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      // Ignore clicks on the scrollbar or document body
      if (
        event.target === document.documentElement ||
        event.target === document.body ||
        isHandlingRef.current
      )
        return;

      isHandlingRef.current = true;
      setTimeout(() => {
        isHandlingRef.current = false;
      }, 10);

      const popovers = Array.from(
        document.querySelectorAll('[data-popover="true"]'),
      );
      const topMostPopover = popovers[popovers.length - 1];

      if (topMostPopover !== ref.current) return;

      const clickedInsideAnyPopover = popovers.some((popover) =>
        popover.contains(event.target as Node),
      );

      if (!clickedInsideAnyPopover) {
        onClose();
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
