import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import NumericInput from '#src/components/input/NumericInput.component';

import type {
  ConnectedTrigger,
  TriggerTimeoutConfig,
} from '#src/libs/sequential_marketing/types';
import useTimeoutContext from '../hooks/useTimeoutContext.hook';

type Props = {
  trigger: ConnectedTrigger;
  updateValue: (trigger: ConnectedTrigger) => void;
};

const TimeoutForm: React.FC<Props> = ({ trigger, updateValue }) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles();

  const { timeoutValue, changeTimeout, handleChangeTimeout } =
    useTimeoutContext();

  const handleUpdateTriggerWithNewTimeout = React.useCallback(
    (newTimeout: number) => {
      const updatedTrigger = {
        ...trigger,
        trigger_config: {
          ...trigger?.trigger_config,
          timeout: newTimeout,
        },
      };
      updateValue?.(updatedTrigger);
    },
    [trigger, updateValue],
  );

  const handleUpdateTimeout = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const ev = event;
      const inputValue = ev?.target?.value;

      let newTimeout: number;
      if (Number.isNaN(parseFloat(inputValue))) {
        newTimeout = null;
      } else if (inputValue === '0') {
        newTimeout = 0;
      } else {
        newTimeout = parseFloat(inputValue);
      }

      handleUpdateTriggerWithNewTimeout(newTimeout);
      handleChangeTimeout?.(ev);
    },
    [handleChangeTimeout, handleUpdateTriggerWithNewTimeout],
  );

  React.useEffect(() => {
    const timeout = (trigger?.trigger_config as TriggerTimeoutConfig)?.timeout;
    if (timeoutValue) {
      changeTimeout(timeoutValue);
      handleUpdateTriggerWithNewTimeout(timeoutValue);
    } else if (timeout || timeout === 0) {
      changeTimeout(timeout);
    }
    // To prevent execution of useEffect when the trigger or timeout value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUpdateTriggerWithNewTimeout, changeTimeout]);

  return (
    <>
      <div className={classes.selectorContainer}>
        <Typography variant="body1">
          {t('cadence.form.trigger.triggerTimeoutLabel')}
        </Typography>
        <div className={classes.timeoutInput}>
          <NumericInput
            error={timeoutValue < 1}
            InputProps={{
              inputProps: { step: 1, min: 0 },
            }}
            onChange={handleUpdateTimeout}
            value={timeoutValue}
          />
        </div>
        <div className={classes.inputEndText}>
          <Typography variant="body1">
            {t('cadence.form.trigger.triggerTimeoutDays', {
              count: timeoutValue,
            })}
          </Typography>
        </div>
      </div>
      {timeoutValue < 1 && (
        <div className={classes.inputErrorText}>
          <Typography color="error" variant="caption">
            {t('cadence.form.error.timeoutMustBeStrictPositive')}
          </Typography>
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  selectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  timeoutInput: {
    minWidth: theme.spacing(6),
    flex: 1,
  },
  inputEndText: {
    flex: 9,
  },
  inputErrorText: {
    padding: theme.spacing(0),
    paddingBottom: theme.spacing(1),
    margin: theme.spacing(0),
  },
}));

export default React.memo(TimeoutForm);
