import React from 'react';
import { useTranslation } from 'react-i18next';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Theme, makeStyles } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { SwitchField } from '#components/forms';
import { CompanyTheme } from '../types';
import { OptionCallback } from '../../../state/types';
// @ts-expect-error

interface FormikValues {
  hide_credits_for_customers: boolean;
}

type OwnProps = {
  productTheme: Partial<CompanyTheme>;
  onSubmit: (id: number, data: FormData, options: OptionCallback) => void;
};

const CreditsPersonalizeForm: React.FC<FormikProps<FormikValues>> = ({
  isSubmitting,
  isValid,
  handleSubmit,
}) => {
  const { t } = useTranslation(['theme']);
  const classes = useStyles();

  return (
    <Form onSubmit={handleSubmit}>
      <div className={classes.section}>
        <Typography className={classes.namesSubHeader}>
          {t('forms.productsThemePersonalization.credits.subTitle')}
        </Typography>
        <SwitchField
          helperText={t(
            'forms.productsThemePersonalization.credits.description',
          )}
          label={t('forms.productsThemePersonalization.credits.label')}
          name="hide_credits_for_customers"
        />
      </div>
      <Button
        className={classes.confirm}
        color="primary"
        disabled={isSubmitting || !isValid}
        type="submit"
        variant="contained"
      >
        {t('forms.submit')}
      </Button>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  namesSubHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirm: {
    marginTop: theme.spacing(2),
  },
}));

const CreditsPersonalizeFormSchema = Yup.object().shape({
  hide_credits_for_customers: Yup.boolean().required(),
});

const CreditsPersonalizeFormFormikHOC = withFormik<OwnProps, FormikValues>({
  mapPropsToValues: ({ productTheme }) => {
    if (productTheme) {
      return {
        hide_credits_for_customers: productTheme.hide_credits_for_customers,
      };
    }
    return {
      hide_credits_for_customers: false,
    };
  },
  validationSchema: CreditsPersonalizeFormSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, productTheme }, setSubmitting },
  ) => {
    const data = new FormData();
    data.append(
      'hide_credits_for_customers',
      values.hide_credits_for_customers.toString(),
    );
    onSubmit(productTheme.company, data, {
      onSuccess: () => setSubmitting(false),
      onError: () => {
        setSubmitting(false);
      },
    });
  },
});

export default CreditsPersonalizeFormFormikHOC(CreditsPersonalizeForm);
