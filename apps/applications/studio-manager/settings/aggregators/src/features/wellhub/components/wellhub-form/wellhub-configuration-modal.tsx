import { useEffect, useId, useMemo } from "react";

import { type PartnershipAccount } from "@bsport/api-book";
import { type Establishment } from "@bsport/api-book";
import { ControlledForm, FormField, useFormController } from "@bsport/form";
import {
  Body,
  Modal,
  TextField,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { EstablishmentField } from "#src/features/partnership-aggregator/components/establishment-field";
import { SelectedEstablishmentsList } from "#src/features/partnership-aggregator/components/selected-establishments-list";
import { useAggregatorAccounts } from "#src/features/partnership-aggregator/hooks/use-aggregator-accounts";
import { useCreateWellhubAccount } from "#src/features/wellhub/hooks/use-create-wellhub-account";
import { useValidateWellhubExternalId } from "#src/features/wellhub/hooks/use-validate-wellhub-external-id";
import { useTranslation } from "#src/utils/i18n";
import { useDebouncedValue } from "#src/utils/use-debounced-value";

import {
  DEFAULT_FORM_DATA,
  type WellhubFormSchema,
  useWellhubFormSchema,
} from "./schema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  account?: PartnershipAccount;
  partnershipId: number;
  establishments: Establishment[];
  onEditSubmit?: (values: WellhubFormSchema) => Promise<void> | void;
  isExternalSubmitting?: boolean;
};

export const WellhubConfigurationModal = ({
  isOpen,
  onClose,
  mode,
  account,
  partnershipId,
  establishments,
  onEditSubmit,
  isExternalSubmitting = false,
}: Props) => {
  const { t } = useTranslation("common");
  const schema = useWellhubFormSchema();

  // Establishments already owned by other accounts are greyed out to prevent cross-account conflicts
  const { data: accounts } = useAggregatorAccounts(partnershipId);
  const allLinkedIds = new Set(
    accounts.flatMap((a) => a.establishments.map((e) => e.id)),
  );
  const disabledEstablishmentIds: Set<number> =
    mode === "edit" && account
      ? new Set(
          [...allLinkedIds].filter(
            (id) => !account.establishments.some((e) => e.id === id),
          ),
        )
      : allLinkedIds;

  const formId = `wellhub-form-${useId()}`;

  const defaultValues = useMemo<WellhubFormSchema>(
    () =>
      mode === "edit" && account
        ? {
            externalId: account.external_id,
            establishmentIds: account.establishments.map((e) => e.id),
          }
        : DEFAULT_FORM_DATA,
    [account, mode],
  );
  const initialSelectedIds = defaultValues.establishmentIds;

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
    useCreateWellhubAccount(partnershipId);
  const isMutationPending = isCreating || isExternalSubmitting;

  const watchedExternalId = methods.watch("externalId");
  const validExternalId =
    mode === "create" && /^\d+$/.test(watchedExternalId.trim())
      ? watchedExternalId.trim()
      : "";
  const debouncedValidExternalId = useDebouncedValue(validExternalId);
  const validateState = useValidateWellhubExternalId(
    partnershipId,
    debouncedValidExternalId,
  );

  useEffect(() => {
    if (!isOpen) return;
    methods.reset(defaultValues);
  }, [defaultValues, isOpen, methods]);

  const handleClose = () => {
    if (isSubmitting || isMutationPending) return;
    methods.reset(defaultValues);
    onClose();
  };

  const handleClickOutside = () => {
    if (isDirty || isSubmitting || isMutationPending) return;
    handleClose();
  };

  const handleSubmit = async (data: WellhubFormSchema) => {
    if (mode === "create") {
      await createAccount({
        externalId: data.externalId,
        establishmentIds: data.establishmentIds,
      });
      onClose();
      return;
    }
    if (onEditSubmit) await onEditSubmit(data);
  };

  const title =
    mode === "create"
      ? t("wellhub.modal.title.create")
      : t("wellhub.modal.title.edit", { externalId: account?.external_id });

  const selectedIds = methods.watch("establishmentIds");
  const isCreateSubmitBlocked =
    mode === "create" && (!validateState.isValid || validateState.isValidating);

  return (
    <Modal
      open={isOpen}
      size="md"
      title={title}
      onClose={handleClose}
      onClickOutside={handleClickOutside}
      confirmButton={{
        color: "main",
        label: t("wellhub.modal.actions.save"),
        type: "submit",
        form: formId,
        disabled:
          !isValid ||
          !isDirty ||
          isSubmitting ||
          isMutationPending ||
          isCreateSubmitBlocked,
      }}
      cancelButton={{
        label: t("wellhub.modal.actions.cancel"),
        onClick: handleClose,
      }}
    >
      <ControlledForm id={formId} onSubmit={handleSubmit} {...methods}>
        <div className="flex flex-col gap-md">
          <Body size="md" color="weak">
            {t("wellhub.modal.helper")}
          </Body>
          <FormField<WellhubFormSchema, "externalId", TextFieldProps>
            name="externalId"
            mapProps={({ field, fieldState }) => {
              const zodError = fieldState.error?.message;

              const isExternalIdValid =
                mode === "create" &&
                !validateState.isValidating &&
                validateState.hasChecked &&
                validateState.isValid;

              const externalIdError =
                mode === "create" &&
                !validateState.isValidating &&
                validateState.hasChecked &&
                !validateState.isValid
                  ? t("wellhub.form.errors.externalIdUnavailable")
                  : undefined;

              const errorMessage = zodError ?? externalIdError;

              return {
                value: field.value,
                onChange: field.onChange,
                onClear: () => field.onChange(""),
                status: errorMessage
                  ? "error"
                  : isExternalIdValid
                    ? "positive"
                    : "default",
                statusText: errorMessage,
                disabled: mode === "edit",
                fullWidth: true,
              };
            }}
          >
            <TextField
              id={`${formId}-external-id`}
              label={t("wellhub.form.fields.externalId.label")}
              placeholder={t("wellhub.form.fields.externalId.placeholder")}
              helperText={
                mode === "create" && validateState.isValidating
                  ? t("wellhub.form.fields.externalId.validating")
                  : mode === "create" &&
                      validateState.hasChecked &&
                      validateState.isValid
                    ? t("wellhub.form.fields.externalId.valid")
                    : t("wellhub.form.fields.externalId.helper")
              }
            />
          </FormField>
          <EstablishmentField
            label={t("wellhub.form.fields.establishments.label")}
            placeholder={t("wellhub.form.fields.establishments.placeholder")}
            establishments={establishments}
            disabledEstablishmentIds={disabledEstablishmentIds}
            fieldIdPrefix={formId}
            initialSelectedIds={initialSelectedIds}
            selectorKey={selectorKey}
          />
          <SelectedEstablishmentsList
            namespace="wellhub"
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
