import { type FC, useMemo } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { FormMediaField } from "@bsport/kaizen-business-components/form/media-field";
import {
  Body,
  Divider,
  RadioButton,
  Select,
  type SelectProps,
  TextArea,
  type TextAreaProps,
  TextField,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { useClassesCreatePermissions } from "#src/hooks/use-permissions";
import useSCT from "#src/hooks/use-sct";
import { type ClassFormValues, fieldIdPrefix } from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

import { FormSection } from "../shared/form-section";

export const BasicInfoSection: FC = () => {
  const { t } = useTranslation("add-edit-form");
  const { sctMap } = useSCT();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ClassFormValues>();
  const isWorkshop = watch("is_workshop");
  const errorText = errors.is_workshop?.message;
  const { canCreateWorkshop, canCreateActivity } =
    useClassesCreatePermissions();

  const categoryItems = useMemo(
    () => [
      {
        id: "",
        label: t("addEditForm.basicInfo.category.placeholder"),
        disabled: true,
      },
      ...Array.from(sctMap.entries()).map(([id, label]) => ({
        id: String(id),
        label,
      })),
    ],
    [sctMap, t],
  );

  return (
    <FormSection>
      <div className="flex flex-col gap-md">
        <Body size="md">
          <Body htmlVariant="span">
            {t("addEditForm.basicInfo.typeQuestion")}{" "}
          </Body>
          <Body htmlVariant="span" color="critical">
            *
          </Body>
        </Body>
        <div className="grid gap-md md:grid-cols-2 px-md">
          {canCreateActivity && (
            <RadioButton
              value="group-activity"
              checked={isWorkshop === false}
              onChange={() => {
                setValue("is_workshop", false, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              label={t("addEditForm.basicInfo.groupActivity.label")}
              helperText={t("addEditForm.basicInfo.groupActivity.helper")}
              errorText={errorText}
            />
          )}
          {canCreateWorkshop && (
            <RadioButton
              value="workshop"
              checked={isWorkshop === true}
              onChange={() => {
                setValue("is_workshop", true, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              label={t("addEditForm.basicInfo.workshop.label")}
              helperText={t("addEditForm.basicInfo.workshop.helper")}
              errorText={errorText}
            />
          )}
        </div>
      </div>

      <FormField<ClassFormValues, "name", TextFieldProps>
        name="name"
        mapProps={({ form, defaultProps }) => ({
          ...defaultProps,
          onClear: () =>
            form.setValue("name", "", {
              shouldDirty: true,
              shouldValidate: true,
            }),
        })}
      >
        <TextField
          id={`${fieldIdPrefix}-name`}
          label={t("addEditForm.basicInfo.name.label")}
          placeholder={t("addEditForm.basicInfo.name.placeholder")}
          required
          fullWidth
        />
      </FormField>

      <div className="w-[320px]">
        <FormField<ClassFormValues, "SCT", SelectProps>
          name="SCT"
          mapProps={({ form, defaultProps, fieldState }) => ({
            ...defaultProps,
            onChange: (id) => {
              form.setValue("SCT", id, {
                shouldValidate: true,
                shouldDirty: true,
              });
            },
            status: fieldState.error ? "critical" : "default",
            errorText: fieldState.error?.message,
          })}
        >
          <Select
            id={`${fieldIdPrefix}-category-select`}
            label={t("addEditForm.basicInfo.category.label")}
            size="md"
            required
            items={categoryItems}
            helperText={t("addEditForm.basicInfo.category.helper")}
            fullWidth
          />
        </FormField>
      </div>

      <FormField<
        ClassFormValues,
        "description",
        TextAreaProps
      > name="description">
        <TextArea
          id={`${fieldIdPrefix}-description`}
          label={t("addEditForm.basicInfo.descriptionField.label")}
          placeholder={t("addEditForm.basicInfo.descriptionField.placeholder")}
          helperText={t("addEditForm.basicInfo.descriptionField.helper")}
          required
        />
      </FormField>

      <Divider orientation="horizontal" weight="thin" />

      <div className="flex flex-col gap-2xs">
        <Body weight="strong">{t("addEditForm.basicInfo.image.label")}</Body>
        <Body size="sm" weight="weak" color="weak">
          {t("addEditForm.basicInfo.image.description")}
        </Body>
        <FormMediaField<ClassFormValues, "cover_main">
          id={`${fieldIdPrefix}-image-upload`}
          fieldName="cover_main"
          inputName="add-class-image-uploader"
          fileExtensionList={["image/*"]}
          customTexts={{
            fileExtensionList: t("addEditForm.basicInfo.image.recommendation"),
          }}
        />
      </div>

      <div className="w-[320px] flex flex-col gap-2xs">
        <FormField<ClassFormValues, "color", TextFieldProps>
          name="color"
          mapProps={({ form, defaultProps }) => ({
            ...defaultProps,
            onClear: () =>
              form.setValue("color", "", {
                shouldDirty: true,
                shouldValidate: true,
              }),
          })}
        >
          <TextField
            type="color"
            id={`${fieldIdPrefix}-color`}
            label={t("addEditForm.basicInfo.color.label")}
            placeholder={t("addEditForm.basicInfo.color.placeholder")}
            helperText={t("addEditForm.basicInfo.color.description")}
            fullWidth
          />
        </FormField>
      </div>
    </FormSection>
  );
};
