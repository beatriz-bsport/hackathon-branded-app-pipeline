import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteCategory } from "#src/hooks/api/use-delete-category";
import { Trans, useTranslation } from "#src/utils/i18n";
import type { ModalProps } from "#src/utils/types";

type Props = ModalProps & {
  categoryId: number;
  categoryName: string;
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteCategoryModal: React.FC<Props> = ({
  categoryId,
  categoryName,
  isOpen,
  onClose,
  onSuccess,
  onFailure,
}: Props) => {
  const { t } = useTranslation("list");

  const { deleteCategory } = useDeleteCategory({
    onSuccess: () => {
      onSuccess?.();
      toast({
        status: "positive",
        icon: "edit-02",
        title: t("activeList.deleteCategoryModal.onSuccess.title"),
      });
      onClose();
    },
    onFailure: () => {
      onFailure?.();
      toast({
        status: "critical",
        icon: "x-close",
        title: t("activeList.deleteCategoryModal.onFailure.title"),
      });
      onClose();
    },
  });

  const handleDeleteCategory = () => {
    if (!categoryId) {
      toast({
        status: "critical",
        icon: "x-close",
        title: t("activeList.deleteCategoryModal.onFailure.title"),
      });
      return;
    }
    deleteCategory({ id: categoryId });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("activeList.deleteCategoryModal.title")}
      confirmLabel={t("activeList.deleteCategoryModal.confirmButton")}
      confirmColor="main"
      onConfirmClick={handleDeleteCategory}
      cancelLabel={t("activeList.deleteCategoryModal.cancelButton")}
      size="md"
    >
      <div className="flex flex-col gap-y-sm">
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          <Trans
            i18nKey={"activeList.deleteCategoryModal.description.firstStep"}
            values={{ categoryName: categoryName }}
            components={{
              b: <b></b>,
            }}
          />
        </Body>
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          {t("activeList.deleteCategoryModal.description.secondStep")}
        </Body>
      </div>
    </Modal>
  );
};
