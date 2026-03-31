import { type FC, useEffect, useId } from "react";

import type { Contract } from "@bsport/api-buyables/contract";
import { ControlledForm, useFormController } from "@bsport/form";
import { DetailsLayout, toast } from "@bsport/kaizen-primitive-core";

import { ContractDetailsSuspense } from "#src/components/contract-details-suspense";
import { ContractEditorContent } from "#src/features/contract-editor/content";
import { useContractFormSchema } from "#src/features/contract-form/schema";
import type {
  ContractFormData,
  ContractFormSchema,
} from "#src/features/contract-form/types";
import {
  transformContractIntoFormState,
  transformFormStateIntoContractAPIParams,
} from "#src/features/contract-form/utils";
import {
  useUpdateLegacyContract,
  useUpdateRevampedContract,
} from "#src/hooks/api/use-update-contract";
import { useDetailsConfig } from "#src/hooks/layout/use-details-config";
import { useIsRevampedContract } from "#src/hooks/layout/use-is-revamped-contract";
import { useTranslation } from "#src/utils/i18n";

const ContractEditorPageInner: FC = () => {
  const { t } = useTranslation("contract-details");

  // ----- LAYOUT -----

  const { detailsLayoutConfig, headerConfig, contract } = useDetailsConfig();
  const { detailsLayoutProps, toggleHasUnsavedChanges } = detailsLayoutConfig;

  // ----- EDITOR -----

  const isRevampedContract = useIsRevampedContract();

  const contractFormSchema = useContractFormSchema({
    isRevampedContract,
  });

  const methods = useFormController<ContractFormSchema>({
    mode: "onChange",
    defaultValues: transformContractIntoFormState({
      isRevampedContract,
      contract,
    }),
    schema: contractFormSchema,
    criteriaMode: "all",
  });

  // Only the final submit method should be different between the 2 versions
  const onSuccess = (updatedContract: Contract) => {
    methods.reset(
      transformContractIntoFormState({
        isRevampedContract,
        contract: updatedContract,
      }),
    );
  };

  const onError = () => {
    toast({
      status: "critical",
      icon: "alert-circle",
      title: t("editor.submit.error"),
      buttonIcon: "x-close",
    });
  };

  const { mutateAsync: updateRevampedContract } = useUpdateRevampedContract({
    onSuccess,
    onError,
  });

  const { mutateAsync: updateLegacyContract } = useUpdateLegacyContract({
    onSuccess,
    onError,
  });

  const formId = `contract-form-editor-${useId()}`;

  // ----- UPDATES MANAGEMENT -----

  // Display Confirmation
  const isDirty = methods.formState.isDirty;

  useEffect(() => {
    toggleHasUnsavedChanges(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  // Confirmation handlers

  function discardChanges() {
    methods.reset();
  }

  async function onSubmit(formState: ContractFormData) {
    try {
      if (isRevampedContract) {
        const apiData = transformFormStateIntoContractAPIParams({
          formState,
          isRevampedContract: true,
        });

        await updateRevampedContract({ ...apiData, id: contract.id });
      } else {
        const apiData = transformFormStateIntoContractAPIParams({
          formState,
          isRevampedContract: false,
        });

        await updateLegacyContract({ ...apiData, id: contract.id });
      }
    } catch (error) {
      console.error("[Form] Update failed:", error);
    }
  }

  return (
    <ControlledForm {...methods} onSubmit={onSubmit} id={formId}>
      <DetailsLayout {...detailsLayoutProps} withPanel={false}>
        <DetailsLayout.Header
          pageTitle={methods.watch("name")}
          {...headerConfig}
        />
        <ContractEditorContent
          formId={formId}
          isRevampedContract={isRevampedContract}
          methods={methods}
        />
        <DetailsLayout.Confirmation
          onDiscard={discardChanges}
          formSubmit={{
            formId,
            isSubmitting: methods.formState.isSubmitting,
          }}
        />
      </DetailsLayout>
    </ControlledForm>
  );
};

export const ContractEditorPage: FC = () => {
  return (
    <ContractDetailsSuspense>
      <ContractEditorPageInner />
    </ContractDetailsSuspense>
  );
};
