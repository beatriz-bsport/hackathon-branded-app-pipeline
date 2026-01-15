import { useCallback, useState } from "react";

/** Ref: https://reactuse.com/state/usedisclosure/ */
export const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    onOpen,
    onClose,
  };
};
