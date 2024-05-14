import React, { useCallback, useMemo } from 'react';

import { DateTime } from 'luxon';
import { Form, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

import { formatAsDate } from '#utils/datetime';
import DateInput from '#components/input/DateInput.component';
import NumericInput from '#components/input/NumericInput.component';

import { EXTENSION_OPTIONS } from './constants';

import type { ConsumerExtensionCreateFormValues } from './types';

type Props = {
  isLoading?: boolean;
  /** The consumer payment pack or consumer private pass ending date */
  passEndingDate?: string;
  timezone: string;
  onClose: () => void;
};

const ConsumerExtensionCreateForm: React.FC<Props> = ({
  isLoading,
  passEndingDate,
  timezone,
  onClose,
}) => {
  const { values, errors, isValid, isSubmitting, handleChange, setFieldValue } =
    useFormikContext<ConsumerExtensionCreateFormValues>();

  const { t } = useTranslation('paymentPack');

  const handleSelectNewValidityDate = useCallback(
    (selectedDate: DateTime) => {
      const numberOfDaysToAdd = selectedDate.diff(
        DateTime.fromISO(passEndingDate),
      ).days;
      setFieldValue('nbDays', numberOfDaysToAdd);
    },
    [passEndingDate, setFieldValue],
  );

  const newValidityDate = useMemo(
    () =>
      DateTime.fromISO(passEndingDate)
        .setZone(timezone)
        .plus({
          day: values.nbDays,
        })
        .toISO(),
    [passEndingDate, timezone, values.nbDays],
  );

  const classes = useStyles();

  return (
    <Form noValidate>
      <DialogTitle>{t('extension.create.title')}</DialogTitle>

      <DialogContent>
        <Grid item className={classes.radioGroupField} xs={12}>
          <RadioGroup
            name="extensionOption"
            onChange={handleChange}
            value={values.extensionOption}
          >
            {EXTENSION_OPTIONS.map(({ value, label }) => (
              <div key={value}>
                <FormControlLabel
                  key={value}
                  control={<Radio />}
                  disabled={isLoading}
                  label={t(label)}
                  value={value}
                />
              </div>
            ))}
          </RadioGroup>
        </Grid>

        {values.extensionOption === 'numericInput' && (
          <NumericInput
            fullWidth
            disabled={isLoading}
            error={!!errors.nbDays}
            helperText={t(errors.nbDays)}
            InputProps={{
              inputProps: { step: 1, min: 0 },
            }}
            label={t('extension.create.nbDays.label')}
            name="nbDays"
            onChange={handleChange}
            value={values.nbDays}
          />
        )}

        {values.extensionOption === 'datePicker' && !!passEndingDate && (
          <DateInput
            disabled={isLoading}
            label={t('extension.create.datePicker.label')}
            minDate={DateTime.fromISO(passEndingDate)}
            onChange={handleSelectNewValidityDate}
            value={DateTime.fromISO(newValidityDate)}
          />
        )}

        <TextField
          fullWidth
          multiline
          className={classes.field}
          error={!!errors.note}
          helperText={t(errors.note)}
          inputProps={{ maxLength: 500 }}
          label={t('extension.create.note.label')}
          name="note"
          onChange={handleChange}
          value={values.note}
          variant="outlined"
        />

        {!!passEndingDate && (
          <div className={classes.field}>
            <Typography variant="subtitle2">
              {t('extension.create.explain.oldDate') +
                formatAsDate(passEndingDate)}
            </Typography>
            <Typography variant="subtitle2">
              {t('extension.create.explain.newDate') +
                formatAsDate(newValidityDate)}
            </Typography>
          </div>
        )}

        <Alert
          classes={{ icon: classes.alignCenter }}
          className={classes.field}
          severity="warning"
          variant="outlined"
        >
          {t('extension.create.warning')}
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={onClose} variant="text">
          {t('extension.create.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={!isValid || isLoading || isSubmitting}
          type="submit"
          variant="text"
        >
          {t('extension.create.submit')}
        </Button>
      </DialogActions>
    </Form>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  radioGroupField: {
    marginBottom: theme.spacing(2),
  },
  field: {
    marginTop: theme.spacing(2),
  },
  alignCenter: {
    alignItems: 'center',
  },
}));

export default React.memo(ConsumerExtensionCreateForm);
