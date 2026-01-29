import { FC } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  closeModal,
  selectIsDuplicateModalOpen,
  useSessionListStore,
} from "#src/stores/session-list";
import { EnrichedSession } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

type DuplicateSessionModalProps = {
  session: EnrichedSession;
};
export const DuplicateSessionModal: FC<DuplicateSessionModalProps> = ({
  session,
}) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const isOpen = useSessionListStore(selectIsDuplicateModalOpen);

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
      title={t("duplicateModal.title")}
      description={getDescription()}
      onClose={closeModal}
      confirmButton={{
        label: t("duplicateModal.confirmButton"),
        color: "critical",
      }}
      cancelButton={{
        label: t("duplicateModal.cancelButton"),
        onClick: closeModal,
      }}
    ></Modal>
  );
};
