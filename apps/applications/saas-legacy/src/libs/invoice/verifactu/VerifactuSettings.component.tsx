import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { FormikHelpers } from 'formik';
import Alert from '@material-ui/lab/Alert';

import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc';
import type { FeatureList } from '#src/libs/company/types';
import {
  checkFiskalyOnboardingStatus,
  getFiskalyOnboardingRequirements,
  onboardFiskalyCompany,
} from '#src/libs/invoice/actions';
import { FiskalyOnboardingRequirement } from '#src/libs/invoice/types';
import {
  createPlatformCustomerEntityRepresentative,
  fetchPlatformCustomerEntityRepresentatives,
  updatePlatformCustomerEntityRepresentative,
} from '#src/libs/platform-billing/actions';
import {
  getPlatformCustomerEntityRepresentatives,
  getPlatformCustomerEntityRepresentativesLoading,
  // @ts-expect-error - selectors.js has no type definitions
} from '#src/libs/platform-billing/selectors';
import { UPSELL_IDENTIFIER_FISKALY_SIGN_ES } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import { snackbarSuccess, snackbarError } from '#src/libs/snackbar/actions';
import type { RootState } from '#src/reducers';
import type { FormValues } from '#src/libs/invoice/verifactu/types';
import VerifactuForm from '#src/libs/invoice/verifactu/components/VerifactuForm.component';

