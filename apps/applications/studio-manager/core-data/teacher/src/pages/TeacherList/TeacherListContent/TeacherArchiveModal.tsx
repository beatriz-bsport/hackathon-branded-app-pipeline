import React from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  archiveTeacherAction,
  restoreTeacherAction,
} from "@bsport/store-core-data-teacher";
import { useAsync } from "@bsport/use-async";

import { useGenericToasts } from "#src/hooks/useGenericToasts";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type TeacherArchiveModalProps = {
  teacherId: number;
  teacherName: string;
  isOpen: boolean;
  onClose: () => void;
  refreshPageList: () => void;
};

export const TeacherArchiveModal: React.FC<TeacherArchiveModalProps> = ({
  teacherId,
  teacherName,
  isOpen,
  onClose,
  refreshPageList,
}) => {
  const { t } = useTranslation("common");

  const { handleActionFailed, handleActionUndone } = useGenericToasts();

  const [, handleRestore] = useAsync({
    asyncFn: async () => {
      return restoreTeacherAction(fetch, {
        id: teacherId,
      });
    },
    onSuccess: () => {
      refreshPageList();
      // Display a toast to inform about the success
      handleActionUndone();
    },
    onFailure: () => {
      // Display a toast to inform about the failure
      handleActionFailed(t("toasts.messageUndone.error"));
    },
    dependencies: [
      refreshPageList,
      teacherId,
      handleActionFailed,
      handleActionUndone,
    ],
  });

  const [, handleArchive] = useAsync({
    asyncFn: async () => {
      return archiveTeacherAction(fetch, { id: teacherId });
    },
    onSuccess: () => {
      // Display a toast to "undo" the action
      toast({
        status: "default",
        icon: "archive",
        title: t("toasts.messageArchived.success"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: handleRestore,
      });

      // Refresh the list page once the request has finished
      refreshPageList();

      // Close the modal
      onClose();
    },
    onFailure: () => {
      // Display a toast to inform about the failure
      handleActionFailed(t("toasts.messageArchived.error"));
      // Close the modal
      onClose();
    },
    dependencies: [teacherId, refreshPageList, handleRestore],
  });

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("activeList.archiveModal.buttons.archive"),
        color: "critical",
        onClick: handleArchive,
      }}
      cancelButton={{
        label: t("activeList.archiveModal.buttons.back"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
      title={t("activeList.archiveModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <>
        <Body htmlVariant="p">
          {t("activeList.archiveModal.description.action", {
            name: teacherName,
          })}
        </Body>
        <Body htmlVariant="p" weight="strong">
          {t("activeList.archiveModal.description.effect")}
        </Body>
      </>
    </Modal>
  );
};
