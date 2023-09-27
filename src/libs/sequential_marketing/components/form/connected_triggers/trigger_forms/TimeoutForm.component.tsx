import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import NumericInput from '#components/input/NumericInput.component';

import type {
  ConnectedTrigger,
  TriggerTimeoutConfig,
} from '#libs/sequential_marketing/types';
import useTimeOutContext from '../hooks/useTimeOutContext.hook';
import { TRIGGER_DEFAULT_TIMEOUT_DAYS } from '#libs/sequential_marketing/constants';

export type Props = {
  trigger: ConnectedTrigger;
  updateValue: (trigger: ConnectedTrigger) => void;
};

const TimeoutForm: React.FC<Props> = ({ trigger, updateValue }) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles();

  const { timeoutValue, changeTimeOut, handleChangeTimeOut } =
    useTimeOutContext();

  React.useEffect(() => {
    const timeout = (trigger?.trigger_config as TriggerTimeoutConfig)?.timeout;
    if (timeout) changeTimeOut(timeout);
  }, [changeTimeOut, trigger]);

  const handleUpdateTimeout = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const ev = event;
      const updatedTrigger = {
        ...trigger,
        trigger_config: {
          ...trigger?.trigger_config,
          timeout:
            event?.target?.value === '0'
              ? 0
              : parseFloat(ev.target.value) || TRIGGER_DEFAULT_TIMEOUT_DAYS,
        },
      };
      handleChangeTimeOut?.(ev);
      updateValue?.(updatedTrigger);
    },
    [trigger, handleChangeTimeOut, updateValue],
  );

  return (
    <>
      <div className={classes.timeoutSelectorContainer}>
        <div>
          <Typography variant="body1">
            {t('cadence.form.trigger.triggerTimeoutLabel')}
          </Typography>
        </div>
        <div className={classes.timeoutInput}>
          <NumericInput
            error={timeoutValue < 1}
            InputProps={{
              inputProps: { step: 1, min: 1 },
            }}
            onChange={handleUpdateTimeout}
            value={timeoutValue}
          />
        </div>
        <div className={classes.timeoutInputTextEnd}>
          <Typography variant="body1">
            {t('cadence.form.trigger.triggerTimeoutDays', {
              count: timeoutValue,
            })}
          </Typography>
        </div>
      </div>
      {timeoutValue < 1 && (
        <div className={classes.timeoutInputErrorText}>
          <Typography color="error" variant="caption">
            {t('cadence.form.error.timeoutMustBeStrictPositive')}
          </Typography>
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  timeoutSection: {
    paddingBottom: theme.spacing(2),
  },
  timeoutSelectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  timeoutInput: {
    minWidth: theme.spacing(6),
    flex: 1,
  },
  timeoutInputTextEnd: {
    flex: 9,
  },
  timeoutInputErrorText: {
    padding: theme.spacing(0),
    paddingBottom: theme.spacing(1),
    margin: theme.spacing(0),
  },
}));

export default React.memo(TimeoutForm);
