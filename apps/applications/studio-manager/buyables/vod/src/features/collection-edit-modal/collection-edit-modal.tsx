import { type FC } from "react";

import type { Collection } from "@bsport/api-buyables/collection";
import { toast } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CollectionFormModal } from "#src/features/collection-form-modal";
import {
  transformCollectionIntoFormState,
  transformFormStateIntoAPIData,
} from "#src/features/collection-form/utils";
import { useTranslation } from "#src/utils/i18n";

import { useEditCollection } from "./use-edit-collection";

type CollectionEditModalProps = {
  collection: Collection;
  isOpen: boolean;
  onClose: () => void;
};

export const CollectionEditModal: FC<CollectionEditModalProps> = ({
  collection,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("collection-form");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const defaultValues = transformCollectionIntoFormState(collection);

  const { editCollection, isLoading } = useEditCollection();

  return (
    <CollectionFormModal
      defaultValues={defaultValues}
      formIdPrefix="collection-form-edit"
      isLoading={isLoading}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={(data, { closeModal }) => {
        if (!companyId) {
          toast({
            status: "critical",
            icon: "alert-circle",
            title: t("editModal.submitResponse.error"),
            buttonIcon: "x-close",
          });
          return;
        }
        editCollection(
          {
            id: collection.id,
            formData: transformFormStateIntoAPIData(data, companyId),
          },
          {
            onSuccess: () => {
              closeModal();
            },
          },
        );
      }}
      translations={{
        title: t("editModal.title"),
        confirmButtonLabel: t("editModal.buttons.save"),
        cancelButtonLabel: t("editModal.buttons.cancel"),
      }}
    />
  );
};
