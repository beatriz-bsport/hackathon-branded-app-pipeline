import { Modal } from "@bsport/kaizen-primitive-core";

import { useDuplicateClass } from "#src/hooks/use-duplicate-class";
import { Trans, getFixedNamespace, useTranslation } from "#src/utils/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  classToDuplicate: { id: number; name: string } | null;
};

export const DuplicateClassModal = ({
  open,
  onClose,
  classToDuplicate,
}: Props) => {
  const { t } = useTranslation("list");
  const { mutate: duplicateClass, isPending } = useDuplicateClass({
    onSuccess: onClose,
  });

  return (
    <Modal
      open={open}
      size="md"
      title={t("list.duplicateModal.title")}
      onClose={onClose}
      confirmButton={{
        label: t("list.duplicateModal.confirm"),
        color: "main",
        disabled: isPending,
        onClick: () => {
          if (classToDuplicate) duplicateClass(classToDuplicate.id);
        },
      }}
      cancelButton={{
        label: t("list.duplicateModal.cancel"),
        onClick: onClose,
      }}
    >
      <Trans
        i18nKey="list.duplicateModal.modalContent"
        ns={getFixedNamespace("list")}
        values={{ className: classToDuplicate?.name }}
      />
    </Modal>
  );
};
