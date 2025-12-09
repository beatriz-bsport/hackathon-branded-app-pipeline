import React, { useId } from "react";
import { useNavigate } from "react-router";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { PackFormAdvanced } from "#src/components/PackForm/PackFormAdvanced";
import { PackFormContent } from "#src/components/PackForm/PackFormContent";
import { PackFormIdentity } from "#src/components/PackForm/PackFormIdentity";
import { PackFormPricing } from "#src/components/PackForm/PackFormPricing";
import { PackFormVisibility } from "#src/components/PackForm/PackFormVisibility";
import {
  DEFAULT_FORM_DATA,
  type PackFormSchema,
  usePackSchema,
} from "#src/components/PackForm/schema";
import { SelectedItemsContextProvider } from "#src/contexts/selectedItemsContext";
import { useCreatePack } from "#src/hooks/useCreatePack";
import { URLS } from "#src/urls";
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

  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const packSchema = usePackSchema();

  const methods = useFormController<PackFormSchema>({
    mode: "onBlur",
    schema: packSchema,
    defaultValues: DEFAULT_FORM_DATA,
  });

  const formId = `pack-form-create-${useId()}`;

  const passes = methods.watch("payment_pack_ids");
  const appointmentPasses = methods.watch("private_pass_ids");
  const webshopItems = methods.watch("shop_item_ids");

  const hasSelectedItems =
    passes.length + appointmentPasses.length + webshopItems.length > 0;

  const navigate = useNavigate();

  const { createPack } = useCreatePack({
    onSuccess: (value) => {
      onClose();
      navigate(URLS.DETAILS(value.id));
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
        <ControlledForm
          id={formId}
          onSubmit={(data) => {
            const finalData = {
              ...DEFAULT_FORM_DATA,
              ...data,
              payment_pack_ids: passes,
              private_pass_ids: appointmentPasses,
              shop_item_ids: webshopItems,
            };
            createPack(finalData);
          }}
          {...methods}
        >
          <div className="flex flex-col gap-lg w-full">
            <PackFormIdentity fieldIdPrefix={formId} />
            <PackFormContent fieldIdPrefix={formId} />
            <PackFormPricing fieldIdPrefix={formId} methods={methods} />
            <PackFormVisibility fieldIdPrefix={formId} methods={methods} />
            <PackFormAdvanced fieldIdPrefix={formId} />
          </div>
        </ControlledForm>
      </SelectedItemsContextProvider>
    </Modal>
  );
};
