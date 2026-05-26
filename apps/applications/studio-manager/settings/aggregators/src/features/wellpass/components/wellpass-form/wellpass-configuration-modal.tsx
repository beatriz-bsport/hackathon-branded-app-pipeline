import { useEffect, useId, useMemo } from "react";

import { type Establishment, type PartnershipAccount } from "@bsport/api-book";
import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { EstablishmentField } from "#src/features/partnership-aggregator/components/establishment-field";
import { SelectedEstablishmentsList } from "#src/features/partnership-aggregator/components/selected-establishments-list";
import { useAggregatorAccounts } from "#src/features/partnership-aggregator/hooks/use-aggregator-accounts";
import { useTranslation } from "#src/utils/i18n";

import { type WellpassFormSchema, useWellpassFormSchema } from "./schema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  account: PartnershipAccount;
  partnershipId: number;
  establishments: Establishment[];
  onEditSubmit: (values: WellpassFormSchema) => Promise<void> | void;
  isExternalSubmitting?: boolean;
};

export const WellpassConfigurationModal = ({
  isOpen,
  onClose,
  account,
  partnershipId,
  establishments,
  onEditSubmit,
  isExternalSubmitting = false,
}: Props) => {
  const { t } = useTranslation("common");
  const schema = useWellpassFormSchema();

  const { data: accounts } = useAggregatorAccounts(partnershipId);
  const allLinkedIds = new Set(
    accounts.flatMap((a) => a.establishments.map((e) => e.id)),
  );
  const disabledEstablishmentIds = new Set(
    [...allLinkedIds].filter(
      (id) => !account.establishments.some((e) => e.id === id),
    ),
  );

  const formId = `wellpass-form-${useId()}`;

  const defaultValues = useMemo<WellpassFormSchema>(
    () => ({ establishmentIds: account.establishments.map((e) => e.id) }),
    [account],
  );

  const selectorKey = isOpen ? `open-edit-${account.id}` : "closed";

  const methods = useFormController<typeof schema>({
    mode: "onChange",
    schema,
    defaultValues,
  });
  const { isDirty, isValid, isSubmitting } = methods.formState;

  const isMutationPending = isExternalSubmitting;

  useEffect(() => {
    if (!isOpen) return;
    methods.reset(defaultValues);
  }, [defaultValues, isOpen, methods]);

  const handleClose = () => {
    methods.reset(defaultValues);
    onClose();
  };

  const handleClickOutside = () => {
    if (isDirty || isSubmitting || isMutationPending) return;
    handleClose();
  };

  const handleSubmit = async (data: WellpassFormSchema) => {
    await onEditSubmit(data);
  };

  const title = t("wellpass.modal.title.edit", {
    externalId: account.external_id,
  });

  const selectedIds = methods.watch("establishmentIds");

  return (
    <Modal
      open={isOpen}
      size="md"
      title={title}
      onClose={handleClose}
      onClickOutside={handleClickOutside}
      confirmButton={{
        color: "main",
        label: t("wellpass.modal.actions.save"),
        type: "submit",
        form: formId,
        disabled: !isValid || !isDirty || isSubmitting || isMutationPending,
      }}
      cancelButton={{
        label: t("wellpass.modal.actions.cancel"),
        onClick: handleClose,
      }}
    >
      <ControlledForm id={formId} onSubmit={handleSubmit} {...methods}>
        <div className="flex flex-col gap-md">
          <EstablishmentField
            label={t("wellpass.form.fields.establishments.label")}
            placeholder={t("wellpass.form.fields.establishments.placeholder")}
            establishments={establishments}
            disabledEstablishmentIds={disabledEstablishmentIds}
            fieldIdPrefix={formId}
            initialSelectedIds={defaultValues.establishmentIds}
            selectorKey={selectorKey}
          />
          <SelectedEstablishmentsList
            namespace="wellpass"
            selectedIds={selectedIds}
            establishments={establishments}
            onRemove={(id) => {
              methods.setValue(
                "establishmentIds",
                selectedIds.filter((sid) => sid !== id),
                { shouldDirty: true, shouldValidate: true },
              );
            }}
          />
        </div>
      </ControlledForm>
    </Modal>
  );
};
