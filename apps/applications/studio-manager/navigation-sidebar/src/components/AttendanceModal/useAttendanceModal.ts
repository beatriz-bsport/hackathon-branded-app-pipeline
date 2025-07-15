import { useCallback, useState } from "react";

export const useAttendanceModal = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    isAttendanceModalOpen: open,
    openAttendanceModal: handleOpen,
    closeAttendanceModal: handleClose,
  };
};
