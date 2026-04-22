import { type FC, useMemo } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { FormMediaField } from "@bsport/kaizen-business-components/form/media-field";
import {
  Select,
  type SelectProps,
  TextArea,
  type TextAreaProps,
  TextField,
  type TextFieldProps,
  Toggle,
} from "@bsport/kaizen-primitive-core";

import useSCT from "#src/hooks/use-sct";
import { type ClassFormValues, fieldIdPrefix } from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

import { FormSection, FormSectionHeader } from "./class-form.shared";

export const ClassDetailsSection: FC = () => {
  const { t } = useTranslation("add-edit-form");
  const { sctMap } = useSCT();
  const { watch, setValue } = useFormContext<ClassFormValues>();
  const isBroadcast = watch("is_broadcast");
  const categoryItems = useMemo(
    () => [
      {
        id: "",
        label: t("addEditForm.details.category.placeholder"),
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
      <FormSectionHeader
        title={t("addEditForm.details.title")}
        description={t("addEditForm.details.description")}
      />
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
          label={t("addEditForm.details.name.label")}
          placeholder={t("addEditForm.details.name.placeholder")}
          required
          fullWidth
        />
      </FormField>
      <FormMediaField<ClassFormValues, "cover_main">
        id={`${fieldIdPrefix}-image-upload`}
        fieldName="cover_main"
        inputName="add-class-image-uploader"
        fileExtensionList={["image/*"]}
        customTexts={{
          fileExtensionList: t("addEditForm.details.image.recommendation"),
        }}
      />
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
          id={`${fieldIdPrefix}-image-alt`}
          label={t("addEditForm.details.image.altLabel")}
          placeholder={t("addEditForm.details.image.altPlaceholder")}
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
            label={t("addEditForm.details.category.label")}
            size="md"
            required
            items={categoryItems}
            helperText={t("addEditForm.details.category.helper")}
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
          label={t("addEditForm.details.descriptionField.label")}
          placeholder={t("addEditForm.details.descriptionField.placeholder")}
          required
        />
      </FormField>
      <div className="w-[320px] flex items-end gap-2">
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
            label={t("addEditForm.details.color.label")}
            placeholder={t("addEditForm.details.color.placeholder")}
            fullWidth
          />
        </FormField>
      </div>
      <Toggle
        id={`${fieldIdPrefix}-available-to-livestream`}
        label={t("addEditForm.details.livestream.label")}
        checked={isBroadcast}
        onToggleChange={(checked) => {
          setValue("is_broadcast", checked, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    </FormSection>
  );
};
