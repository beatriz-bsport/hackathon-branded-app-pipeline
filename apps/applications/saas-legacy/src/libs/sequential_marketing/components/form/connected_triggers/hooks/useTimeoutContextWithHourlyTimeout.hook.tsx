import React from 'react';

const useTimeoutContext = (
  initialTimeout: number | null, // Timeout in days
  initialTimeoutHours: number | null, // Additional timeout in hours
) => {
  const [timeoutValue, setTimeoutValue] = React.useState<number>(
    initialTimeout || 0,
  );
  const [timeoutHoursValue, setTimeoutHoursValue] = React.useState<number>(
    initialTimeoutHours || 0,
  );

  const changeTimeout = React.useCallback(
    (time: number) => setTimeoutValue(time),
    [],
  );
  const changeTimeoutHours = React.useCallback(
    (time: number) => setTimeoutHoursValue(time),
    [],
  );

  const handleChangeTimeout = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (!value || value === '0') {
        changeTimeout(0);
      } else {
        changeTimeout(parseFloat(value));
      }
    },
    [changeTimeout],
  );

  const handleChangeTimeoutHours = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (!value || value === '0') {
        changeTimeoutHours(0);
      } else {
        changeTimeoutHours(parseFloat(value));
      }
    },
    [changeTimeoutHours],
  );

  return {
    timeoutValue,
    handleChangeTimeout,

    timeoutHoursValue,
    handleChangeTimeoutHours,
  };
};

export default useTimeoutContext;
