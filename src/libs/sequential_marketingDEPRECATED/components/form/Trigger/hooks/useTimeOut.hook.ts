import React from 'react';
import { useFormikContext } from 'formik';
import type { FormikValues } from '../components';

import { TRIGGER_DEFAULT_TIMEOUT_DAYS } from '../utils';

export const useTimeOutContext = () => {
  const [timeoutValue, setTimeOutValue] = React.useState(
    TRIGGER_DEFAULT_TIMEOUT_DAYS,
  );

  const { setFieldValue }: FormikValues = useFormikContext();

  const handleChangeTimeOut = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '0') {
      setFieldValue('trigger_destination_timeout_days', 0);
    } else {
      setFieldValue(
        'trigger_destination_timeout_days',
        parseFloat(value) || TRIGGER_DEFAULT_TIMEOUT_DAYS,
      );
    }
  };

  return {
    setTimeOutValue,
    handleChangeTimeOut,
    timeoutValue,
  };
};

export default useTimeOutContext;
