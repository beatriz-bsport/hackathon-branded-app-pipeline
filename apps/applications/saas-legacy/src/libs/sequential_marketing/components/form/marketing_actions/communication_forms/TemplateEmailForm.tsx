import React from 'react';

import { useFormik } from 'formik';

import { MarketingActions } from '#src/libs/sequential_marketing/constants';
import { templateEmailValidationSchema } from '#src/libs/sequential_marketing/components/form/marketing_actions/validationSchemas';
import CommunicationSelectTemplate from '#src/libs/communication-v2/components/MessageSender/ModalTemplate/CommunicationSelectTemplate.component';

import type {
  MarketingActionEssentials,
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
} from '#src/libs/sequential_marketing/types';

export type Props = {
  marketingAction: Partial<StepMarketingActions>;
  withoutValidation?: boolean;
  submit?: (data: Partial<StepMarketingActions>) => void;
} & Omit<MarketingActionEssentials, 'tagCategories' | 'tagList'>;

const TemplateEmailForm: React.FC<Props> = ({
  emailDetailList,
  marketingAction,
  withoutValidation,
  fetchEmailSummaryList,
  submit,
}) => {
  const formik = useFormik<Partial<StepMarketingActions>>({
    initialValues: marketingAction,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: withoutValidation ? null : templateEmailValidationSchema,
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
        communication_kind: MarketingActions.EMAIL_TEMPLATE,
      };
    }, [formik.values.action_spec]);

  return (
    <CommunicationSelectTemplate
      currentTitle={actionSpec?.subject}
      elementContext="body"
      emailDetailList={emailDetailList}
      fetchEmailSummaryList={fetchEmailSummaryList}
      selectedTemplate={actionSpec?.email_design}
      updateCurrentTitle={handleUpdateTitle}
      updateSelectedTemplate={handleSelectEmailDesign}
    />
  );
};

export default React.memo(TemplateEmailForm);
