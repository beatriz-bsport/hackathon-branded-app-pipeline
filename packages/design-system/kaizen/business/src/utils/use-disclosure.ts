import { useState } from "react";

// Ref: https://reactuse.com/state/usedisclosure/
export const useDisclosure = (defaultState?: boolean) => {
  const [isOpen, setIsOpen] = useState(defaultState ?? false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return {
    onClose,
    onOpen,
    setIsOpen,
    isOpen,
  };
};
