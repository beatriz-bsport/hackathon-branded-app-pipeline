import React from 'react';
import { compose, withState } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import * as Yup from 'yup';
import { Form, withFormik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme, CircularProgress } from '@material-ui/core';
import LocaleSelector from '#src/components/input/LocaleSelector.component';
import ValidationIcon from '#src/components/icons/ValidationIcon.component';
import ErrorIcon from '#src/components/icons/ErrorIcon.component';
import { StripeReader } from '#src/libs/terminal/types';
// @ts-expect-error
import { TextField } from '../../../../components/forms';
import { OptionCallback } from '../../../../state/types';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  dialogPaper: {
    minWidth: '30vw',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  loadingTitle: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loadingExplain: {
    fontWeight: 400,
    textAlign: 'center',
  },
  successTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  loadingExplainContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  validateIcon: {
    height: '110px',
    width: '110px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  errorMessage: {
    color: theme.palette.error.dark,
  },
  mustCreateLocationExplain: {
    marginTop: theme.spacing(4),
  },
}));

export interface FormikValues {
  registration_code?: string;
  label: string;
  country?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postal_code?: string;
  state?: string;
}

type OwnProps = {
  setOpenDialog: (open: boolean) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  createReaderAndFetch: (data: any, options?: OptionCallback) => void;
  selectedReaderToUpdate: StripeReader | null;
  // eslint-disable-next-line react/no-unused-prop-types
  editReaderAndFetch: (
    readerId: string,
    label: string,
    options?: OptionCallback,
  ) => void;
  displayForm: boolean;
  displaySuccess: boolean;
  displayError: boolean;
  setDisplayForm: (value: boolean) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  setDisplaySuccess: (value: boolean) => void;
  setDisplayError: (value: boolean) => void;
  setSelectedReaderToUpdate: (reader: StripeReader | null) => void;
  mustCreateStripeLocation: boolean;
};

export type Props = OwnProps & FormikProps<FormikValues>;

const COUNTRIES_REQUIRING_LOCATION_ADDRESS_STATE = [
  'AU',
  'CA',
  'ES',
  'US',
  'IT',
];

export const StripeTerminalRegisterReaderDialog: React.FC<Props> = (props) => {
  const classes = useStyles();

  const { t } = useTranslation(['invoice']);

  return (
    <div>
      <Dialog open classes={{ paper: classes.dialogPaper }}>
        {props.displayForm && (
          <DialogTitle>
            {props.selectedReaderToUpdate
              ? t('configuration.stripeTerminal.connectDialog.title.edit')
              : t('configuration.stripeTerminal.connectDialog.title.connect')}
          </DialogTitle>
        )}
        <div className={classes.container}>
          {props.displayForm &&
            (!props.isSubmitting || props.selectedReaderToUpdate) && (
              <Form className={classes.formContainer}>
                <TextField
                  label={t(
                    'configuration.stripeTerminal.connectDialog.form.readerLabel',
                  )}
                  name="label"
                />
                {!props.selectedReaderToUpdate && (
                  <TextField
                    helperText={t(
                      'configuration.stripeTerminal.connectDialog.form.registrationCodeHelperText',
                    )}
                    label={t(
                      'configuration.stripeTerminal.connectDialog.form.registrationCode',
                    )}
                    name="registration_code"
                  />
                )}

                {props.mustCreateStripeLocation && (
                  <>
                    <Typography className={classes.mustCreateLocationExplain}>
                      {t(
                        'configuration.stripeTerminal.connectDialog.mustCreateStripeLocation',
                      )}
                    </Typography>
                    <LocaleSelector
                      distinctCountry
                      hideLang
                      noMargin
                      label={t('translation:form.address.country')}
                      onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                        props.setFieldValue('country', ev.target.value);
                      }}
                      value={props.values.country}
                      valueKey="country"
                    />
                    <TextField
                      label={t('translation:form.address.addressLine1')}
                      name="line1"
                    />
                    <TextField
                      label={t('translation:form.address.addressLine2')}
                      name="line2"
                    />
                    <TextField
                      label={t('translation:form.address.city')}
                      name="city"
                    />
                    <TextField
                      label={t('translation:form.address.zipcode')}
                      name="postal_code"
                    />
                    {COUNTRIES_REQUIRING_LOCATION_ADDRESS_STATE.includes(
                      props.values.country,
                    ) && (
                      <TextField
                        label={t('translation:form.address.state')}
                        name="state"
                      />
                    )}
                  </>
                )}

                <DialogActions>
                  <Button
                    disabled={props.isSubmitting}
                    onClick={() => {
                      props.setSelectedReaderToUpdate(null);
                      props.setOpenDialog(false);
                    }}
                  >
                    {t('navigation:backofficeMenu.goBack')}
                  </Button>
                  {props.isSubmitting ? (
                    <CircularProgress />
                  ) : (
                    <Button color="primary" type="submit" variant="contained">
                      {props.selectedReaderToUpdate
                        ? t(
                            'configuration.stripeTerminal.connectDialog.form.update',
                          )
                        : t(
                            'configuration.stripeTerminal.connectDialog.form.connect',
                          )}
                    </Button>
                  )}
                </DialogActions>
              </Form>
            )}
          {props.isSubmitting && !props.selectedReaderToUpdate && (
            <>
              <div className={classes.centerContainer}>
                <Typography
                  align="center"
                  className={classes.loadingTitle}
                  variant="h6"
                >
                  {t(
                    'configuration.stripeTerminal.connectDialog.title.connect',
                  )}
                </Typography>
                <CircularProgress size={30} />
                <div className={classes.loadingExplainContainer}>
                  <Typography className={classes.loadingExplain}>
                    {t('configuration.stripeTerminal.connectDialog.loading1')}
                  </Typography>
                  <Typography className={classes.loadingExplain}>
                    {t('configuration.stripeTerminal.connectDialog.loading2')}
                  </Typography>
                </div>
              </div>
            </>
          )}
          {props.displaySuccess && !props.isSubmitting && (
            <div className={classes.centerContainer}>
              <div className={classes.validateIcon}>
                <ValidationIcon color="#4CAF50" />
              </div>
              <Typography className={classes.successTitle} variant="h6">
                {t('configuration.stripeTerminal.connectDialog.title.success')}
              </Typography>
              <Typography>
                {t('configuration.stripeTerminal.connectDialog.success')}
              </Typography>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={() => props.setOpenDialog(false)}
                >
                  {t(
                    'configuration.stripeTerminal.connectDialog.form.continue',
                  )}
                </Button>
              </DialogActions>
            </div>
          )}
          {props.displayError && !props.isSubmitting && (
            <div className={classes.centerContainer}>
              <div className={classes.validateIcon}>
                <ErrorIcon />
              </div>
              <Typography className={classes.successTitle} variant="h6">
                {t('configuration.stripeTerminal.connectDialog.title.error')}
              </Typography>
              <Typography className={classes.errorMessage}>
                {t('configuration.stripeTerminal.connectDialog.error1')}
              </Typography>
              <Typography className={classes.errorMessage}>
                {t('configuration.stripeTerminal.connectDialog.error2')}
              </Typography>
              <DialogActions>
                <Button onClick={() => props.setOpenDialog(false)}>
                  {t('common:cancel')}
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    props.setDisplayError(false);
                    props.setDisplayForm(true);
                  }}
                  variant="contained"
                >
                  {t('configuration.stripeTerminal.connectDialog.form.retry')}
                </Button>
              </DialogActions>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

