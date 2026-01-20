import React from 'react';

const useTimeoutContext = () => {
  const [timeoutValue, setTimeoutValue] = React.useState<number | null>(null);

  const changeTimeout = React.useCallback(
    (time: number) => setTimeoutValue(time),
    [],
  );

  const handleChangeTimeout = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (!value) {
        changeTimeout(null);
      } else if (value === '0') {
        changeTimeout(0);
      } else {
        changeTimeout(parseFloat(value));
      }
    },
    [changeTimeout],
  );

  return {
    timeoutValue,
    changeTimeout,
    handleChangeTimeout,
  };
};

export default useTimeoutContext;
