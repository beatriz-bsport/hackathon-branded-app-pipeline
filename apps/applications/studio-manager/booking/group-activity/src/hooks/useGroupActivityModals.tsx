import { useState } from "react";

import { Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  archiveGroupActivityAction,
  checkCanArchiveGroupActivityAction,
  duplicateGroupActivityAction,
  unarchiveGroupActivityAction,
} from "@bsport/store-booking-group-activity";

import { fetch } from "#src/utils/fetch";
import { Trans, useTranslation } from "#src/utils/i18n";

export const useGroupActivityModals = ({
  fetchGroupActivitiesPage,
}: {
  fetchGroupActivitiesPage: () => void;
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

  const onClickArchive = (id: number, name: string) => {
    checkCanArchiveGroupActivityAction(fetch, id.toString()).then(
      (response) => {
        response.fold(
          ({ can_destroy }) => {
            setCanArchiveGroupActivity(can_destroy);
            setIsArchiveModalOpen(true);
            setGroupActivityToArchive({ id, name });
          },
          (error) => console.error(error),
        );
      },
    );
  };

  const onCloseArchiveModal = () => {
    setCanArchiveGroupActivity(false);
    setIsArchiveModalOpen(false);
    setGroupActivityToArchive(null);
  };

  const onClickDuplicate = (id: number, name: string) => {
    setIsDuplicateModalOpen(true);
    setGroupActivityToDuplicate({ id, name });
  };

  const onCloseDuplicateModal = () => {
    setIsDuplicateModalOpen(false);
    setGroupActivityToDuplicate(null);
  };

  const revertArchiveGroupActivity = (groupActivityId: number) => () => {
    unarchiveGroupActivityAction(fetch, groupActivityId.toString()).then(
      (response) => {
        response.fold(fetchGroupActivitiesPage, (error) =>
          console.error(error),
        );
      },
    );
  };

  const handleArchiveGroupActivity = () => {
    if (!groupActivityToArchive?.id) return;
    archiveGroupActivityAction(
      fetch,
      groupActivityToArchive.id.toString(),
    ).then((response) => {
      response.fold(
        ({ name }) => {
          toast({
            status: "default",
            icon: "archive",
            description: t("list.toasts.archive", {
              groupActivityName: name,
            }),
            duration: 5000,
            buttonLabel: t("list.toasts.undo"),
            onButtonClick: revertArchiveGroupActivity(
              groupActivityToArchive.id,
            ),
          });
        },
        (error) => console.error(error),
      );
      fetchGroupActivitiesPage();
      onCloseArchiveModal();
    });
  };

  const handleDuplicateGroupActivity = () => {
    if (!groupActivityToDuplicate?.id) return;
    duplicateGroupActivityAction(
      fetch,
      groupActivityToDuplicate.id.toString(),
    ).then((response) => {
      response.fold(
        ({ name }) => {
          toast({
            status: "default",
            icon: "copy-03",
            description: t("list.toasts.duplication", {
              groupActivityName: name,
            }),
            duration: 5000,
            buttonLabel: t("list.toasts.open"),
          });
        },
        (error) => console.error(error),
      );
      fetchGroupActivitiesPage();
      onCloseDuplicateModal();
    });
  };

  const archiveModal = (
    <Modal
      confirmButton={{
        label: canArchiveGroupActivity ? t("list.enabled.archive.confirm") : "",
        color: "critical",
        onClick: handleArchiveGroupActivity,
      }}
      cancelButton={{
        label: t("list.enabled.archive.cancel"),
        onClick: onCloseArchiveModal,
      }}
      open={isArchiveModalOpen}
      size="md"
      title={t("list.enabled.archive.title")}
      onClose={onCloseArchiveModal}
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
      confirmButton={{
        label: t("list.enabled.duplicate.confirm"),
        color: "main",
        onClick: handleDuplicateGroupActivity,
      }}
      cancelButton={{
        label: t("list.enabled.duplicate.cancel"),
        onClick: onCloseDuplicateModal,
      }}
      open={isDuplicateModalOpen}
      size="md"
      title={t("list.enabled.duplicate.title")}
      onClose={onCloseDuplicateModal}
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
