import { FC } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Body, Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { closeModal, useSessionListStore } from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

import {
  selectIsCancelModalOpen,
  selectModalState,
} from "../../../stores/session-list/selectors";

export const CancelSessionModal: FC = () => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const isOpen = useSessionListStore(selectIsCancelModalOpen);
  const session = useSessionListStore(selectModalState)?.session;

  const getDescription = () => {
    if (!session) return "";
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
      title={t("cancelModal.title")}
      description={getDescription()}
      onClose={closeModal}
      confirmButton={{
        label: t("cancelModal.confirmButton"),
      }}
      cancelButton={{
        label: t("cancelModal.cancelButton"),
        onClick: closeModal,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="lg">
          {t("cancelModal.description")}
        </Body>
      </div>
    </Modal>
  );
};
