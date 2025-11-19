import { type FC, useEffect, useId } from "react";
import { useNavigate } from "react-router";

import { ControlledForm, useFormController } from "@bsport/form";
import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";
import type { Pack, PackFormEditData } from "@bsport/store-buyables-pack";

import { PackDeleteModal } from "#src/components/PackDeleteModal";
import { PackEditNameModal } from "#src/components/PackEditNameModal";
import {
  type PackFormSchema,
  usePackSchema,
} from "#src/components/PackForm/schema";
import { useDisclosure } from "#src/hooks/useDisclosure";
import { useUpdatePack } from "#src/hooks/useUpdatePack";
import { URLS } from "#src/urls";

import { PackDetailsHeader } from "./PackDetailsHeader";

type PackDetailsPageProps = {
  pack: Pack;
};

const convertIntoPackFormData = (pack: Pack): PackFormEditData => {
  const {
    payment_packs,
    private_passes,
    shop_items,
    price,
    tax,
    ...initialValues
  } = pack;

  return {
    ...initialValues,
    payment_pack_ids: (payment_packs ?? []).map((pass) => pass.id),
    private_pass_ids: (private_passes ?? []).map(
      (appointmentPass) => appointmentPass.id,
    ),
    shop_item_ids: (shop_items ?? []).map((webshopItem) => webshopItem.id),
    price: parseInt(price),
    tax: parseInt(tax),
  };
};

export const PackDetailsPage: FC<PackDetailsPageProps> = ({ pack }) => {
  const { detailsLayoutProps, toggleIsPanelOpened, toggleHasUnsavedChanges } =
    useDetailsLayout();

  const navigate = useNavigate();

  const packSchema = usePackSchema();

  const methods = useFormController<PackFormSchema>({
    // Validate new value with Zod resolver on each value change
    mode: "onChange",
    schema: packSchema,
    defaultValues: convertIntoPackFormData(pack),
    // Display all errors at once
    criteriaMode: "all",
  });

  const {
    isOpen: isDeleteModalOpen,
    onClose: onCloseDeleteModal,
    onOpen: onOpenDeleteModal,
  } = useDisclosure();

  const {
    isOpen: isEditNameModalOpen,
    onClose: onCloseEditNameModal,
    onOpen: onOpenEditNameModal,
  } = useDisclosure();

  const { handleUpdatePack, isLoading: isUpdating } = useUpdatePack({
    onSuccess: (updatedPack) => {
      // Reset dirty state by updating defaultValues with the latest Pack data
      methods.reset(convertIntoPackFormData(updatedPack));
    },
  });

  const handleDiscardChanges = () => {
    if (isUpdating) {
      return;
    }
    methods.reset();
  };

  const handleSaveChanges = async () => {
    // Check whether the form is valid.
    // Don't rely on methods.formState.isValid as it's "one render behind"
    const ok = await methods.trigger();

    if (!ok || isUpdating) {
      console.warn("[Form] Invalid", methods.formState.errors);
      return;
    }

    handleUpdatePack({ ...methods.getValues(), id: pack.id });
  };

  // Whether some fields have different values compared to the default values
  const isDirty = methods.formState.isDirty;

  useEffect(() => {
    toggleHasUnsavedChanges(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const formId = `pack-form-details-${useId()}`;

  const currentFormName = methods.watch("name");

  return (
    <>
      <ControlledForm {...methods} onSubmit={console.log} id={formId}>
        <DetailsLayout {...detailsLayoutProps}>
          <PackDetailsHeader
            methods={methods}
            onDeleteClick={onOpenDeleteModal}
            onEditTitleClick={onOpenEditNameModal}
            pack={pack}
            toggleIsPanelOpened={toggleIsPanelOpened}
          />

          <DetailsLayout.Content>
            {/** Placeholder for the layout, will be removed in the next steps */}
            <h3>Pack n°{pack.id}</h3>
            {JSON.stringify(pack)}
          </DetailsLayout.Content>

          <DetailsLayout.Panel>Placeholder for Panel</DetailsLayout.Panel>

          <DetailsLayout.Confirmation
            onDiscard={handleDiscardChanges}
            onSave={handleSaveChanges}
          />
        </DetailsLayout>
      </ControlledForm>

      <PackEditNameModal
        key={currentFormName}
        initialName={currentFormName}
        isOpen={isEditNameModalOpen}
        onClose={onCloseEditNameModal}
        onConfirm={async (newName) => {
          // Update the upper form name with the inner form value
          methods.setValue("name", newName, { shouldDirty: true });
          onCloseEditNameModal();
        }}
      />

      <PackDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        packId={pack.id}
        packName={pack.name}
        onDeleteSuccess={() => navigate(URLS.INDEX)}
        onUndoSuccess={() => navigate(`${URLS.INDEX}/${URLS.DETAILS(pack.id)}`)}
      />
    </>
  );
};
