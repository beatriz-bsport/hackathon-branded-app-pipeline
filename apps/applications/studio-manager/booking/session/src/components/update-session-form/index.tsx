import { FC, useEffect, useId } from "react";

import { SessionWithActivity } from "@bsport/api-book";
import { ControlledForm, useFormController } from "@bsport/form";
import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";

import { SessionDetails } from "#src/components/SessionForm/Details/SessionDetails";
import { SessionTimeAndDate } from "#src/components/SessionForm/TimeAndDate/SessionTimeAndDate";
import { BookForAGuestField } from "#src/components/SessionForm/advanced-options/book-for-a-guest-field";
import TagSelectorForm from "#src/components/SessionForm/advanced-options/tag-selector-form";
import { useSessionEditSchema } from "#src/components/SessionForm/schemas";
import { SessionTeacherAndEstablishment } from "#src/components/SessionForm/teacher-and-establishment/teacher-and-establishment";
import { Header } from "#src/components/session-details/header";
import { fromSessionToFormData } from "#src/components/update-session-form/mapper";
import useEditSession from "#src/hooks/session-api/session-actions/use-edit-session";
import { useSessionPayload } from "#src/hooks/use-session-payload";

import { SettingsSection } from "./settings-section";

type PropsType = { session: SessionWithActivity };

const UpdateSessionForm: FC<PropsType> = ({ session }) => {
  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();

  const { buildEditionPayload } = useSessionPayload();

  const { sessionEditSchema } = useSessionEditSchema();

  const { mutateAsync: editSession } = useEditSession();
  const methods = useFormController({
    schema: sessionEditSchema,
    mode: "onSubmit",
    defaultValues: fromSessionToFormData(session),
  });

  const isDirty = methods.formState.isDirty;

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
          <SessionDetails fieldIdPrefix={formId} />
          <SessionTimeAndDate fieldIdPrefix={formId} />
          <SessionTeacherAndEstablishment fieldIdPrefix={formId} />
        </DetailsLayout.Content>
        <DetailsLayout.Panel>
          <BookForAGuestField fieldIdPrefix={formId} />
          <TagSelectorForm fieldIdPrefix={formId} />
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
