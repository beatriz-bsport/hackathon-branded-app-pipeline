import React from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  archiveTeacherAction,
  restoreTeacherAction,
} from "@bsport/store-core-data-teacher";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { Trans, useTranslation } from "#src/utils/i18n";

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

  const [, handleRestore] = useAsync({
    asyncFn: async () => {
      return restoreTeacherAction(fetch, {
        id: teacherId,
      });
    },
    onSuccess: () => {
      refreshPageList();
      // Display a toast to inform about the success
      toast({
        status: "default",
        icon: "reverse-left",
        title: t("toasts.messageUndone.success"),
        buttonIcon: "x-close",
      });
    },
    onFailure: () => {
      // Display a toast to inform about the failure
      toast({
        status: "critical",
        icon: "reverse-left",
        title: t("toasts.messageUndone.error"),
        buttonIcon: "x-close",
      });
    },
    dependencies: [refreshPageList, teacherId],
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
      toast({
        status: "critical",
        icon: "archive",
        title: t("toasts.messageArchived.error"),
        buttonIcon: "x-close",
      });

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
        label: t("activeList.archiveModal.buttons.cancel"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
      title={t("activeList.archiveModal.title")}
      size="md"
      onClickOutside={onClose}
      description={
        <>
          <Body htmlVariant="p">
            <Trans
              i18nKey={"activeList.archiveModal.description.action"}
              values={{ name: teacherName }}
              components={{
                b: <b></b>,
              }}
            />
          </Body>
          <Body htmlVariant="p">
            {t("activeList.archiveModal.description.effect")}
          </Body>
        </>
      }
    ></Modal>
  );
};
