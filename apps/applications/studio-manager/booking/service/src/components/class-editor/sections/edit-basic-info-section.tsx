import { type FC, useMemo } from "react";

import { FormField } from "@bsport/form";
import { FormMediaField } from "@bsport/kaizen-business-components/form/media-field";
import {
  AutocompleteControlled,
  type AutocompleteControlledProps,
  Body,
  TextArea,
  type TextAreaProps,
  TextField,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import useSCT from "#src/hooks/use-sct";
import { type ClassFormValues } from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

const fieldIdPrefix = "edit-class";

export const EditBasicInfoSection: FC = () => {
  const { t } = useTranslation("add-edit-form");
  const { sctMap } = useSCT();

  const categoryItems = useMemo(
    () =>
      Array.from(sctMap.entries()).map(([categoryId, label]) => ({
        id: String(categoryId),
        label,
      })),
    [sctMap],
  );
  const categoryTextfieldProps: TextFieldProps = {
    id: `${fieldIdPrefix}-category-select`,
    label: t("addEditForm.basicInfo.category.label"),
    placeholder: t("addEditForm.basicInfo.category.placeholder"),
    helperText: t("addEditForm.basicInfo.category.helper"),
    required: true,
    className: "max-w-component-select",
  };

  return (
    <div className="flex flex-col gap-lg">
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

      <div className="flex flex-col gap-2xs">
        <Body weight="strong">{t("addEditForm.basicInfo.image.label")}</Body>
        <Body size="sm" weight="weak" color="weak">
          {t("addEditForm.basicInfo.image.description")}
        </Body>
        <FormMediaField<ClassFormValues, "cover_main">
          id={`${fieldIdPrefix}-image-upload`}
          fieldName="cover_main"
          inputName="edit-class-image-uploader"
          fileExtensionList={["image/*"]}
          customTexts={{
            fileExtensionList: t("addEditForm.basicInfo.image.recommendation"),
          }}
        />
      </div>

      <FormField<ClassFormValues, "alt_cover_main", TextFieldProps>
        name="alt_cover_main"
        mapProps={({ form, defaultProps }) => ({
          ...defaultProps,
          onClear: () =>
            form.setValue("alt_cover_main", "", {
              shouldDirty: true,
              shouldValidate: true,
            }),
        })}
      >
        <TextField
          id={`${fieldIdPrefix}-alt-text`}
          label={t("addEditForm.basicInfo.altText.label")}
          placeholder={t("addEditForm.basicInfo.altText.placeholder")}
          helperText={t("addEditForm.basicInfo.altText.helper")}
          fullWidth
        />
      </FormField>

      <div className="w-[320px]">
        <FormField<ClassFormValues, "SCT", AutocompleteControlledProps>
          name="SCT"
          mapProps={({ form, field, fieldState }) => ({
            value: field.value ? [field.value] : [],
            onChange: (selectedCategoryIds) => {
              form.setValue("SCT", selectedCategoryIds[0] ?? "", {
                shouldValidate: true,
                shouldDirty: true,
              });
            },
            textfieldProps: {
              ...categoryTextfieldProps,
              status: fieldState.error ? "error" : "default",
              statusText: fieldState.error?.message,
            },
          })}
        >
          {/** @ts-expect-error Props are provided by FormField. */}
          <AutocompleteControlled
            items={categoryItems}
            fullWidth
            menuProps={{
              className: "max-h-component-select overflow-y-auto",
            }}
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
          helperText={t("addEditForm.basicInfo.descriptionField.helper")}
          placeholder={t("addEditForm.basicInfo.descriptionField.placeholder")}
          required
        />
      </FormField>

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
            fullWidth
          />
        </FormField>
      </div>
    </div>
  );
};
