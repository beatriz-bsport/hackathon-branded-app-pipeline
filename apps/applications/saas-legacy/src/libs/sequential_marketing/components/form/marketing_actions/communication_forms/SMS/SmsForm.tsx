import React from 'react';

import { useFormik } from 'formik';

import { smsValidationSchema } from '#src/libs/sequential_marketing/components/form/marketing_actions/validationSchemas';
import { MarketingActions } from '#src/libs/sequential_marketing/constants';
import CommunicationWriteSMS from '#src/libs/communication-v2/components/MessageSender/Writers/CommunicationWriteSMS.component';
import type {
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
} from '#src/libs/sequential_marketing/types';
import HTMLTagMenuSelector from '../components/HTMLTagMenuSelector.component';

export type Props = {
  marketingAction: Partial<StepMarketingActions>;
  tagCategories: { [tag_name: string]: string[] };
  withoutValidation?: boolean;
  submit?: (data: Partial<StepMarketingActions>) => void;
};

const SmsForm: React.FC<Props> = ({
  marketingAction,
  tagCategories,
  withoutValidation,
  submit,
}) => {
  const formik = useFormik<Partial<StepMarketingActions>>({
    initialValues: marketingAction,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: withoutValidation ? null : smsValidationSchema,
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
