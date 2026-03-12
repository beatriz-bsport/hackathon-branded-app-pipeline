import { type FC, useEffect, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";
import { Giftcard } from "@bsport/store-buyables-giftcard";

import { GiftcardEditorHeader } from "#src/features/giftcard-editor-header";
import { GiftcardEditorContent } from "#src/features/giftcard-editor/giftcard-editor-content";
import { GiftcardEditorPanel } from "#src/features/giftcard-editor/giftcard-editor-panel";
import { useGiftcardFormSchema } from "#src/features/giftcard-form/schema";
import type { GiftcardFormSchema } from "#src/features/giftcard-form/types";
import {
  transformFormStateIntoAPIData,
  transformGiftcardIntoFormState,
} from "#src/features/giftcard-form/utils";
import { useUpdateGiftcard } from "#src/hooks/api/use-update-giftcard";

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
  const isSharedGiftcard = giftcard.is_shared_giftcard;

  // ========== CONFIRMATION ==========

  const { updateGiftcard, isUpdating } = useUpdateGiftcard({
    onSuccess: (giftcard) => {
      // Reset default state form with latest giftcard data
      methods.reset(transformGiftcardIntoFormState(giftcard));
    },
  });

  const isDirty = methods.formState.isDirty;

  useEffect(() => {
    toggleHasUnsavedChanges(!isSharedGiftcard && isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, isSharedGiftcard]);

  const discardChanges = () => {
    methods.reset();
  };

  const saveChanges = async () => {
    const formIsOkay = await methods.trigger();

    if (isUpdating) {
      console.warn("[Form] New values are being processed");
      return;
    }

    if (!formIsOkay) {
      console.warn("[Form] Invalid:", {
        errors: methods.formState.errors,
      });
      return;
    }

    const formValues = methods.getValues();
    await updateGiftcard({
      id: giftcard.id,
      data: transformFormStateIntoAPIData(formValues),
    });
  };

  return (
    <ControlledForm {...methods} onSubmit={() => {}} id={formId}>
      <DetailsLayout {...detailsLayoutProps} withPanel={true}>
        <GiftcardEditorHeader giftcard={giftcard} methods={methods} />

        <GiftcardEditorContent
          formId={formId}
          methods={methods}
          isSharedGiftcard={isSharedGiftcard}
        />

        <GiftcardEditorPanel
          formId={formId}
          isSharedGiftcard={isSharedGiftcard}
        />

        <DetailsLayout.Confirmation
          onDiscard={discardChanges}
          onSave={saveChanges}
        />
      </DetailsLayout>
    </ControlledForm>
  );
};
