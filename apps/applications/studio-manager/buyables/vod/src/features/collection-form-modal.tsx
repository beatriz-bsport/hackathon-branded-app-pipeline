import { type FC, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { CollectionFormDescription } from "#src/features/collection-form/components/collection-form-description";
import { CollectionFormPicture } from "#src/features/collection-form/components/collection-form-picture";
import { CollectionFormTitle } from "#src/features/collection-form/components/collection-form-title";
import { useCollectionFormSchema } from "#src/features/collection-form/schema";
import type {
  CollectionFormData,
  CollectionFormSchema,
} from "#src/features/collection-form/types";

type CollectionFormModalProps = {
  defaultValues: CollectionFormData;
  formIdPrefix: string;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CollectionFormData,
    { closeModal }: { closeModal: () => void },
  ) => void;
  translations: {
    title: string;
    confirmButtonLabel: string;
    cancelButtonLabel: string;
  };
};

export const CollectionFormModal: FC<CollectionFormModalProps> = ({
  defaultValues,
  formIdPrefix,
  isLoading,
  isOpen,
  onClose,
  onSubmit,
  translations,
}) => {
  const formId = `${formIdPrefix}-${useId()}`;
  const collectionFormSchema = useCollectionFormSchema();

  const methods = useFormController<CollectionFormSchema>({
    mode: "onChange",
    schema: collectionFormSchema,
    defaultValues,
  });

  const { isDirty, isSubmitting, isValid } = methods.formState;

  const closeModal = () => {
    methods.reset(defaultValues);
    onClose();
  };

  const handleClickOutside = () => {
    if (isDirty || isSubmitting) {
      return;
    }
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      size="sm"
      title={translations.title}
      onClose={closeModal}
      onClickOutside={handleClickOutside}
      confirmButton={{
        color: "main",
        label: translations.confirmButtonLabel,
        type: "submit",
        form: formId,
        iconLeft: isLoading ? "loading" : undefined,
        disabled: !isValid || !isDirty || isSubmitting || isLoading,
      }}
      cancelButton={{
        label: translations.cancelButtonLabel,
        onClick: closeModal,
      }}
    >
      <ControlledForm
        id={formId}
        onSubmit={(data) => {
          onSubmit(data, { closeModal });
        }}
        {...methods}
      >
        <div className="flex flex-col gap-md w-full">
          <CollectionFormPicture formId={formId} methods={methods} />
          <CollectionFormTitle formId={formId} />
          <CollectionFormDescription formId={formId} />
        </div>
      </ControlledForm>
    </Modal>
  );
};
