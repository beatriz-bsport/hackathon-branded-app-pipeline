import { type FC } from "react";

import { useFieldArray, useFormContext } from "@bsport/form";
import { TagSelector } from "@bsport/kaizen-business-components/cdp/tag-selector";
import { Body, Button, Toggle } from "@bsport/kaizen-primitive-core";

import {
  type ClassFormValues,
  defaultCustomRestrictionRule,
  fieldIdPrefix,
} from "#src/utils/class-form";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { FormSection, FormSectionHeader } from "./class-form.shared";
import { FormTimeInputRow } from "./form-time-input-row";

const MAX_RULES = 3;

export const CustomRestrictionsSection: FC = () => {
  const { t } = useTranslation("add-edit-form");
  const { control } = useFormContext<ClassFormValues>();
  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: "custom_restriction_rule",
  });

  const isEnabled = fields.length > 0;

  return (
    <FormSection>
      <FormSectionHeader title={t("addEditForm.customRestrictions.title")} />
      <Toggle
        id={`${fieldIdPrefix}-custom-restrictions`}
        label={t("addEditForm.customRestrictions.toggleLabel")}
        checked={isEnabled}
        onToggleChange={(checked) => {
          if (checked) {
            append(defaultCustomRestrictionRule);
          } else {
            replace([]);
          }
        }}
      />
      {isEnabled && (
        <div className="flex flex-col gap-md items-start w-full">
          {fields.map((field, fieldIndex) => (
            <FormSection key={field.id}>
              <div className="flex flex-col gap-lg w-full px-md pt-md pb-lg bg-surface-page-navigation rounded-sm">
                <div className="flex items-center justify-between w-full">
                  <FormSectionHeader
                    level="h5"
                    title={t("addEditForm.customRestrictions.ruleTitle", {
                      index: fieldIndex + 1,
                    })}
                  />
                  <Button
                    kind="icon-button"
                    label={t("addEditForm.customRestrictions.remove")}
                    size="md"
                    color="critical"
                    intent="flat"
                    onClick={() => remove(fieldIndex)}
                    icon="trash-01"
                  />
                </div>
                <div className="flex flex-col gap-sm">
                  {/*improvements: tag selector might benefit from also having a label (expanding this tag selector component)*/}
                  <Body htmlVariant="p" size="md">
                    {t("addEditForm.customRestrictions.applyTo")}
                  </Body>
                  <TagSelector
                    fieldName={`custom_restriction_rule.${fieldIndex}.tags`}
                    multiSelect
                    fetch={fetch}
                    placeholder={t(
                      "addEditForm.customRestrictions.tagsPlaceholder",
                    )}
                    className="w-full max-w-none"
                    fullWidth
                  />
                </div>

                <div className="flex flex-col gap-sm w-[360px]">
                  <FormSectionHeader
                    level="h5"
                    title={t("addEditForm.bookingWindow.opening.title")}
                    description={t(
                      "addEditForm.bookingWindow.opening.description",
                    )}
                  />
                  <FormTimeInputRow
                    idPrefix={`${fieldIdPrefix}-custom-rule-${fieldIndex}-opening`}
                    fieldName={`custom_restriction_rule.${fieldIndex}.first_booking_minutes_until`}
                  />
                </div>

                <div className="flex flex-col gap-sm w-[360px]">
                  <FormSectionHeader
                    level="h5"
                    title={t("addEditForm.bookingWindow.closing.title")}
                    description={t(
                      "addEditForm.bookingWindow.closing.description",
                    )}
                  />
                  <FormTimeInputRow
                    idPrefix={`${fieldIdPrefix}-custom-rule-${fieldIndex}-closing`}
                    fieldName={`custom_restriction_rule.${fieldIndex}.last_booking_minutes`}
                  />
                </div>

                <div className="flex flex-col gap-sm w-[360px]">
                  <FormSectionHeader
                    level="h5"
                    title={t("addEditForm.bookingWindow.cancellation.title")}
                    description={t(
                      "addEditForm.bookingWindow.cancellation.description",
                    )}
                  />
                  <FormTimeInputRow
                    idPrefix={`${fieldIdPrefix}-custom-rule-${fieldIndex}-cancellation`}
                    fieldName={`custom_restriction_rule.${fieldIndex}.last_discard_minutes`}
                  />
                </div>
              </div>
            </FormSection>
          ))}

          {fields.length < MAX_RULES ? (
            <div className="flex flex-col gap-2xs items-start">
              <Button
                label={t("addEditForm.customRestrictions.addRule")}
                iconLeft="plus"
                intent="default"
                color="main"
                size="md"
                onClick={() => append(defaultCustomRestrictionRule)}
              />
              <Body size="sm" color="weak">
                {t("addEditForm.customRestrictions.maxHint", {
                  max: MAX_RULES,
                })}
              </Body>
            </div>
          ) : (
            <Body size="sm" color="weak">
              {t("addEditForm.customRestrictions.maxReached", {
                max: MAX_RULES,
              })}
            </Body>
          )}
        </div>
      )}
    </FormSection>
  );
};
