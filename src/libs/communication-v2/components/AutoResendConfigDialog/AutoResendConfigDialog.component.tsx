import React from 'react';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
// @ts-expect-error
import { TextField } from '#components/forms';

type Values = {
  resendCount: number;
  resendDelay: number;
};

export type Props = {
  open: boolean;
  handleSubmit: (data: Values) => void;
  handleClose: () => void;
  initial: Values;
};

const validationSchema = Yup.object({
  resendCount: Yup.number()
    .min(0)
    .max(5)
    .test(
      'check_resend_count_validity',
      '',
      function checkResendCountValidity(item) {
        if (item + this.parent.resendDelay > 0)
          return item > 0 && this.parent.resendDelay > 0;
        return true;
      },
    ),
  resendDelay: Yup.number()
    .min(0)
    .max(180)
    .test(
      'check_resend_count_validity',
      '',
      function checkResendCountValidity(item) {
        if (item + this.parent.resendCount > 0)
          return item > 0 && this.parent.resendCount > 0;
        return true;
      },
    ),
});

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },
  inputContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  adornment: {
    paddingLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  dialogContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  dialogTitle: {
    paddingBottom: theme.spacing(1),
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  cancelButton: {
    color: theme.palette.text.secondary,
  },
  submitButton: {
    margin: 0,
  },
}));

const AutoResendConfigDialog: React.FC<Props> = ({
  open,
  handleSubmit,
  handleClose,
  initial,
}) => {
  const { t } = useTranslation(['communication', 'common']);
  const classes = useStyles();

  return (
    <GenericResponsiveDialog
      fullScreenBreakpoint="xs"
      maxWidth="md"
      open={open}
    >
      <div className={classes.dialogContainer}>
        <Typography className={classes.dialogTitle} variant="h6">
          {t('resendSection.dialogTitle')}
        </Typography>

        <Formik
          initialValues={initial}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, isValid }: FormikProps<Values>) => {
            return (
              <Form>
                <div className={classes.inputContainer}>
                  <TextField
                    castAsNumber
                    fullWidth
                    helperText={t('resendSection.resendCount.helperText')}
                    inputProps={{ min: 0, max: 5 }}
                    label={t('resendSection.resendCount.label')}
                    name="resendCount"
                    type="number"
                  />
                </div>

                <div className={classes.inputContainer}>
                  <TextField
                    castAsNumber
                    fullWidth
                    helperText={t('resendSection.resendDelay.helperText')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          className={classes.adornment}
                          position="end"
                        >
                          <Typography>
                            {t('common:day', {
                              count: values.resendDelay,
                            })}
                          </Typography>
                        </InputAdornment>
                      ),
                      inputProps: { min: 0, max: 180 },
                    }}
                    label={t('resendSection.resendDelay.label')}
                    name="resendDelay"
                    type="number"
                  />
                </div>
                <div className={classes.dialogActions}>
                  <Button
                    className={classes.cancelButton}
                    onClick={handleClose}
                    variant="text"
                  >
                    {t('common:cancel')}
                  </Button>
                  <Button
                    className={classes.submitButton}
                    color="primary"
                    disabled={!isValid}
                    type="submit"
                    variant="contained"
                  >
                    {t('common:save')}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </GenericResponsiveDialog>
  );
};

export default React.memo(AutoResendConfigDialog);
