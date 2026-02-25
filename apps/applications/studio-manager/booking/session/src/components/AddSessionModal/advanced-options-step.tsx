import { FC, useId } from "react";

import { ControlledForm, UseFormControllerOutput } from "@bsport/form";
import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { BookForAGuestField } from "../SessionForm/advanced-options/book-for-a-guest-field";
import TagSelectorForm from "../SessionForm/advanced-options/tag-selector-form";
import { SessionCreationFormAdvancedOptionsSchema } from "../SessionForm/schemas";

export const AdvancedOptionsStep: FC<{
  methods: UseFormControllerOutput<SessionCreationFormAdvancedOptionsSchema>;
}> = ({ methods }) => {
  const { t } = useTranslation("sessionCreation");
  const formId = `session-form-create-advanced-options-${useId()}`;

  return (
    <ControlledForm
      id={formId}
      {...methods}
      onSubmit={() => console.log}
      className="w-full"
    >
      <section className="flex flex-col gap-md">
        <Title htmlVariant="h5" weight="strong">
          {t("addSessionModal.steps.advancedOptions.bookForAGuest.title")}
        </Title>
        <BookForAGuestField fieldIdPrefix={formId} />
        <Divider orientation="horizontal" weight="thin" className="my-xl" />
        <TagSelectorForm fieldIdPrefix={formId} />
      </section>
    </ControlledForm>
  );
};
