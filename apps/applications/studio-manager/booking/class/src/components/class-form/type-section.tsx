import { type FC } from "react";

import { useFormContext } from "@bsport/form";
import { Body, RadioButton, Title } from "@bsport/kaizen-primitive-core";

import { useClassesCreatePermissions } from "#src/hooks/use-permissions";
import type { ClassFormValues } from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

export const TypeSection: FC = () => {
  const { t } = useTranslation("add-edit-form");
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ClassFormValues>();
  const value = watch("is_workshop");
  const errorText = errors.is_workshop?.message;
  const { canCreateWorkshop, canCreateActivity } =
    useClassesCreatePermissions();

  return (
    <div className="flex flex-col gap-xl px-md mb-2xs">
      <div className="flex flex-col gap-2xs">
        <Title htmlVariant="h3" weight="strong">
          {t("addEditForm.type.title")}
        </Title>
        <Body size="sm" weight="weak" color="weak">
          {t("addEditForm.type.description")}
        </Body>
      </div>

      <div className="grid gap-md md:grid-cols-2 px-md mb-2xs">
        {canCreateActivity && (
          <RadioButton
            value="group-activity"
            checked={value === false}
            onChange={() => {
              setValue("is_workshop", false, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            label={t("addEditForm.type.groupActivity.label")}
            helperText={t("addEditForm.type.groupActivity.helper")}
            errorText={errorText}
          />
        )}
        {canCreateWorkshop && (
          <RadioButton
            value="workshop"
            checked={value === true}
            onChange={() => {
              setValue("is_workshop", true, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            label={t("addEditForm.type.workshop.label")}
            helperText={t("addEditForm.type.workshop.helper")}
            errorText={errorText}
          />
        )}
      </div>
    </div>
  );
};
