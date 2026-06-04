import { type FC } from "react";

import { type Establishment } from "@bsport/api-book";
import { FormProvider, useWatch } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { VenueFormFields } from "#src/components/venue-form-fields/venue-form-fields";
import { useVenueForm } from "#src/hooks/use-venue-form";
import { useTranslation } from "#src/utils/i18n";
import { type VenueFormValues } from "#src/utils/venue-form";

type VenueFormModalProps = {
  // When set the modal edits this venue; otherwise it creates a new one.
  venue?: Establishment | null;
  onClose: () => void;
};

export const VenueFormModal: FC<VenueFormModalProps> = ({ venue, onClose }) => {
  const { t } = useTranslation("venues-list");
  const isEdit = !!venue;

  const { methods, isPending, submit } = useVenueForm({
    venue,
    mode: "onChange",
  });
  const { control, handleSubmit, formState } = methods;
  useWatch({ control });
  const hasDirtyFields = Object.keys(formState.dirtyFields).length > 0;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleClickOutside = () => {
    if (hasDirtyFields || formState.isSubmitting) return;
    handleClose();
  };

  const onValid = async (values: VenueFormValues) => {
    try {
      await submit(values);
      handleClose();
    } catch {
      // mutation hooks handle error toasts
    }
  };

  return (
    <Modal
      open
      size="md"
      title={isEdit ? t("venueModal.editTitle") : t("venueModal.createTitle")}
      onClose={handleClose}
      onClickOutside={handleClickOutside}
      confirmButton={{
        color: "main",
        label: isEdit
          ? t("venueModal.editConfirm")
          : t("venueModal.createConfirm"),
        onClick: () => handleSubmit(onValid)(),
        disabled: isPending || !formState.isValid || !hasDirtyFields,
      }}
      cancelButton={{ label: t("venueModal.cancel"), onClick: handleClose }}
    >
      <FormProvider {...methods}>
        <VenueFormFields />
      </FormProvider>
    </Modal>
  );
};
