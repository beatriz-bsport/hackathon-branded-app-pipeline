import React from 'react';

import { useFormikContext } from 'formik';

import type { FormikValues, SelectorOption } from '../components';

const useSmartlistContext = () => {
  const { setFieldValue }: FormikValues = useFormikContext();

  const [smartListSelectedOption, setSmartListSelectedOption] =
    React.useState<SelectorOption | null>(null);

  const setTriggerSmartListSelected = (option: SelectorOption | null) => {
    option
      ? setFieldValue('trigger_smartlist_selected', option.value)
      : setFieldValue('trigger_smartlist_selected', null);
  };

  return {
    setTriggerSmartListSelected,
    setSmartListSelectedOption,
    smartListSelectedOption,
  };
};

export default useSmartlistContext;