const VerifactuSettings: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');
  const dispatch = useDispatch();
  const isVerifactuEnabled = useSafeFlag(FeatureFlags.VERIFACTU_SETTINGS);
  const representatives = useSelector((state: RootState) =>
    getPlatformCustomerEntityRepresentatives(state),
  );
  const isLoadingRepresentatives = useSelector((state: RootState) =>
    getPlatformCustomerEntityRepresentativesLoading(state),
  );
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true);
  const [requirements, setRequirements] = useState<
    FiskalyOnboardingRequirement[]
  >([]);
  const isMountedRef = useRef(true);

  // Get the first representative from Redux state
  const representative = representatives?.[0] || null;

  const initialValues: FormValues = useMemo(
    () => ({
      first_name: representative?.first_name || '',
      last_name: representative?.last_name || '',
      dni_nie: representative?.identification_number || '',
      address: representative?.address_street || '',
      street_number: representative?.address_number || '',
      postal_code: representative?.address_postal_code || '',
      city: representative?.address_city || '',
      municipality: representative?.address_municipality || '',
      country: representative?.address_country_code || 'ES',
    }),
    [representative],
  );

  useEffect(() => {
    isMountedRef.current = true;

    dispatch(
      checkFiskalyOnboardingStatus({
        onSuccess: (data) => {
          if (!isMountedRef.current) return;
          setIsLoadingOnboarding(false);

          if (!data) return;

          setIsOnboarded(data.is_onboarded);

          if (data.is_onboarded) return;

          // Fetch onboarding requirements & representatives if not onboarded already
          dispatch(
            getFiskalyOnboardingRequirements({
              onSuccess: (requirementsData) => {
                if (!isMountedRef.current) return;
                if (requirementsData) {
                  setRequirements(requirementsData.requirements || []);
                }
              },
              onError: () =>
                console.error('Failed to fetch onboarding requirements'),
            }),
          );
          dispatch(
            fetchPlatformCustomerEntityRepresentatives({
              onError: () => console.error('Failed to fetch representatives'),
            }),
          );
        },
        onError: () => {
          if (!isMountedRef.current) return;
          console.error('Failed to check onboarding status');
          setIsLoadingOnboarding(false);
          setIsOnboarded(false);
        },
      }),
    );

    return () => {
      isMountedRef.current = false;
    };
  }, [dispatch]);

  const handleSaveForLater = useCallback(
    (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
      return new Promise<void>((resolve) => {
        formikHelpers.setSubmitting(true);

        // Only first_name and last_name are required for "save for later"
        // Other fields can be saved partially filled
        if (!values.first_name || !values.last_name) {
          if (!values.first_name) {
            formikHelpers.setFieldError('first_name', 'common:requiredField');
          }
          if (!values.last_name) {
            formikHelpers.setFieldError('last_name', 'common:requiredField');
          }
          formikHelpers.setSubmitting(false);
          return resolve();
        }

        // Validate format of filled fields (but don't require them)
        formikHelpers.validateForm().then((errors) => {
          const formatErrors: Record<string, string> = {};
          Object.keys(errors).forEach((key) => {
            const error = errors[key as keyof typeof errors];
            // Only keep format validation errors, not required field errors
            if (
              error &&
              error !== 'common:requiredField' &&
              values[key as keyof FormValues]
            ) {
              formatErrors[key] = error;
            }
          });
          if (Object.keys(formatErrors).length > 0) {
            formikHelpers.setErrors(formatErrors);
            formikHelpers.setSubmitting(false);
            return resolve();
          }

          try {
            // Map form values to API format
            // Empty strings are included to clear fields that were previously filled
            const representativeData = {
              first_name: values.first_name,
              last_name: values.last_name,
              identification_number: values.dni_nie || '',
              address_street: values.address || '',
              address_number: values.street_number || '',
              address_postal_code: values.postal_code || '',
              address_city: values.city || '',
              address_municipality: values.municipality || '',
              address_country_code: values.country || '',
            };

            if (representative?.id) {
              // Update existing representative
              dispatch(
                updatePlatformCustomerEntityRepresentative(
                  representative.id,
                  representativeData,
                  {
                    onSuccess: () => {
                      dispatch(
                        snackbarSuccess(
                          t(
                            'configuration.verifactu.form.save_for_later_success',
                          ),
                        ),
                      );
                      formikHelpers.setSubmitting(false);
                      resolve();
                    },
                    onError: () => {
                      dispatch(
                        snackbarError(
                          t(
                            'configuration.verifactu.form.save_for_later_error',
                          ),
                        ),
                      );
                      formikHelpers.setSubmitting(false);
                      resolve();
                    },
                  },
                ),
              );
            } else {
              // Create new representative
              dispatch(
                createPlatformCustomerEntityRepresentative(representativeData, {
                  onSuccess: () => {
                    dispatch(
                      snackbarSuccess(
                        t(
                          'configuration.verifactu.form.save_for_later_success',
                        ),
                      ),
                    );
                    formikHelpers.setSubmitting(false);
                    resolve();
                  },
                  onError: () => {
                    dispatch(
                      snackbarError(
                        t('configuration.verifactu.form.save_for_later_error'),
                      ),
                    );
                    formikHelpers.setSubmitting(false);
                    resolve();
                  },
                }),
              );
            }
          } catch (error) {
            console.error('Failed to save for later:', error);
            formikHelpers.setSubmitting(false);
            resolve();
          }
        });
      });
    },
    [dispatch, representative, t],
  );

  const handleSubmit = useCallback(
    (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
      return new Promise<void>((resolve) => {
        // Validate all fields are filled (including DNI/NIE for create agreement)
        formikHelpers.validateForm().then((errors) => {
          if (Object.keys(errors).length > 0) {
            formikHelpers.setErrors(errors);
            formikHelpers.setSubmitting(false);
            return resolve();
          }

          // Check that all fields have values (including DNI/NIE)
          if (!values.dni_nie || values.dni_nie.trim() === '') {
            formikHelpers.setFieldError('dni_nie', 'common:requiredField');
            formikHelpers.setSubmitting(false);
            return resolve();
          }

          const hasEmptyFields = Object.values(values).some(
            (value) => !value || String(value).trim() === '',
          );
          if (hasEmptyFields) {
            Object.keys(values).forEach((key) => {
              const value = values[key as keyof FormValues];
              if (!value || String(value).trim() === '') {
                formikHelpers.setFieldError(key, 'common:requiredField');
              }
            });
            formikHelpers.setSubmitting(false);
            return resolve();
          }

          dispatch(
            onboardFiskalyCompany({
              onSuccess: (data) => {
                if (data?.agreement_url) {
                  window.open(data.agreement_url, '_blank');
                }
                formikHelpers.setSubmitting(false);
                resolve();
              },
              onError: () => {
                formikHelpers.setSubmitting(false);
                resolve();
              },
            }),
          );
        });
      });
    },
    [dispatch],
  );

  const renderContent = (isUpsellEnabled: boolean): React.ReactElement => {
    // Show loading only on initial load when we don't have representatives yet
    // Don't hide the form during update/create operations (isLoadingRepresentatives
    // becomes true during those operations but we already have data)
    const shouldShowLoading =
      isLoadingOnboarding ||
      (isLoadingRepresentatives && !representatives?.length);
    if (shouldShowLoading) {
      return (
        <Typography variant="body2">
          {t('configuration.verifactu.loading')}
        </Typography>
      );
    }

    // Company is already onboarded - show signed agreement upload form
    if (isOnboarded) {
      // TODO: has_uploaded_signed_agreement
      return <div>Signed agreement upload form</div>;
    }

    // Upsell not activated - show info alert to contact Account Manager
    if (!isUpsellEnabled) {
      return (
        <Alert className={classes.alert} severity="info">
          {t('configuration.verifactu.info')}
        </Alert>
      );
    }

    // Upsell activated and not onboarded - show onboarding form
    return (
      <VerifactuForm
        initialValues={initialValues}
        onSaveForLater={handleSaveForLater}
        onSubmit={handleSubmit}
        requirements={requirements}
      />
    );
  };

  if (!isVerifactuEnabled) return null;

  return (
    <FeatureListProvider>
      {(featureList: FeatureList) => {
        const hasUpsellActivated = hasUpsell(
          featureList,
          UPSELL_IDENTIFIER_FISKALY_SIGN_ES,
        );
        // Check if upsell is enabled, but override to false if UPSELL_NOT_ACTIVATED
        // requirement is present (indicates upsell was deactivated)
        const isUpsellEnabled =
          hasUpsellActivated &&
          !requirements.includes(
            FiskalyOnboardingRequirement.UPSELL_NOT_ACTIVATED,
          );

        return (
          <Paper className={classes.paper}>
            <div className={classes.header}>
              <Typography component="h3" variant="h6">
                {t('configuration.verifactu.title')}
              </Typography>
            </div>
            <div className={classes.content}>
              <Typography className={classes.bodyText} variant="body2">
                {t('configuration.verifactu.description')}
              </Typography>
            </div>

            {renderContent(isUpsellEnabled)}
          </Paper>
        );
      }}
    </FeatureListProvider>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  content: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  bodyText: {
    width: '100%',
    color: theme.palette.text.secondary,
  },
  alert: {
    marginTop: theme.spacing(2),
    alignItems: 'center',
  },
}));

export default VerifactuSettings;
