import { type FC, useId } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import { Modal, TextField, toast } from "@bsport/kaizen-primitive-core";

import { FormNumberField } from "#src/components/form/number-field";
import { i18nInstance, useTranslation } from "#src/i18n";

import {
  type BookkeepingAccountFormData,
  type BookkeepingAccountSchema,
  DATA_CONSTRAINTS,
  useBookkeepingAccountCreateSchema,
} from "./schema";
import {
  type UseCreateBookkeepingAccountParams,
  useCreateBookkeepingAccount,
} from "./use-create-bookkeeping-account";

const ERROR_CODE_ACCOUNT_NAME_MUST_BE_UNIQUE = 1;

export type BookkeepingAccountModalCreatorProps = {
  isOpen: boolean;
  closeModal: () => void;
} & UseCreateBookkeepingAccountParams;

export const BookkeepingAccountModalCreator: FC<
  BookkeepingAccountModalCreatorProps
> = ({ isOpen, closeModal, fetch, onError, onSuccess }) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  const bookkeepingAccountNameSchema = useBookkeepingAccountCreateSchema();

  const methods = useFormController<BookkeepingAccountSchema>({
    mode: "onChange",
    schema: bookkeepingAccountNameSchema,
    defaultValues: {
      accountName: "",
      accountNumber: "",
      vatRate: 0,
    },
  });

  const { isValid, isDirty, isSubmitting } = methods.formState;

  const formId = `bookkeeping-account-create-modal-${useId()}`;

  const onClose = () => {
    closeModal();
    methods.reset();
  };

  const onClickOutside = () => {
    if (isDirty || isSubmitting) return;

    onClose();
  };

  const { mutateAsync: createAccount, isPending } = useCreateBookkeepingAccount(
    {
      fetch,
      onSuccess: (params) => {
        onSuccess?.(params);

        toast({
          status: "positive",
          title: t("bookkeepingAccount.createModal.success"),
          icon: "check",
        });

        onClose();
      },
      onError: (params) => {
        onError?.(params);

        const isNameMustBeUniqueError =
          "statusCode" in params.error &&
          params.error.statusCode === 499 &&
          params.error?.customErrorCodes.length > 0 &&
          params.error?.customErrorCodes[0] ===
            ERROR_CODE_ACCOUNT_NAME_MUST_BE_UNIQUE;

        const errorText = isNameMustBeUniqueError
          ? t("bookkeepingAccount.createModal.errors.accountNameMustBeUnique")
          : t("bookkeepingAccount.createModal.errors.generic");

        toast({
          status: "critical",
          title: errorText,
          icon: "alert-circle",
        });
      },
    },
  );

  const onSubmit = async (data: BookkeepingAccountFormData) => {
    await createAccount({
      account_name: data.accountName,
      account_number: data.accountNumber,
      vat_rate: String(
        data.vatRate.toFixed(DATA_CONSTRAINTS.VAT_RATE_MAX_DIGITS),
      ),
    });
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("bookkeepingAccount.createModal.buttons.save"),
        color: "main",
        form: formId,
        type: "submit",
        disabled: !isValid || isSubmitting || isPending,
      }}
      cancelButton={{
        label: t("bookkeepingAccount.createModal.buttons.close"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
      title={t("bookkeepingAccount.createModal.title")}
      size="md"
      onClickOutside={onClickOutside}
    >
      <div onSubmit={(e) => e.stopPropagation()}>
        <ControlledForm
          id={formId}
          onSubmit={onSubmit}
          {...methods}
          className="gap-sm flex flex-col"
        >
          <FormField<BookkeepingAccountFormData, "accountNumber">
            name="accountNumber"
            mapProps={({ defaultProps, field, form }) => ({
              ...defaultProps,
              helperText: `${field.value.length}/${DATA_CONSTRAINTS.ACCOUNT_NUMBER_MAX_LENGTH}`,
              onClear: () => {
                form.setValue("accountNumber", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              },
            })}
          >
            <TextField
              id={`${formId}-account-number`}
              label={t("bookkeepingAccount.createModal.fields.accountNumber")}
              required
              fullWidth
              maxLength={DATA_CONSTRAINTS.ACCOUNT_NUMBER_MAX_LENGTH}
            />
          </FormField>

          <FormField<BookkeepingAccountFormData, "accountName">
            name="accountName"
            mapProps={({ defaultProps, field, form }) => ({
              ...defaultProps,
              helperText: `${field.value.length}/${DATA_CONSTRAINTS.ACCOUNT_NAME_MAX_LENGTH}`,
              onClear: () => {
                form.setValue("accountName", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              },
            })}
          >
            <TextField
              id={`${formId}-account-name`}
              label={t("bookkeepingAccount.createModal.fields.accountName")}
              required
              fullWidth
              maxLength={DATA_CONSTRAINTS.ACCOUNT_NAME_MAX_LENGTH}
            />
          </FormField>

          <FormNumberField<BookkeepingAccountFormData, "vatRate">
            fieldName="vatRate"
            id={`${formId}-vat-rate`}
            step={0.001}
            min={DATA_CONSTRAINTS.VAT_RATE_MIN}
            max={DATA_CONSTRAINTS.VAT_RATE_MAX}
            suffix={{ type: "text", value: "%" }}
            fullWidth
          />
        </ControlledForm>
      </div>
    </Modal>
  );
};
