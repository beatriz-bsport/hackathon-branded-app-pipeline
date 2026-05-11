import { useState } from "react";

export function usePreviewDrawer(defaultOpen = false) {
  const [isPreviewOpen, setIsOpen] = useState(defaultOpen);

  const onPreviewOpen = () => {
    setIsOpen(true);
  };

  const onPreviewClose = () => {
    setIsOpen(false);
  };

  return {
    isPreviewOpen,
    onPreviewOpen,
    onPreviewClose,
  };
}