const connectReaderFormSchema = Yup.object().shape({
  label: Yup.string().required(),
  registration_code: Yup.string().required(),
  country: Yup.string().length(2).when('must_create_stripe_location', {
    is: true,
    then: Yup.string().required(),
  }),
  line1: Yup.string().when('must_create_stripe_location', {
    is: true,
    then: Yup.string().required(),
  }),
  line2: Yup.string(),
  city: Yup.string().when('must_create_stripe_location', {
    is: true,
    then: Yup.string().required(),
  }),
  postal_code: Yup.string().when('must_create_stripe_location', {
    is: true,
    then: Yup.string().required(),
  }),
  state: Yup.string().when('country', {
    is: (countryCode) =>
      COUNTRIES_REQUIRING_LOCATION_ADDRESS_STATE.includes(countryCode),
    then: Yup.string().required(),
  }),
});

const editReaderFormSchema = Yup.object().shape({
  label: Yup.string().required(),
});

export const ConnectReaderFormHOC = withFormik<Props, FormikValues>({
  mapPropsToValues: (props: Props) => {
    if (props.selectedReaderToUpdate) {
      return { label: props.selectedReaderToUpdate.label };
    }
    return {
      label: '',
      registration_code: '',
      city: '',
      country: '',
      line1: '',
      line2: '',
      state: '',
      postal_code: '',
      must_create_stripe_location: props.mustCreateStripeLocation,
    };
  },
  validationSchema: (props: Props) => {
    if (props.selectedReaderToUpdate) return editReaderFormSchema;
    return connectReaderFormSchema;
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    if (!props.selectedReaderToUpdate) {
      const data = { ...values };
      if (
        !COUNTRIES_REQUIRING_LOCATION_ADDRESS_STATE.includes(values.country)
      ) {
        data.state = null;
      }
      props.setDisplayForm(false);
      props.createReaderAndFetch(data, {
        onSuccess: () => {
          setSubmitting(false);
          props.setDisplaySuccess(true);
        },
        onError: () => {
          setSubmitting(false);
          props.setDisplayError(true);
        },
      });
    } else {
      props.editReaderAndFetch(props.selectedReaderToUpdate.id, values.label, {
        onSuccess: () => {
          setSubmitting(false);
          props.setSelectedReaderToUpdate(null);
          props.setOpenDialog(false);
        },
        onError: () => {
          setSubmitting(false);
          props.setSelectedReaderToUpdate(null);
          props.setOpenDialog(false);
        },
      });
    }
  },
});

export const StripeTerminalRegisterReaderDialogForStorybook =
  StripeTerminalRegisterReaderDialog;

export default compose(
  withState('displayForm', 'setDisplayForm', true),
  withState('displaySuccess', 'setDisplaySuccess', false),
  withState('displayError', 'setDisplayError', false),
  ConnectReaderFormHOC,
)(StripeTerminalRegisterReaderDialog);
