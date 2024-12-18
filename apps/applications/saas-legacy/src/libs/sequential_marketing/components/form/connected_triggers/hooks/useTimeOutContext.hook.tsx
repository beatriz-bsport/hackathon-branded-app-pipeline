import React from 'react';

const useTimeOutContext = () => {
  const [timeoutValue, setTimeOutValue] = React.useState<number | null>(null);

  const changeTimeOut = React.useCallback(
    (time: number) => setTimeOutValue(time),
    [],
  );

  const handleChangeTimeOut = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (!value) {
        changeTimeOut(null);
      } else if (value === '0') {
        changeTimeOut(0);
      } else {
        changeTimeOut(parseFloat(value));
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
