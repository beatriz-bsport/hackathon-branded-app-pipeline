import { type FC } from "react";

import { type Establishment } from "@bsport/api-book";
import { FormProvider } from "@bsport/form";
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

  const { methods, multiLocalization, groupItems, isPending, submit } =
    useVenueForm({ venue, mode: "onChange" });
  const { handleSubmit, formState } = methods;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleClickOutside = () => {
    if (formState.isDirty || formState.isSubmitting) return;
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
        disabled: isPending || !formState.isValid || !formState.isDirty,
      }}
      cancelButton={{ label: t("venueModal.cancel"), onClick: handleClose }}
    >
      <FormProvider {...methods}>
        <VenueFormFields
          multiLocalization={multiLocalization}
          groupItems={groupItems}
        />
      </FormProvider>
    </Modal>
  );
};
