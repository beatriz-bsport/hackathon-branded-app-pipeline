import React from 'react';

import { useTranslation } from 'react-i18next';
import { ErrorMessage, useFormikContext } from 'formik';
import makeStyles from '@material-ui/core/styles/makeStyles';

import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import { WAITING_LIST_DYNAMIC_ORDERED } from '@bsport/common/lib/master-data/waiting-list-dynamic.js';
import NumericInput from '#src/components/input/NumericInput.component';
// @ts-expect-error
import { CheckboxField, SwitchField } from '#src/components/forms';
import type { WaitingListConfigurationFormikValues } from './WaitingListConfigurationForm.component';
import { WaitingListAutoCancellation } from '../types';

type Props = {
  handleAutoCancellationTypeChange: (
    value: WaitingListAutoCancellation,
  ) => () => void;
  handleNumericFieldChange: (
    field: string,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const WaitingListOrderedForm: React.FC<Props> = ({
  handleAutoCancellationTypeChange,
  handleNumericFieldChange,
}) => {
  const { t } = useTranslation('waitingList');
  const { values, errors, setFieldValue } =
    useFormikContext<WaitingListConfigurationFormikValues>();
  const classes = useStyles();

  const alertInfoContent = React.useMemo(() => {
    if (values.autoCancellationType === WaitingListAutoCancellation.dumb) {
      return t(
        `form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.overallExplainSimple`,
        {
          autokick_delay: values.autokickDelay ?? 0,
          dumb_delay_minutes: values.dumbDelayMinutes ?? 0,
        },
      );
    }
    const exampleHoursBefore = 3;
    const exampleComputedDelayOne = (
      exampleHoursBefore *
      60 *
      ((values.smartDelayPercentage ?? 0) / 100)
    ).toFixed(0);

    const exampleComputedDelayTwo = (
      (exampleHoursBefore * 60 - parseInt(exampleComputedDelayOne)) *
      ((values.smartDelayPercentage ?? 0) / 100)
    ).toFixed(0);
    return t(
      `form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.overallExplainSmart`,
      {
        autokick_delay: values.autokickDelay || 0,
        smart_delay_percentage: values.smartDelayPercentage || 0,
        example_hours_before: 3,
        example_computed_delay_one: exampleComputedDelayOne,
        example_computed_delay_two: exampleComputedDelayTwo,
      },
    );
  }, [
    t,
    values.autoCancellationType,
    values.autokickDelay,
    values.dumbDelayMinutes,
    values.smartDelayPercentage,
  ]);

  React.useEffect(() => {
    if (!values.autoConsumePack && values.kickIfNoPackWhenAutoConsume) {
      setFieldValue('kickIfNoPackWhenAutoConsume', false);
    }
  }, [
    values.autoConsumePack,
    values.kickIfNoPackWhenAutoConsume,
    setFieldValue,
  ]);

  return (
    <div>
      <div className={classes.row}>
        <InfoOutlineIcon className={classes.leftIcon} />
        <Typography color="textSecondary">
          {t(`form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.explain`)}
        </Typography>
      </div>
      <div className={classes.field}>
        <NumericInput
          error={!!errors.autokickDelay}
          fullWidth={false}
          helperText={t('form.autokick_delay.helper')}
          InputProps={{
            inputProps: { min: 2, step: 1, max: 100 },
          }}
          label={t('form.autokick_delay.label')}
          onChange={handleNumericFieldChange('autokickDelay')}
          value={values.autokickDelay}
        />
        <ErrorMessage name="autokickDelay">
          {(error_msg) => (
            <Typography color="error" variant="caption">
              {`${t(error_msg)}`}
            </Typography>
          )}
        </ErrorMessage>
      </div>
      <div className={classes.field}>
        <CheckboxField
          helperText={
            <Typography
              className={classes.helperText}
              color="textSecondary"
              variant="caption"
            >
              {t('form.auto_consume_pack.helper')}
            </Typography>
          }
          label={t('form.auto_consume_pack.label')}
          name="autoConsumePack"
        />
      </div>
      <div className={classes.field}>
        <CheckboxField
          disabled={!values.autoConsumePack}
          helperText={
            <Typography
              className={classes.helperText}
              color="textSecondary"
              variant="caption"
            >
              {t('form.kick_if_no_pack_when_auto_consume.helper')}
            </Typography>
          }
          label={t('form.kick_if_no_pack_when_auto_consume.label')}
          name="kickIfNoPackWhenAutoConsume"
        />
      </div>
      <div className={classes.field}>
        <NumericInput
          error={!!errors.lastDelayBeforeAutoConsume}
          fullWidth={false}
          helperText={t('form.last_delay_before_auto_consume.helper')}
          InputProps={{
            inputProps: { min: 0, step: 1 },
            endAdornment: <InputAdornment position="end">min</InputAdornment>,
          }}
          label={t('form.last_delay_before_auto_consume.label')}
          onChange={handleNumericFieldChange('lastDelayBeforeAutoConsume')}
          value={values.lastDelayBeforeAutoConsume}
        />
        <ErrorMessage name="lastDelayBeforeAutoConsume">
          {(error_msg) => (
            <Typography color="error" variant="caption">
              {`${t(error_msg)}`}
            </Typography>
          )}
        </ErrorMessage>
      </div>
      <div className={classes.divider} />
      <fieldset className={classes.column}>
        <legend>
          {t(`form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.settingsDelay`)}
        </legend>
        <Alert className={classes.alert} severity="info" variant="outlined">
          {alertInfoContent}
        </Alert>
        <div className={classes.field}>
          <FormControlLabel
            control={
              <Radio
                aria-label="simple"
                checked={
                  values.autoCancellationType ===
                  WaitingListAutoCancellation.dumb
                }
                name="simple"
                onChange={handleAutoCancellationTypeChange(
                  WaitingListAutoCancellation.dumb,
                )}
                value={WaitingListAutoCancellation.dumb}
              />
            }
            label={t('form.dumb_delay_minutes.label')}
          />
          <NumericInput
            disabled={
              values.autoCancellationType === WaitingListAutoCancellation.smart
            }
            error={!!errors.dumbDelayMinutes}
            InputProps={{
              inputProps: { min: 15, step: 1, max: 32000 },
              endAdornment: <InputAdornment position="end">min</InputAdornment>,
            }}
            onChange={handleNumericFieldChange('dumbDelayMinutes')}
            value={values.dumbDelayMinutes}
          />
          <ErrorMessage name="dumbDelayMinutes">
            {(error_msg) => (
              <Typography color="error" variant="caption">
                {`${t(error_msg)}`}
              </Typography>
            )}
          </ErrorMessage>
        </div>
        <div className={classes.field}>
          <FormControlLabel
            control={
              <Radio
                aria-label="smart"
                checked={
                  values.autoCancellationType ===
                  WaitingListAutoCancellation.smart
                }
                name="smart"
                onChange={handleAutoCancellationTypeChange(
                  WaitingListAutoCancellation.smart,
                )}
                value={WaitingListAutoCancellation.smart}
              />
            }
            label={t('form.smart_delay_percentage.label')}
          />
          <NumericInput
            disabled={
              values.autoCancellationType === WaitingListAutoCancellation.dumb
            }
            error={!!errors.smartDelayPercentage}
            fullWidth={false}
            InputProps={{
              inputProps: { min: 10, step: 1, max: 100 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            onChange={handleNumericFieldChange('smartDelayPercentage')}
            value={values.smartDelayPercentage}
          />
          <ErrorMessage name="smartDelayPercentage">
            {(error_msg) => (
              <Typography color="error" variant="caption">
                {`${t(error_msg)}`}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      </fieldset>
      <div className={classes.field}>
        <SwitchField
          label={t('form.display_member_position.label')}
          name="displayMemberPosition"
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  field: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  helperText: {
    marginTop: theme.spacing(-1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  alert: {
    alignItems: 'center',
  },
}));

export default React.memo(WaitingListOrderedForm);
