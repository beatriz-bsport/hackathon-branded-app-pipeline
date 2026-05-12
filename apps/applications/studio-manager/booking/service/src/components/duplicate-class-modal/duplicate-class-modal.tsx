import { Modal } from "@bsport/kaizen-primitive-core";

import { useDuplicateClass } from "#src/hooks/use-duplicate-class";
import { Trans, getFixedNamespace, useTranslation } from "#src/utils/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  classToDuplicate: { id: number; name: string } | null;
  onSuccess?: (id: number) => void;
};

export const DuplicateClassModal = ({
  open,
  onClose,
  classToDuplicate,
  onSuccess,
}: Props) => {
  const { t } = useTranslation("class-actions");
  const { mutate: duplicateClass, isPending } = useDuplicateClass({
    onSuccess: (id) => {
      onClose();
      onSuccess?.(id);
    },
  });

  return (
    <Modal
      open={open}
      size="md"
      title={t("classActions.duplicateModal.title", {
        className: classToDuplicate?.name,
      })}
      onClose={onClose}
      confirmButton={{
        label: t("classActions.duplicateModal.confirm"),
        color: "main",
        disabled: isPending,
        onClick: () => {
          if (classToDuplicate) duplicateClass(classToDuplicate.id);
        },
      }}
      cancelButton={{
        label: t("classActions.duplicateModal.cancel"),
        onClick: onClose,
      }}
    >
      <Trans
        i18nKey="classActions.duplicateModal.modalContent"
        ns={getFixedNamespace("class-actions")}
        values={{ className: classToDuplicate?.name }}
      />
    </Modal>
  );
};
