import React from 'react';

export const useCloseModal = ({ onClose }: { onClose: () => void }) => {
  const modalRef = React.useRef(null);
  React.useEffect(() => {
    const handleOnClickAway = (event: Event) => {
      if (
        !!modalRef.current &&
        event?.target &&
        !modalRef.current.contains(event.target)
      ) {
        event?.stopPropagation();
        onClose && onClose();
      }
    };
    const closeOnEscapeKey = (event: KeyboardEvent) =>
      event.key === 'Escape' && onClose && onClose();
    document?.addEventListener('keydown', closeOnEscapeKey);
    document?.addEventListener('mousedown', handleOnClickAway);
    return () => {
      document?.removeEventListener('mousedown', handleOnClickAway);
      document?.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [modalRef, onClose]);

  return { modalRef };
};
