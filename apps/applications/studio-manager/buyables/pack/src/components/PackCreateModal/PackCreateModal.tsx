import React, { useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { PackFormContent } from "#src/components/PackForm/PackFormContent";
import { PackFormIdentity } from "#src/components/PackForm/PackFormIdentity";
import { PackFormPricing } from "#src/components/PackForm/PackFormPricing";
import {
  DEFAULT_FORM_DATA,
  type PackFormSchema,
  usePackSchema,
} from "#src/components/PackForm/schema";
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

  const defaultValues = {
    ...DEFAULT_FORM_DATA,
    company: companyId ?? 0,
  };

  const packSchema = usePackSchema();

  const methods = useFormController<PackFormSchema>({
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

  if (!companyId) return null;

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
          const finalData = {
            ...defaultValues,
            ...data,
            payment_pack_ids: passes,
            private_pass_ids: appointmentPasses,
            shop_item_ids: webshopItems,
          };
          handleCreatePack(finalData);
        }}
        {...methods}
      >
        <div className="flex flex-col gap-lg w-full">
          <PackFormIdentity fieldIdPrefix={formId} />
          <PackFormContent fieldIdPrefix={formId} />
          <PackFormPricing fieldIdPrefix={formId} methods={methods} />
        </div>
      </ControlledForm>
    </Modal>
  );
};
