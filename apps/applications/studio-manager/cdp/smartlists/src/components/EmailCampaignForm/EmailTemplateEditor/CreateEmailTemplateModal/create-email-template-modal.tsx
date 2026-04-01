import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  Body,
  Modal,
  Select,
  TextField,
  toast,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { emailTemplateCategoriesQueryOptions } from "#src/api/api";
import { useCreateEmailTemplate } from "#src/api/use-create-email-template";
import { useTranslation } from "#src/utils/i18n";

import type {
  EmailDesignContent,
  EmailTemplateChangeResult,
} from "../EmailDesignManager/email-design-editor-types";

const NO_CATEGORY_VALUE = "no-category";

type CreateEmailTemplateModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (result: EmailTemplateChangeResult) => void;
  content: EmailDesignContent;
  subject: string;
};

export const CreateEmailTemplateModal = ({
  open,
  onClose,
  onSuccess,
  content,
  subject,
}: CreateEmailTemplateModalProps) => {
  const { t } = useTranslation("campaign");
  const companyId = dataAccessLayer.useCompanyTheme()?.id ?? null;

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>(NO_CATEGORY_VALUE);

  const { data: categoriesData } = useQuery(
    emailTemplateCategoriesQueryOptions(),
  );

  const categories = categoriesData?.results ?? [];

  const categoryItems = [
    {
      id: NO_CATEGORY_VALUE,
      label: t(
        "email.creation.form.emailTemplateEditor.createNewTemplateModal.noCategoryLabel",
      ),
    },
    ...categories.map((category) => ({
      id: String(category.id),
      label: category.name,
    })),
  ];

  const { createTemplate, isCreating } = useCreateEmailTemplate({
    onSuccess: (createdTemplate) => {
      toast({
        title: t(
          "email.creation.form.emailTemplateEditor.saveActionModal.options.createNewTemplate.toast.success",
        ),
        status: "default",
        icon: "save",
        buttonIcon: "x-close",
      });
      onSuccess({
        design: createdTemplate.design,
        html: createdTemplate.html,
        subject: createdTemplate.subject,
        emailTemplateId: createdTemplate.id,
      });
      setTitle("");
      setCategoryId(NO_CATEGORY_VALUE);
    },
    onError: () => {
      toast({
        title: t(
          "email.creation.form.emailTemplateEditor.saveActionModal.options.createNewTemplate.toast.failure",
        ),
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
    },
  });

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    await createTemplate({
      title: trimmedTitle,
      subject,
      html: content.html,
      design: content.design,
      category: categoryId === NO_CATEGORY_VALUE ? null : Number(categoryId),
      company_id: companyId,
      date_modified: new Date().toISOString(),
    });
  };

  const handleClose = () => {
    setTitle("");
    setCategoryId(NO_CATEGORY_VALUE);
    onClose();
  };

  return (
    <Modal
      open={open}
      size="md"
      title={t(
        "email.creation.form.emailTemplateEditor.createNewTemplateModal.title",
      )}
      confirmButton={{
        label: t(
          "email.creation.form.emailTemplateEditor.createNewTemplateModal.confirmButtonLabel",
        ),
        onClick: handleSave,
        disabled: !title.trim() || isCreating,
        loading: isCreating,
      }}
      onClose={handleClose}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="sm" color="weak">
          {t(
            "email.creation.form.emailTemplateEditor.createNewTemplateModal.description",
          )}
        </Body>
        <TextField
          id="create-email-template-title"
          label={t(
            "email.creation.form.emailTemplateEditor.createNewTemplateModal.templateTitleLabel",
          )}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <Select
          id="create-email-template-category"
          label={t(
            "email.creation.form.emailTemplateEditor.createNewTemplateModal.categoryLabel",
          )}
          items={categoryItems}
          value={categoryId}
          onChange={setCategoryId}
          fullWidth
        />
      </div>
    </Modal>
  );
};
