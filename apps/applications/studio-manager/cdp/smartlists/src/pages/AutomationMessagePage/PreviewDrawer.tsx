import { useId, useState } from "react";

import { DetailDrawer } from "@bsport/kaizen-primitive-core";

import { PushNotificationPreview } from "#src/components/BusinessComponents/PushNotificationPreview";

type PreviewDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  sender?: string | null;
  title?: string | null;
  content?: string | null;
};

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

export function PreviewDrawer({
  isOpen,
  onClose,
  sender,
  title,
  content,
}: PreviewDrawerProps) {
  const id = useId();

  return (
    <DetailDrawer isOpen={isOpen} onClose={onClose} id={id}>
      <PushNotificationPreview
        sender={sender ?? ""}
        title={title ?? ""}
        content={content ?? ""}
      />
    </DetailDrawer>
  );
}
