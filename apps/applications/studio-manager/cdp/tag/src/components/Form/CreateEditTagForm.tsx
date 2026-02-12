import { ControlledFormProps, FormField } from "@bsport/form";
import { Select, SelectProps, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { CreateEditTagData } from "#src/utils/types";

type EditTagFormProps = Omit<
  ControlledFormProps<CreateEditTagData>,
  "onSubmit" | "children"
> & {
  isEdition: boolean;
  tagGroupOptions: SelectProps["items"];
};

export const CreateEditTagForm: React.FC<EditTagFormProps> = ({
  isEdition,
  tagGroupOptions,
  ...methods
}: EditTagFormProps) => {
  const { t } = useTranslation("tags");

  const { watch, setValue } = methods;

  const selectedTagGroup = watch("tagGroup");

  return (
    <div>
      {isEdition ? (
        <Select
          required
          fullWidth
          status={
            methods.formState.errors.tagGroup?.message ? "critical" : "default"
          }
          errorText={methods.formState.errors.tagGroup?.message}
          id="edit-tag-group-select"
          label={t("tagModal.formField.mainTagAssociated.label")}
          items={tagGroupOptions}
          value={String(selectedTagGroup)}
          onChange={(option: string) => {
            setValue("tagGroup", parseInt(option), { shouldValidate: true });
          }}
        />
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
