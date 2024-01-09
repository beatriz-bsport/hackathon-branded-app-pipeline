import React from 'react';

/**
 * Custom React hook for handling menu modal closure.
 *
 * @param {() => void} onClose - Function to be called to close the modal.
 * @param {React.MutableRefObject<HTMLDivElement | null>} [openMenuRef] - The ref used to identify the div element wrapping the menu.
 *
 *   This allows the selector to flicker for example(when clicking on selector, it closes the menu instead of reopening it).
 * @param {() => void} [setPositionedToFalse] - Function to set the position-related state to false.
 *
 *   This is triggered when clicking on the div wrapping the menu.
 */
export const useCloseModal = ({
  onClose,
  openMenuRef,
  setPositionedToFalse,
}: {
  onClose: () => void;
  openMenuRef?: React.MutableRefObject<HTMLDivElement | null>;
  setPositionedToFalse?: () => void;
}) => {
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const handleOnClickAway = (event: Event) => {
      const hasBeenClickedFromSelector =
        !!openMenuRef?.current &&
        event?.target &&
        openMenuRef.current?.contains(event?.target as Node);

      if (
        !!modalRef.current &&
        event?.target &&
        !modalRef.current.contains(event.target as Node) &&
        !hasBeenClickedFromSelector
      ) {
        event?.stopPropagation();
        onClose && onClose();
      } else if (hasBeenClickedFromSelector) {
        setPositionedToFalse?.();
      }
    };
    const closeOnEscapeKey = (event: KeyboardEvent) => {
      event.key === 'Escape' && onClose && onClose();
      if (openMenuRef?.current) {
        openMenuRef.current.focus?.();
      }
    };
    document?.addEventListener('keydown', closeOnEscapeKey);
    document?.addEventListener('mousedown', handleOnClickAway);
    return () => {
      document?.removeEventListener('mousedown', handleOnClickAway);
      document?.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [modalRef, onClose, openMenuRef, setPositionedToFalse]);

  return { modalRef };
};
