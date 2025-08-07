import { useCallback, useState } from "react";

export const useCreateModal = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    isCreateModalOpen: open,
    openCreateModal: handleOpen,
    closeCreateModal: handleClose,
  };
};
