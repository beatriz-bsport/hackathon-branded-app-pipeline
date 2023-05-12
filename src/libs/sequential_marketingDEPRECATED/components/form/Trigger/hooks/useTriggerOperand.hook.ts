// @ts-nocheck
import React from 'react';

import { useFormikContext } from 'formik';

import { useTranslation } from 'react-i18next';

import { RuleBetweenEntryEvent } from '#libs/sequential_marketingDEPRECATED/constants';

import type { FormikValues, SelectorOption } from '../components';

export const useTriggerOperandContext = () => {
  const { t } = useTranslation('marketing');

  const { setFieldValue }: FormikValues = useFormikContext();

  const [triggerOperandSelectedOption, setTriggerOperandSelectedOption] =
    React.useState({
      label: t('cadence.form.trigger.and_rule_between_triggers'),
      value: RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
    });

  const setTriggerLogicOperandSelected = (option: SelectorOption | null) =>
    option
      ? setFieldValue('trigger_logic_between_event_and_smartlist', option.value)
      : setFieldValue(
          'trigger_logic_between_event_and_smartlist',
          RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
        );

  return {
    triggerOperandSelectedOption,
    setTriggerOperandSelectedOption,
    setTriggerLogicOperandSelected,
  };
};

export default useTriggerOperandContext;
