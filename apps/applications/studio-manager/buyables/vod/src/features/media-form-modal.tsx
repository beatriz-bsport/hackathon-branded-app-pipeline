import { type FC, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Divider, Modal } from "@bsport/kaizen-primitive-core";

import { MediaFormAvailability } from "#src/features/media-form/components/media-form-availability";
import { MediaFormCategory } from "#src/features/media-form/components/media-form-category";
import { MediaFormDescription } from "#src/features/media-form/components/media-form-description";
import { MediaFormLevel } from "#src/features/media-form/components/media-form-level";
import { MediaFormPicture } from "#src/features/media-form/components/media-form-picture";
import { MediaFormPrice } from "#src/features/media-form/components/media-form-price";
import { MediaFormTeachers } from "#src/features/media-form/components/media-form-teachers";
import { MediaFormTitle } from "#src/features/media-form/components/media-form-title";
import { useMediaFormSchema } from "#src/features/media-form/schema";
import type {
  MediaFormData,
  MediaFormSchema,
} from "#src/features/media-form/types";

type MediaFormModalProps = {
  defaultValues: MediaFormData;
  formIdPrefix: string;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: MediaFormData,
    { closeModal }: { closeModal: () => void },
  ) => void;
  translations: {
    title: string;
    confirmButtonLabel: string;
    cancelButtonLabel: string;
  };
};

export const MediaFormModal: FC<MediaFormModalProps> = ({
  defaultValues,
  formIdPrefix,
  isLoading,
  isOpen,
  onClose,
  onSubmit,
  translations,
}) => {
  const formId = `${formIdPrefix}-${useId()}`;
  const mediaFormSchema = useMediaFormSchema();

  const methods = useFormController<MediaFormSchema>({
    mode: "onChange",
    schema: mediaFormSchema,
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
      size="md"
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
          <MediaFormPicture formId={formId} />
          <MediaFormTitle formId={formId} />
          <MediaFormDescription formId={formId} />
          <MediaFormPrice formId={formId} />
          <MediaFormCategory formId={formId} />
          <MediaFormLevel formId={formId} />
          <MediaFormTeachers />
          <Divider weight="extra-thin" />
          <MediaFormAvailability formId={formId} />
        </div>
      </ControlledForm>
    </Modal>
  );
};
