import {
  Body,
  Select,
  type SelectProps,
  TextField,
} from "@bsport/kaizen-primitive-core";

import type { EmailTemplateFormData } from "#src/hooks/forms/use-email-template-form";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  formData: EmailTemplateFormData;
  errors?: Partial<Record<keyof EmailTemplateFormData, string>>;
  handleChange: (field: keyof EmailTemplateFormData, value: string) => void;
  handleBlur?: (field: keyof EmailTemplateFormData, value: string) => void;
  categoriesList: SelectProps["items"];
};

export const EmailEditorForm: React.FC<Props> = ({
  formData: { subject, category },
  errors,
  handleChange,
  handleBlur,
  categoriesList,
}: Props) => {
  const { t } = useTranslation("detail");

  const handleClearSubject = () => {
    handleChange("subject", "");
    handleBlur?.("subject", "");
  };
  return (
    <>
      <TextField
        fullWidth
        id="create-email-template-subject-input"
        type="text"
        label={t("templateSubject.label")}
        placeholder={t("templateSubject.placeholder")}
        value={subject}
        status={errors?.subject ? "error" : "default"}
        statusText={errors?.subject}
        onBlur={() => handleBlur?.("subject", subject)}
        onChange={(event) => handleChange("subject", event.target.value)}
        onClear={handleClearSubject}
        required
      />
      <div id="category-selector-input">
        <Body htmlVariant="p">{t("templateCategory.label")}</Body>
        <Select
          fullWidth
          id="category-selector"
          size="md"
          items={categoriesList}
          value={category as string}
          popoverPlacement="bottom-left"
          onSelect={(option) => {
            handleChange("category", option);
          }}
        />
      </div>
    </>
  );
};
