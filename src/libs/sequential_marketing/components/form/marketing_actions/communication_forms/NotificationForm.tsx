import React from 'react';

import { useFormik } from 'formik';

import { MarketingActions } from '#libs/sequential_marketing/constants';
import { notificationValidationSchema } from '#libs/sequential_marketing/components/form/marketing_actions/validationSchemas';
import CommunicationWriteNotification from '#libs/communication-v2/components/MessageSender/Writers/CommunicationWriteNotification.component';
import HTMLTagMenuSelector from './components/HTMLTagMenuSelector.component';

import type {
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
} from '#libs/sequential_marketing/types';

export type Props = {
  marketingAction: StepMarketingActions;
  tagCategories: { [tag_name: string]: string[] };
  submit: (data: StepMarketingActions) => void;
};

const NotificationForm: React.FC<Props> = ({
  marketingAction,
  tagCategories,
  submit,
}) => {
  const formik = useFormik<StepMarketingActions>({
    initialValues: marketingAction,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: notificationValidationSchema,
  });

  const { setFieldValue, handleSubmit } = formik;

  const actionSpec: StepMarketingActionsCommunicationSpec =
    React.useMemo(() => {
      if (
        !!formik?.values?.action_spec &&
        'communication_kind' in formik?.values?.action_spec
      ) {
        return formik?.values?.action_spec;
      }
      return {
        email_design: null,
        text_content: '',
        subject: '',
        communication_kind:
          MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
      };
    }, [formik?.values?.action_spec]);

  const handleChangeTitle = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target;
      await setFieldValue(`action_spec.subject`, target.value);
      handleSubmit?.();
    },
    [handleSubmit, setFieldValue],
  );

  const handleChangeContent = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target;
      setFieldValue(`action_spec.text_content`, target.value);
      await handleSubmit?.();
    },
    [handleSubmit, setFieldValue],
  );

  const onBaliseItemClick = React.useCallback(
    async (selectedItem: string) => {
      await setFieldValue(
        `action_spec.text_content`,
        `${actionSpec?.text_content}{${selectedItem}}`,
      );
      handleSubmit?.();
    },
    [actionSpec?.text_content, handleSubmit, setFieldValue],
  );

  return (
    <CommunicationWriteNotification
      minimalBottom
      handleChangeContent={handleChangeContent}
      handleChangeTitle={handleChangeTitle}
      notificationContent={actionSpec?.text_content}
      notificationTitle={actionSpec?.subject}
    >
      <HTMLTagMenuSelector
        onBaliseItemClick={onBaliseItemClick}
        tagCategories={tagCategories}
      />
    </CommunicationWriteNotification>
  );
};

export default React.memo(NotificationForm);
