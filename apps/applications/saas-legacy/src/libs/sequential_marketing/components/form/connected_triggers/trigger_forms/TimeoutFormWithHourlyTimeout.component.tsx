import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import NumericInput from '#src/components/input/NumericInput.component';

import type {
  ConnectedTrigger,
  TriggerTimeoutConfig,
} from '#src/libs/sequential_marketing/types';
import useTimeoutContext from '../hooks/useTimeoutContextWithHourlyTimeout.hook';

type Props = {
  trigger: ConnectedTrigger;
  updateValue: (trigger: ConnectedTrigger) => void;
};

const TimeoutForm: React.FC<Props> = ({ trigger, updateValue }) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles();

  const {
    timeoutValue,
    handleChangeTimeout,
    timeoutHoursValue,
    handleChangeTimeoutHours,
  } = useTimeoutContext(
    (trigger?.trigger_config as TriggerTimeoutConfig)?.timeout,
    (trigger?.trigger_config as TriggerTimeoutConfig)?.timeout_hours ?? null,
  );

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

  const handleUpdateTriggerWithNewTimeoutHours = React.useCallback(
    (newTimeout: number) => {
      const updatedTrigger = {
        ...trigger,
        trigger_config: {
          ...trigger?.trigger_config,
          timeout_hours: newTimeout,
        },
      };
      updateValue?.(updatedTrigger);
    },
    [trigger, updateValue],
  );

  const handleUpdateTimeout = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target) return;
      const { value } = event.target;
      const trimmed = value.trim();

      // Empty input -> treat as 0 (or you can choose null if you prefer)
      if (trimmed === '') {
        handleUpdateTriggerWithNewTimeout(0);
        handleChangeTimeout?.(event);
        return;
      }

      const parsed = parseFloat(trimmed);

      // Invalid number -> do not update timeout, just propagate change
      if (Number.isNaN(parsed) || !Number.isFinite(parsed) || parsed < 0) {
        handleUpdateTriggerWithNewTimeout(0);
        handleChangeTimeout?.(event);
        return;
      }

      // Valid number
      handleUpdateTriggerWithNewTimeout(parsed);
      handleChangeTimeout?.(event);
    },
    [handleChangeTimeout, handleUpdateTriggerWithNewTimeout],
  );

  const handleUpdateTimeoutHours = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target) return;
      const { value } = event.target;
      const trimmed = value.trim();

      // Empty input -> treat as 0 (same behavior as before)
      if (trimmed === '') {
        handleUpdateTriggerWithNewTimeoutHours(0);
        handleChangeTimeoutHours?.(event);
        return;
      }

      const parsed = parseFloat(trimmed);

      // Invalid number or "0" -> 0
      if (Number.isNaN(parsed) || !Number.isFinite(parsed) || parsed === 0) {
        handleUpdateTriggerWithNewTimeoutHours(0);
        handleChangeTimeoutHours?.(event);
        return;
      }

      // Valid positive number
      handleUpdateTriggerWithNewTimeoutHours(parsed);
      handleChangeTimeoutHours?.(event);
    },
    [handleChangeTimeoutHours, handleUpdateTriggerWithNewTimeoutHours],
  );

  return (
    <>
      <div className={classes.selectorContainer}>
        <Typography variant="body1">
          {t('cadence.form.trigger.triggerTimeoutLabel')}
        </Typography>
        <div className={classes.timeoutInput}>
          <NumericInput
            error={timeoutValue < 0}
            InputProps={{
              inputProps: { step: 1, min: 0 },
            }}
            onChange={handleUpdateTimeout}
            value={timeoutValue}
          />
        </div>
        <Typography variant="body1">
          {t('cadence.form.trigger.triggerTimeoutDaysAnd', {
            count: timeoutValue,
          })}
        </Typography>
        <div className={classes.timeoutInput}>
          <NumericInput
            error={timeoutHoursValue < 0 || timeoutHoursValue > 23}
            inputClass={classes.timeoutInputHours}
            InputProps={{
              inputProps: { step: 1, min: 0, max: 23 },
            }}
            onChange={handleUpdateTimeoutHours}
            value={timeoutHoursValue}
          />
        </div>
        <div className={classes.inputEndText}>
          <Typography variant="body1">
            {t('cadence.form.trigger.triggerTimeoutHours', {
              count: timeoutHoursValue,
            })}
          </Typography>
        </div>
      </div>
      {timeoutValue <= 0 && timeoutHoursValue <= 0 && (
        <div className={classes.inputErrorText}>
          <Typography color="error" variant="caption">
            {t(
              'cadence.form.error.timeoutMustBeStrictPositiveWithHourlyTimeout',
            )}
          </Typography>
        </div>
      )}
      {timeoutHoursValue > 23 && (
        <div className={classes.inputErrorText}>
          <Typography color="error" variant="caption">
            {t('cadence.form.error.timeoutHoursMustBeMax23')}
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
  timeoutInputHours: {
    width: '100%',
  },
  inputErrorText: {
    padding: theme.spacing(0),
    paddingBottom: theme.spacing(1),
    margin: theme.spacing(0),
  },
}));

export default React.memo(TimeoutForm);
