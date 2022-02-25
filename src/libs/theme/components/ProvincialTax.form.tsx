import React from 'react';

import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';

import {
  Button,
  InputAdornment,
  LinearProgress,
  Paper,
  Typography,
} from '@material-ui/core';

import { Info } from '@material-ui/icons';
import classNames from 'classnames';
import { OptionCallback } from '../../../state/types';
import { TextFieldEnhancedLabelWithError } from '../../../components/forms';

type OwnProps = {
  submit: (
    data: FormData,
    options?: OptionCallback<{ name: string; value: number }>,
  ) => void;
  initial?: { name: string; value: number };
};
type Props = OwnProps;

export const ProvincialTaxForm = (props: Props) => {
  const { initial, submit } = props;

  const classes = useStyles();
  const { t } = useTranslation('theme');
  return (
    <div>
      <Formik
        enableReinitialize
        validationSchema={provincialTaxSchema}
        initialValues={{ value: initial.value || 0, name: initial.name || '' }}
        onSubmit={(values, actions) => {
          const data = new FormData();
          data.append('provincial_tax_name', values.name);
          data.append('provincial_tax_value', values.value);
          submit(data, {
            onSuccess: () => {
              actions.setSubmitting(false);
            },
            onError: () => {
              actions.setSubmitting(false);
            },
          });
        }}
      >
        {(formikProps: FormikProps<{ name: string; value: number }>) => {
          return (
            <form onSubmit={formikProps.handleSubmit}>
              <Paper className={classes.paperContainer}>
                <Typography variant="h6">
                  {t('forms.provincialTax.title')}
                </Typography>
                <div className={classes.infoRow}>
                  <Info />
                  <Typography className={classes.grey} variant="body2">
                    {t('forms.provincialTax.info')}
                  </Typography>
                </div>
                <div className={classNames(classes.row, classes.mid)}>
                  <TextFieldEnhancedLabelWithError
                    name="name"
                    label={t('forms.provincialTax.taxName')}
                    helperText={t('forms.provincialTax.taxHelperText')}
                    fullWidth
                  />
                  <TextFieldEnhancedLabelWithError
                    name="value"
                    type="number"
                    label={t('forms.provincialTax.taxValue')}
                    InputProps={{
                      inputProps: { min: 0, max: 100, step: 0.001 },
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    fullWidth
                    helperText=" "
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={
                      !formikProps.isValid ||
                      formikProps.values.name === '' ||
                      (formikProps.values.name === initial.name &&
                        formikProps.values.value === initial.value)
                    }
                  >
                    {t('common:save')}
                  </Button>
                </div>
              </Paper>

              {formikProps.isSubmitting ? <LinearProgress /> : null}
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  grey: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
  mid: {
    width: '50%',
    minWidth: theme.spacing(60),
  },
  paperContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
  row: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  infoRow: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
export default ProvincialTaxForm;
const provincialTaxSchema = Yup.object().shape({
  name: Yup.string().required('common:requiredField'),
  value: Yup.number().required('common:requiredField'),
});
