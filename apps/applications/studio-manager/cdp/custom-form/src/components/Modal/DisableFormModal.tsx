import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";

import { useDisableCustomForm } from "#src/hooks/api/use-disable-form";
import { useRestoreCustomForm } from "#src/hooks/api/use-restore-form";
import { Trans, useTranslation } from "#src/utils/i18n";
import type { AvailabilityModalProps } from "#src/utils/types";

type Props = AvailabilityModalProps & {
  formName: string;
  formId: number;
  isOpen: boolean;
  onClose: () => void;
};

export const DisableFormModal: React.FC<Props> = ({
  formName,
  formId,
  isOpen,
  onClose,
  onDisableSuccess,
  onDisableFailure,
  onRestoreSuccess,
  onRestoreFailure,
}: Props) => {
  const { t } = useTranslation("common");
  const { disableCustomForm } = useDisableCustomForm({
    onSuccess: (formId: number) => {
      onDisableSuccess?.();
      onClose();
      toast({
        status: "default",
        icon: "archive",
        title: t("toasts.messageArchived.success"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: () => {
          restoreCustomForm({ id: formId });
        },
      });
    },
    onFailure: () => {
      onDisableFailure?.();
      onClose();
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.messageArchived.error"),
      });
    },
  });
  const { restoreCustomForm } = useRestoreCustomForm({
    onSuccess: () => {
      onRestoreSuccess?.();
      toast({
        status: "default",
        icon: "reverse-left",
        title: t("toasts.messageUndone.success"),
        buttonIcon: "x-close",
      });
    },
    onFailure: () => {
      onRestoreFailure?.();
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.messageUndone.error"),
        buttonIcon: "x-close",
      });
    },
  });

  const handleArchiveForm = () => {
    if (formId) {
      disableCustomForm({ id: formId });
    } else {
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.messageArchived.error"),
        buttonIcon: "x-close",
      });
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("activeList.archiveModal.title")}
      confirmButton={{
        label: t("activeList.archiveModal.actions.archive"),
        color: "critical",
        onClick: handleArchiveForm,
      }}
      cancelButton={{
        label: t("activeList.archiveModal.actions.cancel"),
        onClick: onClose,
      }}
      size="md"
    >
      <div className="flex flex-col gap-y-[16px]">
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          <Trans
            i18nKey={"activeList.archiveModal.description.verification"}
            values={{ name: formName }}
            components={{
              b: <b></b>,
            }}
          />
        </Body>
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          {t("activeList.archiveModal.description.effect")}
        </Body>
      </div>
    </Modal>
  );
};
