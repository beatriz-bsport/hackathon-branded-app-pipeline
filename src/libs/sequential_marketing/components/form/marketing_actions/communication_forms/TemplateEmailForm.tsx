import React from 'react';

import { useFormik } from 'formik';

import { MarketingActions } from '#libs/sequential_marketing/constants';
import { templateEmailValidationSchema } from '#libs/sequential_marketing/components/form/marketing_actions/validationSchemas';
import CommunicationSelectTemplate from '#libs/communication-v2/components/MessageSender/ModalTemplate/CommunicationSelectTemplate.component';

import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';
import type {
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
} from '#libs/sequential_marketing/types';

export type Props = {
  emailDetailList: Record<number, EmailTemplateDetail>;
  emailDetailListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailSummaryListLoading: boolean;
  marketingAction: StepMarketingActions;
  resolvedGenericTags: ResolvedGenericTags;
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  submit?: (data: StepMarketingActions) => void;
};

const TemplateEmailForm: React.FC<Props> = ({
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  marketingAction,
  resolvedGenericTags,
  fetchEmailSummaryList,
  getEmailDetail,
  submit,
}) => {
  const formik = useFormik<StepMarketingActions>({
    initialValues: marketingAction,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: templateEmailValidationSchema,
  });

  const { setFieldValue, handleSubmit } = formik;

  const handleSelectEmailDesign = React.useCallback(
    async (templateId: number) => {
      await setFieldValue('action_spec.email_design', templateId);
      handleSubmit?.();
    },
    [handleSubmit, setFieldValue],
  );

  const handleUpdateTitle = React.useCallback(
    async (title: string) => {
      await setFieldValue('action_spec.subject', title);
      handleSubmit?.();
    },
    [handleSubmit, setFieldValue],
  );

  const actionSpec: StepMarketingActionsCommunicationSpec =
    React.useMemo(() => {
      if ('communication_kind' in formik.values.action_spec) {
        return formik.values.action_spec;
      }
      return {
        email_design: null,
        text_content: '',
        subject: '',
        communication_kind:
          MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
      };
    }, [formik.values.action_spec]);

  return (
    <CommunicationSelectTemplate
      currentTitle={actionSpec?.subject}
      emailDetailList={emailDetailList}
      emailDetailListLoading={emailDetailListLoading}
      emailSummaryList={emailSummaryList}
      emailSummaryListLoading={emailSummaryListLoading}
      fetchEmailSummaryList={fetchEmailSummaryList}
      getEmailDetail={getEmailDetail}
      resolvedGenericTags={resolvedGenericTags}
      selectedTemplate={actionSpec?.email_design}
      updateCurrentTitle={handleUpdateTitle}
      updateSelectedTemplate={handleSelectEmailDesign}
    />
  );
};

export default React.memo(TemplateEmailForm);
