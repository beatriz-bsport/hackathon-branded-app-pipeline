import { type FC } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CollectionFormModal } from "#src/features/collection-form-modal";
import { COLLECTION_FORM_DATA_DEFAULT } from "#src/features/collection-form/constants";
import { transformFormStateIntoAPIData } from "#src/features/collection-form/utils";
import { useTranslation } from "#src/utils/i18n";

import { useCreateCollection } from "./use-create-collection";

type CollectionCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CollectionCreateModal: FC<CollectionCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("collection-form");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const { createCollection, isLoading } = useCreateCollection();

  return (
    <CollectionFormModal
      defaultValues={COLLECTION_FORM_DATA_DEFAULT}
      formIdPrefix="collection-form-create"
      isLoading={isLoading}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={(data, { closeModal }) => {
        if (!companyId) {
          toast({
            status: "critical",
            icon: "alert-circle",
            title: t("createModal.submitResponse.error"),
            buttonIcon: "x-close",
          });
          return;
        }
        createCollection(transformFormStateIntoAPIData(data, companyId), {
          onSuccess: () => {
            closeModal();
          },
        });
      }}
      translations={{
        title: t("createModal.title"),
        confirmButtonLabel: t("createModal.buttons.create"),
        cancelButtonLabel: t("createModal.buttons.cancel"),
      }}
    />
  );
};
