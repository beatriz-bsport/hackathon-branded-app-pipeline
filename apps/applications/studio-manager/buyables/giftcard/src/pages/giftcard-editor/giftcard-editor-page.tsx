import { type FC, useEffect, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";
import { Giftcard } from "@bsport/store-buyables-giftcard";

import { GiftcardEditorHeader } from "#src/features/giftcard-editor-header";
import { useGiftcardFormSchema } from "#src/features/giftcard-form/schema";
import type { GiftcardFormSchema } from "#src/features/giftcard-form/types";
import { transformGiftcardIntoFormState } from "#src/features/giftcard-form/utils";

type GiftcardEditorPageProps = {
  giftcard: Giftcard;
};

export const GiftcardEditorPage: FC<GiftcardEditorPageProps> = ({
  giftcard,
}) => {
  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();

  const giftcardFormSchema = useGiftcardFormSchema();

  const methods = useFormController<GiftcardFormSchema>({
    // Validate new value with Zod resolver on each value change
    mode: "onChange",
    schema: giftcardFormSchema,
    defaultValues: transformGiftcardIntoFormState(giftcard),
    // Display all errors at once
    criteriaMode: "all",
  });

  const formId = `giftcard-form-editor-${useId()}`;

  // ========== CONFIRMATION ==========

  const isDirty = methods.formState.isDirty;

  useEffect(() => {
    toggleHasUnsavedChanges(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const discardChanges = () => {
    methods.reset();
  };

  const saveChanges = async () => {
    const formIsOkay = await methods.trigger();
    if (!formIsOkay) {
      console.warn("[Form] Invalid:", {
        errors: methods.formState.errors,
      });
      return;
    }
    // @todo In future PR, plug it to update endpoint
    console.info("[Form] Everything okay !");
  };

  return (
    <ControlledForm {...methods} onSubmit={() => {}} id={formId}>
      <DetailsLayout {...detailsLayoutProps} withPanel={false}>
        <GiftcardEditorHeader giftcard={giftcard} methods={methods} />

        <DetailsLayout.Content>{giftcard.name}</DetailsLayout.Content>

        <DetailsLayout.Confirmation
          onDiscard={discardChanges}
          onSave={saveChanges}
        />
      </DetailsLayout>
    </ControlledForm>
  );
};
