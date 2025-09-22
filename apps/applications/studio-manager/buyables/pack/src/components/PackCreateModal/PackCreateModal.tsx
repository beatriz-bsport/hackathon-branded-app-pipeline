import React, { useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { PackFormContent } from "#src/components/PackForm/PackFormContent";
import { PackFormIdentity } from "#src/components/PackForm/PackFormIdentity";
import { usePackSchema } from "#src/components/PackForm/schema";
import { useSelectedItemsContext } from "#src/contexts/selectedItemsContext";
import { useCreatePack } from "#src/hooks/useCreatePack";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type PackCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const PackCreateModal: React.FC<PackCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("details");

  const { passes, appointmentPasses, webshopItems } = useSelectedItemsContext();

  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const defaultValues: PackFormData = {
    description: "",
    name: "",
    company: companyId ?? 0,
    available: true,
    is_usable_by_staff: true,
    manager_only: false,
    payment_pack_ids: [],
    private_pass_ids: [],
    shop_item_ids: [],
    price: 0,
    tax: 0,
  };

  const packSchema = usePackSchema();

  const methods = useFormController({
    mode: "onBlur",
    schema: packSchema,
    defaultValues,
  });

  const formId = `pack-form-create-${useId()}`;
  const hasSelectedItems =
    passes.length + appointmentPasses.length + webshopItems.length > 0;

  const { handleCreatePack } = useCreatePack({
    onSuccess: (value) => {
      onClose();
      window.location.assign(LEGACY_URLS.PACK_DETAILS(value.id));
    },
  });

  return (
    <Modal
      open={isOpen}
      size="lg"
      title={t("createModal.title")}
      onClose={onClose}
      confirmButton={{
        color: "main",
        label: t("createModal.buttons.create"),
        type: "submit",
        form: formId,
        disabled:
          !methods.formState.isDirty ||
          methods.formState.isSubmitting ||
          !hasSelectedItems,
      }}
      cancelButton={{
        label: t("createModal.buttons.cancel"),
        onClick: onClose,
      }}
    >
      <ControlledForm
        id={formId}
        onSubmit={(data) => {
          handleCreatePack({
            ...defaultValues,
            ...data,
            payment_pack_ids: passes,
            private_pass_ids: appointmentPasses,
            shop_item_ids: webshopItems,
          });
        }}
        {...methods}
      >
        <div className="flex flex-col gap-lg w-full">
          <PackFormIdentity fieldIdPrefix={formId} />
          <PackFormContent fieldIdPrefix={formId} />
        </div>
      </ControlledForm>
    </Modal>
  );
};
