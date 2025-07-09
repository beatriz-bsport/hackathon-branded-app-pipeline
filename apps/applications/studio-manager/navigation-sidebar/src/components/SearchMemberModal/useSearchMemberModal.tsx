import { useCallback, useState } from "react";

export const useSearchMemberModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);

  const handleClose = useCallback(() => setIsOpen(false), []);

  return {
    isSearchMemberModalOpen: isOpen,
    openSearchMemberModal: handleOpen,
    closeSearchMemberModal: handleClose,
  };
};
