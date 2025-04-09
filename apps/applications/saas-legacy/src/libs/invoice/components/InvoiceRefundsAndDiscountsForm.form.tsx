import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, LinearProgress, Paper, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Formik, FormikProps, FormikHelpers } from 'formik';

import type { OptionCallback } from '#src/state/types';
import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import InfoTypography from '#src/components/typo/InfoTypography.components';

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
}));

type FormValues = {
  is_custom_discount_reason_required: boolean;
  is_invoice_revert_reason_required: boolean;
};

type OwnProps = {
  isCompanyGerman?: boolean;
  submit: (
    value: FormValues,
    options?: OptionCallback<{
      is_custom_discount_reason_required: boolean;
      is_invoice_revert_reason_required: boolean;
    }>,
  ) => void;
  initial: FormValues;
};

type InvoiceFormContentProps = {
  formikProps: FormikProps<FormValues>;
  isCompanyGerman?: boolean;
  t: (key: string) => string;
  classes: ReturnType<typeof useStyles>;
};

const FORM_KEYS = {
  customDiscountJustification: 'is_custom_discount_reason_required',
  refundAndCancelJustification: 'is_invoice_revert_reason_required',
};

const InvoiceFormContent: React.FC<InvoiceFormContentProps> = ({
  formikProps,
  isCompanyGerman,
  t,
  classes,
}) => {
  return (
    <form onSubmit={formikProps.handleSubmit}>
      <Paper className={classes.container}>
        <Typography variant="h6">
          {t('invoice:configuration.refundsAndDiscount.title')}
        </Typography>
        <InfoTypography
          content={t('invoice:configuration.refundsAndDiscount.info')}
        />
        {Object.entries(FORM_KEYS).map(([key, formKey]) => (
          <SwitchField
            key={formKey}
            disabled={isCompanyGerman}
            label={t(
              `invoice:configuration.refundsAndDiscount.checkbox.${key}`,
            )}
            name={formKey}
          />
        ))}
        <div className={classes.buttonWrapper}>
          <Button
            color="primary"
            disabled={!formikProps.dirty}
            fullWidth={false}
            type="submit"
            variant="contained"
          >
            {t('common:save')}
          </Button>
        </div>
      </Paper>
      {formikProps.isSubmitting && <LinearProgress />}
    </form>
  );
};

const InvoiceRefundsAndDiscountsForm: React.FC<OwnProps> = ({
  initial = {
    is_custom_discount_reason_required: false,
    is_invoice_revert_reason_required: false,
  },
  submit,
  isCompanyGerman,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('invoice');

  const handleFormCompletion = (
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    setSubmitting(false);
  };

  const handleSubmit = useCallback(
    (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
      submit(values, {
        onSuccess: handleFormCompletion.bind(null, setSubmitting),
        onError: handleFormCompletion.bind(null, setSubmitting),
      });
    },
    [submit],
  );

  return (
    <Formik enableReinitialize initialValues={initial} onSubmit={handleSubmit}>
      {(formikProps) => (
        <InvoiceFormContent
          classes={classes}
          formikProps={formikProps}
          isCompanyGerman={isCompanyGerman}
          t={t}
        />
      )}
    </Formik>
  );
};

export default React.memo(InvoiceRefundsAndDiscountsForm);
