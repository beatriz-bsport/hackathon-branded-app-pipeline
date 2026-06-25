import { type FC, useEffect, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { ContractDetailsSuspense } from "#src/components/contract-details-suspense";
import { ContractEditorHeader } from "#src/features/contract-editor-header/header";
import { ContractEditorContent } from "#src/features/contract-editor/content";
import { ContractEditorPanel } from "#src/features/contract-editor/panel";
import { useEditorForm } from "#src/features/contract-editor/use-editor-form";
import { useContractFormSchema } from "#src/features/contract-form/schema";
import type {
  ContractFormData,
  ContractFormSchema,
} from "#src/features/contract-form/types";
import {
  transformContractIntoFormState,
  transformFormStateIntoContractAPIParams,
} from "#src/features/contract-form/utils";
import { useDetailsConfig } from "#src/hooks/layout/use-details-config";

const ContractEditorPageInner: FC = () => {
  // ----- LAYOUT -----

  const { detailsLayoutConfig, contract, benefitQuery } = useDetailsConfig();
  const { detailsLayoutProps, toggleHasUnsavedChanges } = detailsLayoutConfig;

  // ----- EDITOR -----

  const contractFormSchema = useContractFormSchema();

  const methods = useFormController<ContractFormSchema>({
    mode: "onChange",
    defaultValues: transformContractIntoFormState({
      contract,
      pass: benefitQuery.passBenefit,
      appointmentPass: benefitQuery.appointmentPassBenefit,
    }),
    schema: contractFormSchema,
    criteriaMode: "all",
  });

  const { updateRevampedContract } = useEditorForm({ methods });

  const formId = `contract-form-editor-${useId()}`;

  const isShared = contract.contract_template != null;
  const isFromMigration = !contract.editable;

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
      const apiData = transformFormStateIntoContractAPIParams({
        formState,
      });

      await updateRevampedContract({ ...apiData, id: contract.id });
    } catch (error) {
      console.error("[Form] Update failed:", error);
    }
  }

  return (
    <ControlledForm {...methods} onSubmit={onSubmit} id={formId}>
      <DetailsLayout {...detailsLayoutProps} withPanel={true}>
        <ContractEditorHeader
          methods={methods}
          contract={contract}
          isShared={isShared}
        />
        <ContractEditorContent
          formId={formId}
          methods={methods}
          isShared={isShared}
          isFromMigration={isFromMigration}
        />
        <ContractEditorPanel formId={formId} isShared={isShared} />
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
