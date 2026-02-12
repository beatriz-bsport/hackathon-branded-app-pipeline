import { FC, useEffect, useId } from "react";

import { SessionWithActivity } from "@bsport/api-book";
import { ControlledForm, useFormController } from "@bsport/form";
import {
  DetailsLayout,
  Divider,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { Title } from "@bsport/kaizen-primitive-core";

import { BookForAGuestField } from "#src/components/SessionForm/advanced-options/book-for-a-guest-field";
import TagSelectorForm from "#src/components/SessionForm/advanced-options/tag-selector-form";
import { useSessionEditSchema } from "#src/components/SessionForm/schemas";
import { EstablishmentSection } from "#src/components/SessionForm/teacher-and-establishment/establishment-section";
import { TeacherSection } from "#src/components/SessionForm/teacher-and-establishment/teacher-section";
import { Header } from "#src/components/session-details/header";
import { fromSessionToFormData } from "#src/components/update-session-form/mapper";
import useEditSession from "#src/hooks/session-api/session-actions/use-edit-session";
import { useSessionPayload } from "#src/hooks/use-session-payload";
import { useTranslation } from "#src/utils/i18n";

import { VisibilitySelector } from "../SessionForm/Details/VisibilitySelector";
import DetailsForm from "./details-form";
import { SettingsSection } from "./settings-section";
import { TimeAndDateSection } from "./time-and-date-section";

type PropsType = { session: SessionWithActivity };

const UpdateSessionForm: FC<PropsType> = ({ session }) => {
  const { t } = useTranslation("sessionEdit");
  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();

  const { buildEditionPayload } = useSessionPayload();

  const { sessionEditSchema } = useSessionEditSchema();

  const { mutateAsync: editSession } = useEditSession();
  const methods = useFormController({
    schema: sessionEditSchema,
    mode: "onSubmit",
    defaultValues: fromSessionToFormData(session),
  });

  const isDirty = Object.keys(methods.formState.dirtyFields).length > 0;

  const formId = `session-form-update-${useId()}`;

  useEffect(() => {
    toggleHasUnsavedChanges(isDirty);
  }, [isDirty, toggleHasUnsavedChanges]);

  const resetForm = () => {
    methods.reset();
  };

  const handleSubmit = async () => {
    await editSession({
      sessionId: session.id,
      payload: buildEditionPayload(methods.getValues(), session),
    });

    methods.reset(methods.getValues());
  };

  return (
    <ControlledForm {...methods} onSubmit={console.log} id={formId}>
      <DetailsLayout {...detailsLayoutProps} withPanel>
        <Header session={session} />
        <DetailsLayout.Content className="max-w-none">
          <SettingsSection
            fieldIdPrefix={formId}
            metaActivity={session.meta_activity}
          />
          <TeacherSection
            fieldIdPrefix={formId}
            coach={session.coach}
            coachPayrollRule={session.coach_payment_rule_id}
          />
          <EstablishmentSection
            fieldIdPrefix={formId}
            establishmentId={session.establishment}
            roomBlueprintId={session.room_blueprint}
            metaActivity={session.meta_activity}
          />
          <TimeAndDateSection fieldIdPrefix={formId} isEditMode />
        </DetailsLayout.Content>
        <DetailsLayout.Panel>
          <div className="flex flex-col gap-lg pb-xl">
            <div className="flex flex-col gap-xs">
              <Title htmlVariant="h5" weight="strong">
                {t("editSessionForm.content.visibilitySelector.title")}
              </Title>
              <VisibilitySelector
                fieldIdPrefix={formId}
                fieldName="manager_only"
                title={t("editSessionForm.content.visibilitySelector.label")}
                buttonClassName="w-full max-w-component-select"
              />
              <BookForAGuestField fieldIdPrefix={formId} />
            </div>
            <Divider orientation="horizontal" weight="thin" />
            <DetailsForm fieldIdPrefix={formId} />
            <Divider orientation="horizontal" weight="thin" />
            <TagSelectorForm fieldIdPrefix={formId} />
          </div>
        </DetailsLayout.Panel>
        <DetailsLayout.Confirmation
          onDiscard={resetForm}
          onSave={handleSubmit}
        />
      </DetailsLayout>
    </ControlledForm>
  );
};

export default UpdateSessionForm;
