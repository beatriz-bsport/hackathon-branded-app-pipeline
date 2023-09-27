import React from 'react';
import { TRIGGER_DEFAULT_TIMEOUT_DAYS } from '#libs/sequential_marketing/constants';

export const useTimeOutContext = () => {
  const [timeoutValue, setTimeOutValue] = React.useState(
    TRIGGER_DEFAULT_TIMEOUT_DAYS,
  );

  const changeTimeOut = React.useCallback(
    (time: number) => setTimeOutValue(time),
    [],
  );

  const handleChangeTimeOut = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value === '0') {
        changeTimeOut(0);
      } else {
        changeTimeOut(parseFloat(value) || TRIGGER_DEFAULT_TIMEOUT_DAYS);
      }
    },
    [changeTimeOut],
  );

  return {
    timeoutValue,
    changeTimeOut,
    handleChangeTimeOut,
  };
};

export default useTimeOutContext;
