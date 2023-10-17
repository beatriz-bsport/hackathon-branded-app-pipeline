import React from 'react';

import { useFormik } from 'formik';

import { smsValidationSchema } from '#libs/sequential_marketing/components/form/marketing_actions/validationSchemas';
import { MarketingActions } from '#libs/sequential_marketing/constants';
import CommunicationWriteSMS from '#libs/communication-v2/components/MessageSender/Writers/CommunicationWriteSMS.component';
import HTMLTagMenuSelector from './components/HTMLTagMenuSelector.component';

import type {
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
} from '#libs/sequential_marketing/types';

export type Props = {
  marketingAction: Partial<StepMarketingActions>;
  tagCategories: { [tag_name: string]: string[] };
  submit?: (data: Partial<StepMarketingActions>) => void;
};

const SmsForm: React.FC<Props> = ({
  marketingAction,
  tagCategories,
  submit,
}) => {
  const formik = useFormik<Partial<StepMarketingActions>>({
    initialValues: marketingAction,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: smsValidationSchema,
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
        communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_SMS,
      };
    }, [formik.values.action_spec]);

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
    <CommunicationWriteSMS
      minimalBottom
      handleChangeContent={handleChangeContent}
      smsContent={actionSpec?.text_content}
    >
      <HTMLTagMenuSelector
        onBaliseItemClick={onBaliseItemClick}
        tagCategories={tagCategories}
      />
    </CommunicationWriteSMS>
  );
};

export default React.memo(SmsForm);
