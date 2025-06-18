import { toast } from "@bsport/kaizen-primitive-core";
import type {
  CreateEmailTemplatePayload,
  EmailTemplateDetail,
} from "@bsport/store-cdp-email-template";

import { useCreateTemplate } from "#src/hooks/api/use-create-template";
import { useUpdateTemplate } from "#src/hooks/api/use-update-template";
import type { EmailTemplateFormData } from "#src/hooks/forms/use-email-template-form";
import { useTranslation } from "#src/utils/i18n";
import { getLocalISOStringWithOffset } from "#src/utils/time";

export type SaveEmailTemplateParams = Omit<
  EmailTemplateFormData,
  "stringifiedDesign" | "category"
> & {
  design: string;
  html: string;
  category: number | null;
  company_id: number | null;
};

type useSaveTemplateParams = {
  templateId?: number;
  onSuccess?: (data: EmailTemplateDetail) => void;
  onFailure?: () => void;
};

export const useSaveTemplate = ({
  templateId,
  onSuccess,
  onFailure,
}: useSaveTemplateParams) => {
  const { t } = useTranslation("detail");
  const displaySuccessToast = () =>
    toast({
      status: "positive",
      icon: "save",
      title: t("saveTemplateAction.success.title"),
      buttonIcon: "x-close",
    });

  const displayFailureToast = () =>
    toast({
      status: "critical",
      icon: "alert-circle",
      title: t("saveTemplateAction.error.problemWhileSaving"),
      buttonIcon: "x-close",
    });

  const { createTemplate } = useCreateTemplate({
    onSuccess: (createdTemplate: EmailTemplateDetail) => {
      onSuccess?.(createdTemplate);
      displaySuccessToast();
    },
    onFailure: () => {
      onFailure?.();
      displayFailureToast();
    },
  });
  const { updateTemplate } = useUpdateTemplate({
    onSuccess: (updatedTemplate: EmailTemplateDetail) => {
      onSuccess?.(updatedTemplate);
      displaySuccessToast();
    },
    onFailure: () => {
      onFailure?.();
      displayFailureToast();
    },
  });

  const saveTemplate = (templateFormData: SaveEmailTemplateParams): void => {
    const data: CreateEmailTemplatePayload = {
      ...templateFormData,
      available_for_companies: [],
      date_modified: getLocalISOStringWithOffset(new Date()),
    };
    if (!templateId) {
      createTemplate(data);
    } else {
      updateTemplate({
        id: templateId,
        ...data,
      });
    }
  };

  return {
    saveTemplate,
  };
};
