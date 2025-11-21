import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Formik, FormikHelpers } from 'formik';
import Alert from '@material-ui/lab/Alert';
import type { FormValues } from '#src/libs/invoice/verifactu/types';
import { validationSchema } from '#src/libs/invoice/verifactu/validation';
import VerifactuChips from '#src/libs/invoice/verifactu/components/VerifactuChips.component';
import VerifactuFormFields from '#src/libs/invoice/verifactu/components/VerifactuFormFields.component';
import VerifactuRequirementsAlerts from '#src/libs/invoice/verifactu/components/VerifactuRequirementsAlerts.component';
import { FiskalyOnboardingRequirement } from '#src/libs/invoice/types';

type VerifactuFormProps = {
  initialValues: FormValues;
  requirements: FiskalyOnboardingRequirement[];
  onSaveForLater: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => Promise<void>;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => Promise<void>;
};

const VerifactuForm: React.FC<VerifactuFormProps> = ({
  initialValues,
  requirements,
  onSaveForLater,
  onSubmit,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');

  // Check if all critical requirements are met before allowing agreement creation
  // The "Create agreement" button is disabled if any of these requirements are missing
  const allRequirementsMet = !requirements.some(
    (req) =>
      req === FiskalyOnboardingRequirement.BUSINESS_VAT_ID_NOT_VERIFIED ||
      req === FiskalyOnboardingRequirement.BUSINESS_ADDRESS_NOT_PROVIDED ||
      req === FiskalyOnboardingRequirement.LEGAL_IDENTIFIER_NOT_ACTIVATED,
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      {(formikProps) => (
        <form onSubmit={formikProps.handleSubmit}>
          <VerifactuChips requirements={requirements} />
          <VerifactuRequirementsAlerts requirements={requirements} />

          <Typography className={classes.formTitle}>
            {t('configuration.verifactu.form.sectionTitle')}
          </Typography>

          <VerifactuFormFields formikProps={formikProps} />

          <Alert
            className={classes.warningAlert}
            severity="warning"
            variant="standard"
          >
            <Typography className={classes.alertContent} variant="body2">
              {t('configuration.verifactu.form.alert.content')}
            </Typography>
          </Alert>

          <div className={classes.buttonContainer}>
            <Button
              color="primary"
              disabled={formikProps.isSubmitting}
              onClick={() => onSaveForLater(formikProps.values, formikProps)}
              type="button"
              variant="outlined"
            >
              {t('configuration.verifactu.form.save_for_later')}
            </Button>
            {formikProps.isSubmitting && (
              <CircularProgress className={classes.loader} size={20} />
            )}
            <Button
              color="primary"
              disabled={formikProps.isSubmitting || !allRequirementsMet}
              type="submit"
              variant="contained"
            >
              {t('configuration.verifactu.form.create_agreement')}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  formTitle: {
    fontWeight: 590,
  },
  warningAlert: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  alertContent: {
    whiteSpace: 'pre-line',
  },
  buttonContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  loader: {
    marginLeft: theme.spacing(1.5),
  },
}));

export default VerifactuForm;
