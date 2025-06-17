import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import type { CustomForm } from "@bsport/store-cdp-custom-form";

import { useDuplicateCustomForm } from "#src/hooks/api/use-duplicate-form";
import { LEGACY_URLS } from "#src/urls";
import { Trans, useTranslation } from "#src/utils/i18n";
import type { ModalProps } from "#src/utils/types";

type Props = ModalProps & {
  formName: string;
  formId: number;
  isOpen: boolean;
  onClose: () => void;
};

export const DuplicateFormModal: React.FC<Props> = ({
  formName,
  formId,
  isOpen,
  onClose,
  onSuccess,
  onFailure,
}: Props) => {
  const { t } = useTranslation("common");
  const { duplicateCustomForm } = useDuplicateCustomForm({
    onSuccess: (duplicatedForm: CustomForm) => {
      onSuccess?.();
      onClose();
      toast({
        status: "default",
        icon: "copy-03",
        title: t("toasts.messageDuplicated.success"),
        buttonLabel: t("toasts.actions.open"),
        onButtonClick: () => {
          const pathToNavigate = LEGACY_URLS.FORM_DETAILS(duplicatedForm?.id);
          window.location.assign(pathToNavigate);
        },
      });
    },
    onFailure: () => {
      onFailure?.();
      onClose();
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.messageDuplicated.error"),
      });
    },
  });

  const handleDuplicateForm = () => {
    if (formId) {
      duplicateCustomForm({ id: formId });
    } else {
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.messageDuplicated.error"),
      });
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("activeList.duplicateModal.title")}
      confirmButton={{
        label: t("activeList.duplicateModal.actions.duplicate"),
        onClick: handleDuplicateForm,
      }}
      cancelButton={{
        label: t("activeList.duplicateModal.actions.cancel"),
        onClick: onClose,
      }}
      size="md"
    >
      <div className="flex flex-col gap-y-[16px]">
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          <Trans
            i18nKey={"activeList.duplicateModal.description.verification"}
            values={{ name: formName }}
            components={{
              b: <b></b>,
            }}
          />{" "}
        </Body>
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          {t("activeList.duplicateModal.description.effect")}
        </Body>{" "}
      </div>
    </Modal>
  );
};
