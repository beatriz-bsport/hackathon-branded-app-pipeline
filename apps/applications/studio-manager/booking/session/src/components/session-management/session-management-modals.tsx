import { FC } from "react";

import { CancelSessionModal } from "#src/components/SessionList/detail-actions/cancel-session-modal";
import { DeleteSessionModal } from "#src/components/SessionList/detail-actions/delete-session-modal";
import { DuplicateSessionModal } from "#src/components/SessionList/detail-actions/duplicate-session-modal";
import { RestoreSessionModal } from "#src/components/SessionList/detail-actions/restore-session-modal";
import { useRetrieveGroupSession } from "#src/hooks/group-session/use-retrieve-group-session";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import {
  type SessionManagementModalState,
  SessionManagementModalType,
} from "#src/hooks/use-session-management-modals";
import { useUrls } from "#src/urls";

type Props = {
  sessionId: number;
  modalState: SessionManagementModalState;
  closeModal: () => void;
};

export const SessionManagementModals: FC<Props> = ({
  sessionId,
  modalState,
  closeModal,
}) => {
  const { navigateToIndex } = useUrls();
  const { data: sessionData } = useRetrieveSession(sessionId);

  const { data: groupSession } = useRetrieveGroupSession(sessionData.group);

  const session = {
    ...sessionData,
    groupName: groupSession?.name,
    name: sessionData.name_override || sessionData.activity_name,
    nb_bookings: sessionData.bookings.length,
  };

  return (
    <>
      {modalState?.type === SessionManagementModalType.CANCEL && (
        <CancelSessionModal session={session} isOpen onClose={closeModal} />
      )}
      {modalState?.type === SessionManagementModalType.RESTORE && (
        <RestoreSessionModal session={session} isOpen onClose={closeModal} />
      )}
      {modalState?.type === SessionManagementModalType.DUPLICATE && (
        <DuplicateSessionModal session={session} isOpen onClose={closeModal} />
      )}
      {modalState?.type === SessionManagementModalType.DELETE && (
        <DeleteSessionModal
          session={session}
          isOpen
          onClose={() => {
            closeModal();
            navigateToIndex();
          }}
        />
      )}
    </>
  );
};
