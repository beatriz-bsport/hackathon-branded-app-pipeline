import { FC } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n.js";

import { QueryBoundary } from "../query-boundary/query-boundary";
import { WaitList } from "./waitlist-section/waitlist";

export const ViewWaitlistModal: FC<{
  sessionId: number;
  isOpen: boolean;
  onClose: () => void;
}> = ({ sessionId, isOpen, onClose }) => {
  const { t } = useTranslation("sessionManagement");
  return (
    <QueryBoundary>
      <Modal
        open={isOpen}
        size="md"
        title={t("modals.viewWaitlistMembers.title")}
        description={t("modals.viewWaitlistMembers.subtitle")}
        onClose={onClose}
      >
        {/* We don't want to take the searchQuery in consideration here */}
        <WaitList readOnly searchQuery="" sessionId={sessionId} />
      </Modal>
    </QueryBoundary>
  );
};
