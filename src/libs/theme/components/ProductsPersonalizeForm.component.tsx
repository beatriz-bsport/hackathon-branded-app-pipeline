import React from 'react';
import { useTranslation } from 'react-i18next';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Theme, makeStyles } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { CompanyTheme } from '../types';
import { OptionCallback } from '../../../state/types';
// @ts-expect-error
import { SwitchField } from '#components/forms';

interface FormikValues {
  hide_credits_for_customers: boolean;
}

type Props = {
  productTheme: Partial<CompanyTheme>;
  onSubmit: (id: number, data: FormData, options: OptionCallback) => void;
};

const ProductsPersonalizeForm: React.FC<FormikProps<FormikValues>> = ({
  isSubmitting,
  isValid,
  handleSubmit,
}) => {
  const { t } = useTranslation(['theme']);
  const classes = useStyles();

  return (
    <Form onSubmit={handleSubmit}>
      <div className={classes.main}>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.productsThemePersonalization.title')}
          </Typography>
          <Typography className={classes.namesSubHeader}>
            {t('forms.productsThemePersonalization.credits.subTitle')}
          </Typography>
          <SwitchField
            name="hide_credits_for_customers"
            label={t('forms.productsThemePersonalization.credits.label')}
            helperText={t(
              'forms.productsThemePersonalization.credits.description',
            )}
          />
        </div>
      </div>
      <Button
        disabled={isSubmitting || !isValid}
        variant="contained"
        color="primary"
        type="submit"
        className={classes.confirm}
      >
        {t('forms.submit')}
      </Button>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    display: 'grid',
    gap: theme.spacing(4),
    gridTemplateColumns: 'repeat(auto-fill, minmax(700px, 1fr) ) ',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minWidth: 700,
  },
  namesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: `${theme.spacing(2)}px 0`,
  },
  namesSubHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirm: {
    marginTop: theme.spacing(2),
  },
}));

const ProductsPersonalizeFormSchema = Yup.object().shape({
  hide_credits_for_customers: Yup.boolean().required(),
});

const ProductsPersonalizeFormFormikHOC = withFormik<Props, FormikValues>({
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
  validationSchema: ProductsPersonalizeFormSchema,
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

export default ProductsPersonalizeFormFormikHOC(ProductsPersonalizeForm);
