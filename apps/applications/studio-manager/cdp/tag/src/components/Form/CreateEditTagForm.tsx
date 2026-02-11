import { ControlledFormProps, FormField } from "@bsport/form";
import { Select, SelectProps, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { CreateEditTagData } from "#src/utils/types";

type EditTagFormProps = Omit<
  ControlledFormProps<CreateEditTagData>,
  "onSubmit" | "children"
> & {
  isEdition: boolean;
  tagGroupMapByName: Record<string, number>;
  tagGroupOptions: SelectProps["items"];
};

function findRecordValueByKey(
  map: Record<string, number>,
  value: number,
): string | undefined {
  return Object.keys(map).find((key) => map[key] === value);
}

export const CreateEditTagForm: React.FC<EditTagFormProps> = ({
  isEdition,
  tagGroupMapByName,
  tagGroupOptions,
  ...methods
}: EditTagFormProps) => {
  const { t } = useTranslation("tags");
  return (
    <div>
      {isEdition ? (
        <FormField<CreateEditTagData, "tagGroup", SelectProps>
          name="tagGroup"
          mapProps={({ defaultProps, field }) => ({
            ...defaultProps,
            value:
              field.value === 0
                ? t("tagModal.formField.mainTagAssociated.placeholder")
                : findRecordValueByKey(tagGroupMapByName, field.value) || "",
            onSelect: (option: string) => {
              const selectedGroup = tagGroupMapByName[option];
              field.onChange(selectedGroup);
              field.onBlur();
            },
          })}
        >
          <Select
            required
            fullWidth
            status={
              methods.formState.errors.tagGroup?.message
                ? "critical"
                : "default"
            }
            errorText={methods.formState.errors.tagGroup?.message}
            id="edit-tag-group-select"
            label={t("tagModal.formField.mainTagAssociated.label")}
            items={tagGroupOptions}
          />
        </FormField>
      ) : null}
      <FormField<CreateEditTagData, "tagName">
        name="tagName"
        mapProps={({ defaultProps, form, field }) => ({
          ...defaultProps,
          onClear: () => {
            form.setValue("tagName", "", { shouldDirty: true });
            field.onBlur();
          },
        })}
      >
        <TextField
          fullWidth
          id="edit-tag-name-input"
          label={t("tagModal.formField.tagName.label")}
          placeholder={t("tagModal.formField.tagName.placeholder")}
          required
        />
      </FormField>
      <FormField<CreateEditTagData, "color">
        name="color"
        mapProps={({ defaultProps, form, field }) => ({
          ...defaultProps,
          onClear: () => {
            form.setValue("color", "", { shouldDirty: true });
            field.onBlur();
          },
        })}
      >
        <TextField
          type="color"
          id="edit-tag-color-input"
          label={t("tagModal.formField.tagColor.label")}
          placeholder={t("tagModal.formField.tagColor.placeholder")}
        />
      </FormField>
    </div>
  );
};
