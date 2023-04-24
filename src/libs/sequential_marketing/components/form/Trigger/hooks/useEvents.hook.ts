// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useFormikContext } from 'formik';
import {
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  CadenceEventsEnum,
} from '../../../../constants';

import type { FormikValues, SelectorOption } from '../components';

type ReduceReturnType = {
  label: string;
  options: Array<{ label: string; value: CadenceEventsEnum }>;
};

export const useEventContext = () => {
  const { t } = useTranslation('marketing');

  const [triggerEventKindSelected, setTriggerEventKindSelected] =
    React.useState<SelectorOption | null>(null);

  const { setFieldValue }: FormikValues = useFormikContext();

  const setTriggerEventKind = (option: SelectorOption | null) =>
    option
      ? setFieldValue('trigger_event_kind', option.value)
      : setFieldValue('trigger_event_kind', null);

  // Constant declaration building a object shaped such as the selector component groups the options
  // by category. It is placed here since some dynamic translations have to be done.
  const CADENCE_EVENT_GROUPED_OPTIONS = React.useMemo(() => {
    return Object.keys(CADENCE_EVENT_GROUPED_BY_CATEGORY).reduce<
      ReduceReturnType[]
    >((previousValue, currentValue) => {
      const group: {
        label: string;
        options: Array<{ label: string; value: CadenceEventsEnum }>;
      } = { label: '', options: [] };
      group.label = t(`cadence.form.event.${currentValue}`);
      group.options = CADENCE_EVENT_GROUPED_BY_CATEGORY[currentValue].map(
        (child: CadenceEventsEnum) => ({
          label: t(`cadence.form.event.${child}`),
          value: child,
        }),
      );
      previousValue.push(group);
      return previousValue;
    }, [] as ReduceReturnType[]);
  }, [t]);

  return {
    setTriggerEventKindSelected,
    setTriggerEventKind,
    triggerEventKindSelected,
    CADENCE_EVENT_GROUPED_OPTIONS,
  };
};

export default useEventContext;
