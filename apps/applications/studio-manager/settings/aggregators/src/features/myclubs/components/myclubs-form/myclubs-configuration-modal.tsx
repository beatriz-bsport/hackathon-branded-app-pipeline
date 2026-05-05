import { useEffect, useId, useMemo, useState } from "react";

import { type PartnershipAccount } from "@bsport/api-book";
import { type Establishment } from "@bsport/api-core";
import { ControlledForm, useFormController } from "@bsport/form";
import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useCreateMyclubsAccount } from "#src/features/myclubs/hooks/use-create-myclubs-account";
import { useTranslation } from "#src/utils/i18n";

import { MyclubsEstablishmentField } from "./myclubs-establishment-field";
import { MyclubsSuccessStep } from "./myclubs-success-step";
import {
  DEFAULT_FORM_DATA,
  type MyclubsFormSchema,
  useMyclubsFormSchema,
} from "./schema";
import { SelectedEstablishmentsList } from "./selected-establishments-list";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  account?: PartnershipAccount;
  partnershipId: number;
  establishments: Establishment[];
  disabledEstablishmentIds: Set<number>;
  onEditSubmit?: (values: MyclubsFormSchema) => Promise<void> | void;
  isExternalSubmitting?: boolean;
};

export const MyclubsConfigurationModal = ({
  isOpen,
  onClose,
  mode,
  account,
  partnershipId,
  establishments,
  disabledEstablishmentIds,
  onEditSubmit,
  isExternalSubmitting = false,
}: Props) => {
  const { t } = useTranslation("common");
  const schema = useMyclubsFormSchema();
  const formId = `myclubs-form-${useId()}`;
  const [createdAccount, setCreatedAccount] =
    useState<PartnershipAccount | null>(null);

  const isSuccessStep = mode === "create" && createdAccount !== null;

  const defaultValues = useMemo<MyclubsFormSchema>(
    () =>
      mode === "edit" && account
        ? { establishmentIds: account.establishments.map((e) => e.id) }
        : DEFAULT_FORM_DATA,
    [account, mode],
  );
  const initialSelectedIds = defaultValues.establishmentIds;

  // force remount - makes the component re-read defaultSelectedIds and seed the correct establishments for the account being edited
  const selectorKey = isOpen
    ? mode === "edit" && account
      ? `open-edit-${account.id}`
      : "open-create"
    : "closed";

  const methods = useFormController<typeof schema>({
    mode: "onChange",
    schema,
    defaultValues,
  });

  const { isDirty, isValid, isSubmitting } = methods.formState;

  const { mutateAsync: createAccount, isPending: isCreating } =
    useCreateMyclubsAccount(partnershipId);

  const isMutationPending = isCreating || isExternalSubmitting;

  useEffect(() => {
    if (!isOpen) return;
    methods.reset(defaultValues);
    setCreatedAccount(null);
  }, [defaultValues, isOpen, methods]);

  const handleClose = () => {
    methods.reset(defaultValues);
    setCreatedAccount(null);
    onClose();
  };

  const handleClickOutside = () => {
    if (isDirty || isSubmitting || isMutationPending) return;
    handleClose();
  };

  const handleCreateSubmit = async (data: MyclubsFormSchema) => {
    const created = await createAccount({
      establishmentIds: data.establishmentIds,
    });
    setCreatedAccount(created);
  };

  const handleSubmit = async (data: MyclubsFormSchema) => {
    if (mode === "create") {
      await handleCreateSubmit(data);
      return;
    }

    if (onEditSubmit) {
      await onEditSubmit(data);
    }
  };

  const title = isSuccessStep
    ? t("myclubs.modal.success.title")
    : mode === "create"
      ? t("myclubs.modal.title.create")
      : t("myclubs.modal.title.edit", { externalId: account?.external_id });

  const selectedIds = methods.watch("establishmentIds");

  if (isSuccessStep) {
    return (
      <Modal
        open={isOpen}
        size="md"
        title={title}
        onClose={handleClose}
        onClickOutside={handleClose}
        cancelButton={{
          label: t("myclubs.modal.actions.close"),
          onClick: handleClose,
        }}
      >
        <MyclubsSuccessStep externalId={createdAccount.external_id} />
      </Modal>
    );
  }

  return (
    <Modal
      open={isOpen}
      size="md"
      title={title}
      onClose={handleClose}
      onClickOutside={handleClickOutside}
      confirmButton={{
        color: "main",
        label: t("myclubs.modal.actions.save"),
        type: "submit",
        form: formId,
        disabled: !isValid || !isDirty || isSubmitting || isMutationPending,
      }}
      cancelButton={{
        label: t("myclubs.modal.actions.cancel"),
        onClick: handleClose,
      }}
    >
      <ControlledForm id={formId} onSubmit={handleSubmit} {...methods}>
        <div className="flex flex-col gap-md">
          <Body size="md" color="weak">
            {t("myclubs.modal.helper")}
          </Body>
          <MyclubsEstablishmentField
            establishments={establishments}
            disabledEstablishmentIds={disabledEstablishmentIds}
            fieldIdPrefix={formId}
            initialSelectedIds={initialSelectedIds}
            selectorKey={selectorKey}
          />
          <SelectedEstablishmentsList
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
