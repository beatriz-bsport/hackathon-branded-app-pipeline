import { FC } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Body, Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useRestoreSession } from "#src/hooks/session-api/session-actions/use-restore-session";
import {
  closeModal,
  selectIsRestoreModalOpen,
  useSessionListStore,
} from "#src/stores/session-list";
import { EnrichedSession } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

type RestoreSessionModalProps = {
  session: EnrichedSession;
};
export const RestoreSessionModal: FC<RestoreSessionModalProps> = ({
  session,
}) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const isOpen = useSessionListStore(selectIsRestoreModalOpen);

  const restoreSession = useRestoreSession();

  const handleConfirm = () => {
    closeModal();
    restoreSession.mutate(session.id);
  };

  const getDescription = () => {
    const sessionDate = formatDateTime(
      session.date_start,
      DATETIME_FORMATS.MEDIUM_DATETIME,
      { locale: i18n.language, timeZone: companyTimezone },
    );
    return `${session.name} - ${sessionDate}`;
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("restoreModal.title")}
      description={getDescription()}
      onClose={closeModal}
      confirmButton={{
        label: t("restoreModal.confirmButton"),
        onClick: handleConfirm,
      }}
      cancelButton={{
        label: t("restoreModal.cancelButton"),
        onClick: closeModal,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="lg">
          {t("restoreModal.description")}
        </Body>
      </div>
    </Modal>
  );
};
