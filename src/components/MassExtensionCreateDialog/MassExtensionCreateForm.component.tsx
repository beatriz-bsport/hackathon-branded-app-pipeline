import React, { useCallback } from 'react';

import { Form, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import DateInput from '#components/input/DateInput.component';
import NumericInput from '#components/input/NumericInput.component';

import type { MassExtensionCreateFormValues } from './types';

type Props = {
  isLoading?: boolean;
  onClose: () => void;
};

const MassExtensionCreateForm: React.FC<Props> = ({ onClose, isLoading }) => {
  const { t } = useTranslation('paymentPack');

  const { values, errors, isValid, isSubmitting, handleChange, setFieldValue } =
    useFormikContext<MassExtensionCreateFormValues>();

  const classes = useStyles();

  const handleSetMinEndingDate = useCallback(
    (value: DateTime) => setFieldValue('minEndingDate', value.toISODate()),
    [setFieldValue],
  );

  const handleSetMaxEndingDate = useCallback(
    (value: DateTime) => setFieldValue('maxEndingDate', value.toISODate()),
    [setFieldValue],
  );

  return (
    <Form noValidate>
      <DialogTitle>{t('massExtension.titleDialog')}</DialogTitle>

      <DialogContent>
        <Typography>{t('massExtension.dateHelpText')}</Typography>

        <div className={classes.dateContainer}>
          <DateInput
            className={classes.dateInput}
            error={!!errors.minEndingDate}
            InputLabelProps={{
              shrink: true,
            }}
            label={t('massExtension.minDate')}
            name="minEndingDate"
            onChange={handleSetMinEndingDate}
            value={DateTime.fromISO(values.minEndingDate)}
          />
          <DateInput
            className={classes.dateInput}
            error={!!errors.maxEndingDate}
            InputLabelProps={{
              shrink: true,
            }}
            label={t('massExtension.maxDate')}
            name="maxEndingDate"
            onChange={handleSetMaxEndingDate}
            value={DateTime.fromISO(values.maxEndingDate)}
          />
        </div>

        <NumericInput
          fullWidth
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

        <TextField
          fullWidth
          multiline
          className={classes.marginTop}
          error={!!errors.note}
          helperText={t(errors.note)}
          inputProps={{ maxLength: 500 }}
          label={t('extension.create.note.label')}
          name="note"
          onChange={handleChange}
          value={values.note}
          variant="outlined"
        />

        <Alert className={classes.marginTop} severity="info" variant="outlined">
          {t('massExtension.helpText')}
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={onClose} variant="text">
          {t('massExtension.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={!isValid || isLoading || isSubmitting}
          type="submit"
          variant="text"
        >
          {t('massExtension.submit')}
        </Button>
      </DialogActions>
    </Form>
  );
};

const useStyles = makeStyles((theme) => ({
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  dateInput: {
    width: '100%',
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(MassExtensionCreateForm);
