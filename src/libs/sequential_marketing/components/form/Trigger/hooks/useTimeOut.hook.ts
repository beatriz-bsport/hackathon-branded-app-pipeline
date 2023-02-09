import React from 'react';

import { useFormikContext } from 'formik';

import { TRIGGER_DETAULT_TIMEOUT_DAYS } from '../utils';

import type { FormikValues } from '../components';

export const useTimeOutContext = () => {
  const [timeoutValue, setTimeOutValue] = React.useState(
    TRIGGER_DETAULT_TIMEOUT_DAYS,
  );

  const { setFieldValue }: FormikValues = useFormikContext();

  const handleChangeTimeOut = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFieldValue(
      'trigger_destination_timeout_days',
      (parseFloat(event.target.value) || 0) * 24 * 60 * 60,
    );

  return {
    setTimeOutValue,
    handleChangeTimeOut,
    timeoutValue,
  };
};

export default useTimeOutContext;
