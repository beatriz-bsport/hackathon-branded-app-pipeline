import React from 'react';

import { useFormikContext } from 'formik';

import { useTranslation } from 'react-i18next';

import { RuleBetweenEntryEvent } from '#libs/sequential_marketing/constants';
import { TRIGGER_DETAULT_TIMEOUT_DAYS } from '../utils';

import type { FormikValues } from '../components';
import type { EmailTemplate } from '#libs/email-editor/types';
import type { SmartList } from '#libs/smart-list/types';

import useMarketingActionsContext from './useMarketingActions.hook';
import useEventContext from './useEvents.hook';
import useTimeOutContext from './useTimeOut.hook';
import useTriggerOperandContext from './useTriggerOperand.hook';
import useSmartlistContext from './useSmartlist.hook';

type Props = {
  emails: EmailTemplate[];
  smartlists: SmartList[];
  forceAndLogicForTriggerAndSmartList: boolean;
};

export const useCadenceFormContext = ({
  emails,
  smartlists,
  forceAndLogicForTriggerAndSmartList,
}: Props) => {
  const { t } = useTranslation('marketing');

  const { values }: FormikValues = useFormikContext();

  const memoizedSmartlists = React.useMemo(() => {
    if (smartlists) {
      return smartlists;
    }
    return [];
  }, [smartlists]);

  const memoizedEmails = React.useMemo(() => {
    if (emails) {
      return emails;
    }
    return [];
  }, [emails]);

  const {
    triggerEventKindSelected,
    setTriggerEventKindSelected,
    setTriggerEventKind,
    CADENCE_EVENT_GROUPED_OPTIONS,
  } = useEventContext();

  const {
    selectedMarketingActions,
    handleWrittenEmailContentChange,
    handleWrittenEmailTitleChange,
    handleSmsContentChange,
    handlePushNotificationTitleChange,
    handlePushNotificationContentChange,
    handleEmailTemplateTitleChange,
    handleSelectEmailDesign,
    handleResetMarketingAction,
    handleMarketingActionChange,
  } = useMarketingActionsContext({ emails: memoizedEmails });

  const { setTimeOutValue, handleChangeTimeOut, timeoutValue } =
    useTimeOutContext();

  const {
    triggerOperandSelectedOption,
    setTriggerOperandSelectedOption,
    setTriggerLogicOperandSelected,
  } = useTriggerOperandContext();

  const {
    setTriggerSmartListSelected,
    setSmartListSelectedOption,
    smartListSelectedOption,
  } = useSmartlistContext();

  React.useEffect(() => {
    if (!values.trigger_event_kind) {
      setTriggerEventKindSelected(null);
    } else {
      setTriggerEventKindSelected({
        label: t(`cadence.form.event.${values.trigger_event_kind}`),
        value: values.trigger_event_kind,
      });
    }
    if (!values.trigger_smartlist_selected) {
      setSmartListSelectedOption(null);
    } else {
      setSmartListSelectedOption({
        label:
          memoizedSmartlists?.find(
            (sm) => sm.id === values.trigger_smartlist_selected,
          )?.name || '',
        value: values.trigger_smartlist_selected,
      });
    }
    if (!values.trigger_destination_timeout_days) {
      setTimeOutValue(TRIGGER_DETAULT_TIMEOUT_DAYS);
    } else {
      setTimeOutValue(values.trigger_destination_timeout_days / (24 * 60 * 60));
    }
    if (
      !values.trigger_logic_between_event_and_smartlist ||
      values.trigger_logic_between_event_and_smartlist ===
        RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT ||
      forceAndLogicForTriggerAndSmartList
    ) {
      setTriggerOperandSelectedOption({
        label: t('cadence.form.trigger.and_rule_between_triggers'),
        value: RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
      });
    } else {
      setTriggerOperandSelectedOption({
        label: t('cadence.form.trigger.or_rule_between_triggers'),
        value: RuleBetweenEntryEvent.OR_RULE_BETWEEN_ENTRY_EVENT,
      });
    }
  }, [
    values,
    t,
    memoizedSmartlists,
    forceAndLogicForTriggerAndSmartList,
    setTriggerEventKindSelected,
    setTimeOutValue,
    setTriggerOperandSelectedOption,
    setSmartListSelectedOption,
  ]);

  return {
    // MARKETING ACTIONS
    selectedMarketingActions,
    handleWrittenEmailContentChange,
    handleWrittenEmailTitleChange,
    handleSmsContentChange,
    handlePushNotificationTitleChange,
    handlePushNotificationContentChange,
    handleEmailTemplateTitleChange,
    handleSelectEmailDesign,
    handleResetMarketingAction,
    handleMarketingActionChange,

    // EVENT
    setTriggerEventKind,
    triggerEventKindSelected,
    CADENCE_EVENT_GROUPED_OPTIONS,

    // TIMEOUT
    timeoutValue,
    handleChangeTimeOut,

    // Smartlist
    smartListSelectedOption,
    setTriggerSmartListSelected,

    // Operand
    setTriggerLogicOperandSelected,
    triggerOperandSelectedOption,
  };
};

export default useCadenceFormContext;
