import React from 'react';

export const useDialogClickAwayListener = ({
  onDialogClose,
}: {
  onDialogClose: () => void;
}) => {
  const modalRef = React.useRef(null);
  React.useEffect(() => {
    const handleOnClickAway = (event: Event) => {
      if (!!modalRef.current && !modalRef.current.contains(event.target)) {
        event.stopPropagation();
        onDialogClose && onDialogClose();
      }
    };
    document.addEventListener('mousedown', handleOnClickAway);

    return () => {
      document.removeEventListener('mousedown', handleOnClickAway);
    };
  }, [modalRef, onDialogClose]);

  return { modalRef };
};
