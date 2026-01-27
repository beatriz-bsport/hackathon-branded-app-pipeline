import React from 'react';

import { useFormik } from 'formik';

import { MarketingActions } from '#src/libs/sequential_marketing/constants';
import { writtenEmailValidationSchema } from '#src/libs/sequential_marketing/components/form/marketing_actions/validationSchemas';
import CommunicationWriteEmail from '#src/libs/communication-v2/components/MessageSender/Writers/CommunicationWriteEmail.component';
import type {
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
} from '#src/libs/sequential_marketing/types';
import HTMLTagMenuSelector from './components/HTMLTagMenuSelector.component';

export type Props = {
  marketingAction: Partial<StepMarketingActions>;
  tagCategories: { [tag_name: string]: string[] };
  withoutValidation?: boolean;
  submit?: (data: Partial<StepMarketingActions>) => void;
};

const WrittenEmailForm: React.FC<Props> = ({
  marketingAction,
  tagCategories,
  withoutValidation,
  submit,
}) => {
  const formik = useFormik<Partial<StepMarketingActions>>({
    initialValues: marketingAction,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: withoutValidation ? null : writtenEmailValidationSchema,
  });

  const { setFieldValue, handleSubmit } = formik;

  const actionSpec: StepMarketingActionsCommunicationSpec =
    React.useMemo(() => {
      if ('communication_kind' in formik.values.action_spec) {
        return formik.values.action_spec;
      }
      return {
        email_design: null,
        text_content: '',
        subject: '',
        communication_kind: MarketingActions.WRITTEN_EMAIL,
      };
    }, [formik.values.action_spec]);

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
      await setFieldValue(
        `action_spec.text_content`,
        `${actionSpec?.text_content}{${selectedItem}}`,
      );
      handleSubmit?.();
    },
    [actionSpec?.text_content, handleSubmit, setFieldValue],
  );

  return (
    <CommunicationWriteEmail
      emailContent={actionSpec?.text_content}
      emailTitle={actionSpec?.subject}
      handleChangeContent={handleChangeContent}
      handleChangeTitle={handleChangeTitle}
    >
      <HTMLTagMenuSelector
        withMaxWidth
        onBaliseItemClick={onBaliseItemClick}
        tagCategories={tagCategories}
      />
    </CommunicationWriteEmail>
  );
};

export default React.memo(WrittenEmailForm);
