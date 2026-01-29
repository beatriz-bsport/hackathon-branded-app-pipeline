import React from 'react';

import { useFormik } from 'formik';

import { MarketingActions } from '#src/libs/sequential_marketing/constants';
import { MAX_LENGTH_PUSH_CONTENT } from '#src/libs/communication-v2/constants';
import { notificationValidationSchema } from '#src/libs/sequential_marketing/components/form/marketing_actions/validationSchemas';
import CommunicationWriteNotification from '#src/libs/communication-v2/components/MessageSender/Writers/CommunicationWriteNotification.component';
import type {
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
} from '#src/libs/sequential_marketing/types';
import HTMLTagMenuSelector from './components/HTMLTagMenuSelector.component';

export type Props = {
  marketingAction: Partial<StepMarketingActions>;
  tagCategories: { [tag_name: string]: string[] };
  withoutValidation?: boolean;
  submit: (data: Partial<StepMarketingActions>) => void;
};

const NotificationForm: React.FC<Props> = ({
  marketingAction,
  tagCategories,
  withoutValidation,
  submit,
}) => {
  const formik = useFormik<Partial<StepMarketingActions>>({
    initialValues: marketingAction,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: withoutValidation ? null : notificationValidationSchema,
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
        communication_kind: MarketingActions.PUSH_NOTIFICATION,
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
      await setFieldValue(`action_spec.text_content`, target.value);
      handleSubmit?.();
    },
    [handleSubmit, setFieldValue],
  );

  const onBaliseItemClick = React.useCallback(
    async (selectedItem: string) => {
      const tagLength = selectedItem?.length + 2; // 2 for the brackets
      if (
        actionSpec?.text_content?.length + tagLength <=
        MAX_LENGTH_PUSH_CONTENT
      ) {
        await setFieldValue(
          `action_spec.text_content`,
          `${actionSpec?.text_content}{${selectedItem}}`,
        );
        handleSubmit?.();
      }
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
