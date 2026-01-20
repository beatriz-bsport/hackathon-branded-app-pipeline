import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import type {
  ConnectedTrigger,
  TriggerTimeoutConfig,
} from '#src/libs/sequential_marketing/types';

import {
  SequentialMarketingColors,
  TIMEOUT_TRIGGER_INPUT_WIDTH,
} from '#src/libs/sequential_marketing/constants';
import { CustomMuiIcon } from '#src/components/icons/CustomMuiIcon.component';
import NumericInput from '#src/components/input/NumericInput.component';
import useTimeoutContext from '../hooks/useTimeoutContext.hook';

type Props = {
  trigger: ConnectedTrigger;
  updateValue: (trigger: ConnectedTrigger) => void;
};

const LostTriggerTimeoutForm: React.FC<Props> = ({ trigger, updateValue }) => {
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
    <div className={classes.container}>
      <div className={classes.header}>
        <CustomMuiIcon
          defaultBackGround
          customColor={SequentialMarketingColors.LOSE_COLOR}
          icon="Timer"
          withBackground={false}
        />
        <Typography variant="subtitle1">
          {t('cadence.bubble.lostTrigger.timeout.title')}
        </Typography>
      </div>
      <div className={classes.timeoutConfiguration}>
        <Typography variant="body1">
          {t('cadence.bubble.lostTrigger.timeout.label')}
        </Typography>
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
      </div>
      {timeoutValue < 1 && (
        <Typography color="error" variant="caption">
          {t('cadence.form.error.timeoutMustBeStrictPositive')}
        </Typography>
      )}
      <Typography className={classes.helperText} variant="caption">
        {t('cadence.bubble.lostTrigger.timeout.helperText')}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  timeoutConfiguration: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  timeoutInput: {
    width: TIMEOUT_TRIGGER_INPUT_WIDTH,
  },
  helperText: {
    alignItems: 'center',
    color: theme.palette.grey[600],
  },
}));

export default React.memo(LostTriggerTimeoutForm);
