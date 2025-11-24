import { type FC, useEffect, useId, useState } from "react";
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
import { SelectedItemsContextProvider } from "#src/contexts/selectedItemsContext";
import { useDisclosure } from "#src/hooks/useDisclosure";
import { useUpdatePack } from "#src/hooks/useUpdatePack";
import { URLS } from "#src/urls";

import { PackDetailsContent } from "./PackDetailsContent";
import { PackDetailsHeader } from "./PackDetailsHeader";
import { PackDetailsPanel } from "./PackDetailsPanel";

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
  // Internal counter to force rerendering by injecting it into key props
  const [discardId, setDiscardId] = useState(0);

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

  const passes = methods.watch("payment_pack_ids");
  const appointmentPasses = methods.watch("private_pass_ids");
  const webshopItems = methods.watch("shop_item_ids");

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
    // All components having a key built on discardId will be rerendered
    setDiscardId((self) => self + 1);
  };

  const handleSaveChanges = async () => {
    // Check whether the form is valid.
    // Don't rely on methods.formState.isValid as it's "one render behind"
    const ok = await methods.trigger();
    const hasSelectedItems =
      passes.length + appointmentPasses.length + webshopItems.length > 0;

    if (!ok || isUpdating || !hasSelectedItems) {
      console.warn("[Form] Invalid", {
        errors: methods.formState.errors,
        missingItems: !hasSelectedItems,
      });
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

          <SelectedItemsContextProvider
            passes={passes}
            setPasses={(nextValues) => {
              methods.setValue("payment_pack_ids", nextValues, {
                shouldDirty: true,
              });
            }}
            appointmentPasses={appointmentPasses}
            setAppointmentPasses={(nextValues) => {
              methods.setValue("private_pass_ids", nextValues, {
                shouldDirty: true,
              });
            }}
            webshopItems={webshopItems}
            setWebshopItems={(nextValues) => {
              methods.setValue("shop_item_ids", nextValues, {
                shouldDirty: true,
              });
            }}
          >
            <PackDetailsContent fieldIdPrefix={formId} methods={methods} />
          </SelectedItemsContextProvider>

          <PackDetailsPanel
            discardId={discardId}
            fieldIdPrefix={formId}
            methods={methods}
          />

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
