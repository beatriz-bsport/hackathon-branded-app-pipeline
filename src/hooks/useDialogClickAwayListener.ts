import React from 'react';

export const useDialogClickAwayListener = ({
  onDialogClose,
}: {
  onDialogClose: () => void;
}) => {
  const dialogRef = React.useRef(null);
  const modalRef = React.useRef(null);
  React.useEffect(() => {
    const handleOnClickAway = (event: Event) => {
      if (
        !!modalRef.current &&
        !!dialogRef.current &&
        dialogRef.current.contains(event.target) &&
        !modalRef.current.contains(event.target)
      ) {
        event.stopPropagation();
        onDialogClose && onDialogClose();
      }
    };
    document.addEventListener('mousedown', handleOnClickAway);

    return () => {
      document.removeEventListener('mousedown', handleOnClickAway);
    };
  }, [modalRef, onDialogClose]);

  return { dialogRef, modalRef };
};
