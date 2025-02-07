import { useState } from "react";
import { Trans, useTranslation } from "#src/utils/i18n";
import {
  archiveGroupActivity,
  duplicateGroupActivity,
  checkCanArchiveGroupActivity,
} from "@bsport/store-booking-group-activity";
import { Modal } from "@bsport/kaizen-primitive-core";

import fetch from "#src/utils/fetch";

export const useGroupActivityModals = ({
  fetchData,
  currentPage,
  rowsPerPage,
}: {
  fetchData: (page: number, rows: number) => void;
  currentPage: number;
  rowsPerPage: number;
}) => {
  const { t } = useTranslation("groupActivity");

  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  const [groupActivityToDuplicate, setGroupActivityToDuplicate] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [groupActivityToArchive, setGroupActivityToArchive] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const [canArchiveGroupActivity, setCanArchiveGroupActivity] = useState(false);

  const onClickArchive = (id: number, name: string) => () => {
    checkCanArchiveGroupActivity(fetch, id.toString()).then((response) => {
      response.fold(
        ({ can_destroy }) => {
          setCanArchiveGroupActivity(can_destroy);
          setIsArchiveModalOpen(true);
          setGroupActivityToArchive({ id, name });
        },
        (error) => console.error(error),
      );
    });
  };

  const onCloseArchiveModal = () => {
    setCanArchiveGroupActivity(false);
    setIsArchiveModalOpen(false);
    setGroupActivityToArchive(null);
  };

  const onClickDuplicate = (id: number, name: string) => () => {
    setIsDuplicateModalOpen(true);
    setGroupActivityToDuplicate({ id, name });
  };

  const onCloseDuplicateModal = () => {
    setIsDuplicateModalOpen(false);
    setGroupActivityToDuplicate(null);
  };

  const handleArchiveGroupActivity = () => {
    if (!groupActivityToArchive?.id) return;
    archiveGroupActivity(fetch, groupActivityToArchive.id.toString()).then(
      (response) => {
        response.fold(
          () => {
            fetchData(currentPage, rowsPerPage);
            onCloseArchiveModal();
          },
          (error) => console.error(error),
        );
      },
    );
  };

  const handleDuplicateGroupActivity = () => {
    if (!groupActivityToDuplicate?.id) return;
    duplicateGroupActivity(fetch, groupActivityToDuplicate.id.toString()).then(
      (response) => {
        response.fold(
          () => {
            fetchData(currentPage, rowsPerPage);
            onCloseDuplicateModal();
          },
          (error) => console.error(error),
        );
      },
    );
  };

  const archiveModal = (
    <Modal
      confirmColor="critical"
      confirmLabel={
        canArchiveGroupActivity ? t("list.enabled.archive.confirm") : ""
      }
      onConfirmClick={handleArchiveGroupActivity}
      open={isArchiveModalOpen}
      size="md"
      title={t("list.enabled.archive.title")}
      onClose={onCloseArchiveModal}
      cancelLabel={t("list.enabled.archive.cancel")}
    >
      <Trans
        i18nKey={
          canArchiveGroupActivity
            ? "list.enabled.archive.modalContent"
            : "list.enabled.archive.cantArchive"
        }
        values={{
          groupActivityName: groupActivityToArchive?.name,
        }}
      />
    </Modal>
  );

  const duplicateModal = (
    <Modal
      confirmColor="main"
      confirmLabel={t("list.enabled.duplicate.confirm")}
      onConfirmClick={handleDuplicateGroupActivity}
      open={isDuplicateModalOpen}
      size="md"
      title={t("list.enabled.duplicate.title")}
      onClose={onCloseDuplicateModal}
      cancelLabel={t("list.enabled.duplicate.cancel")}
    >
      <Trans
        i18nKey="list.enabled.duplicate.modalContent"
        values={{
          groupActivityName: groupActivityToDuplicate?.name,
        }}
      />
    </Modal>
  );

  return {
    onClickArchive,
    onClickDuplicate,
    archiveModal,
    duplicateModal,
  };
};
