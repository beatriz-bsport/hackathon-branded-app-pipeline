import { FC, useId } from "react";

import { ControlledForm, UseFormControllerOutput } from "@bsport/form";
import { Body, Divider, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { BookForAGuestField } from "../SessionForm/advanced-options/book-for-a-guest-field";
import { TagSelectorField } from "../SessionForm/advanced-options/tag-selector-field";
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
        <Title htmlVariant="h5">
          {t("addSessionModal.steps.advancedOptions.bookForAGuest.title")}
        </Title>
        <BookForAGuestField fieldIdPrefix={formId} />
        <Divider orientation="horizontal" weight="thin" className="my-xl" />
        <div className="flex flex-col gap-2xs">
          <Title htmlVariant="h5">
            {t("addSessionModal.steps.advancedOptions.tags.title")}
          </Title>
          <Body weight="weaker" size="sm">
            {t("addSessionModal.steps.advancedOptions.tags.subTitle")}
          </Body>
        </div>
        <TagSelectorField
          label={t(
            "addSessionModal.steps.advancedOptions.tags.whiteListTagsLabel",
          )}
          id={`${formId}-whitelist-tags`}
          name="whitelist_tags"
        />
        <TagSelectorField
          label={t(
            "addSessionModal.steps.advancedOptions.tags.blackListTagsLabel",
          )}
          id={`${formId}-blacklist-tags`}
          name="blacklist_tags"
        />
      </section>
    </ControlledForm>
  );
};
