import React, { useState } from "react";

import { type EmailTemplateDetail } from "@bsport/api-cdp/email-template";
import { BackendSelector } from "@bsport/kaizen-business-components/form/backend-selector";
import { TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useGroupedEmailTemplates } from "#src/api/use-grouped-email-templates";
import { QueryBoundary } from "#src/components/QueryBoundary";
import { useTranslation } from "#src/utils/i18n";

type EmailTemplateSelectorProps = {
  disabled?: boolean;
  selectedTemplateId?: number | null;
  onSelectTemplate: (template: EmailTemplateDetail | null) => void;
  textfieldProps?: Partial<TextFieldProps>;
};

export const EmailTemplateSelector: React.FC<EmailTemplateSelectorProps> = ({
  disabled = false,
  selectedTemplateId,
  onSelectTemplate,
  textfieldProps,
}) => {
  const { t } = useTranslation("campaign");
  const [searchInput, setSearchInput] = useState("");
  const id__in = selectedTemplateId ? String(selectedTemplateId) : undefined;
  const { data, isLoading, optionsFormatter } = useGroupedEmailTemplates({
    searchInput,
    id__in,
  });

  const defaultValues = selectedTemplateId
    ? [String(selectedTemplateId)]
    : undefined;

  return (
    <QueryBoundary key={id__in}>
      <BackendSelector<{ id__in?: string }, EmailTemplateDetail>
        disabled={disabled}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        storeConfig={{
          data,
          isLoading,
          initialValue: id__in ?? "",
        }}
        optionsFormatter={optionsFormatter}
        textfieldProps={{
          iconLeft: "mail-01",
          id: "email-campaign-template-selector",
          label: t(
            "email.creation.form.emailTemplate.selectEmailTemplateLabel",
          ),
          placeholder: t(
            "email.creation.form.emailTemplate.selectEmailTemplatePlaceholder",
          ),
          ...textfieldProps,
        }}
        loadingMessage={t(
          "email.creation.form.emailTemplate.emailTemplateSearching",
        )}
        defaultValues={defaultValues}
        onSelect={(selected) => {
          if (typeof selected !== "string") return;
          const id = parseInt(selected, 10);
          if (Number.isNaN(id)) return;
          const template = data.find((item) => item.id === id);
          if (!template) return;
          onSelectTemplate(template ?? null);
        }}
        onClear={() => {
          setSearchInput("");
          onSelectTemplate(null);
        }}
      />
    </QueryBoundary>
  );
};
