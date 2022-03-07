import React from 'react';

import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { Formik, FormikProps } from 'formik';

import { Button, LinearProgress, Paper, Typography } from '@material-ui/core';

import { OptionCallback } from '../../../state/types';
import { SwitchField } from '#libs/custom-form/components/GenericFormik.input';
import InfoTypography from '#components/typo/InfoTypography.components';

type OwnProps = {
  submit: (
    value: FormData,
    options?: OptionCallback<{ is_tax_excluded_in_marketplace: boolean }>,
  ) => void;
  initial?: { is_tax_excluded_in_marketplace: boolean };
};
type Props = OwnProps;

export const TaxDisplayForm = (props: Props) => {
  const { initial, submit } = props;

  const classes = useStyles();
  const { t } = useTranslation(['common', 'theme']);
  const initialValues = initial;

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          const data = new FormData();
          data.append(
            'is_tax_excluded_in_marketplace',
            values.is_tax_excluded_in_marketplace,
          );
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
        {(
          formikProps: FormikProps<{
            is_tax_excluded_in_marketplace: boolean;
          }>,
        ) => {
          return (
            <form onSubmit={formikProps.handleSubmit}>
              <Paper className={classes.container}>
                <Typography variant="h6">
                  {t('theme:taxDisplay.title')}
                </Typography>
                <InfoTypography content={t('theme:taxDisplay.info')} />
                <SwitchField
                  name="is_tax_excluded_in_marketplace"
                  label={t('theme:taxDisplay.checkbox')}
                />
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={
                      formikProps.values.is_tax_excluded_in_marketplace ===
                      initial.is_tax_excluded_in_marketplace
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

TaxDisplayForm.defaultProps = {
  initial: { is_tax_excluded_in_marketplace: false },
};

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

export default TaxDisplayForm;
