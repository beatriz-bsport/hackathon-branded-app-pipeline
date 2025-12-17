import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormikHelpers } from 'formik';
import {
  createPlatformCustomerEntityRepresentative,
  updatePlatformCustomerEntityRepresentative,
} from '#src/libs/platform-billing/actions';
import {
  onboardFiskalyCompany,
  uploadSignedAgreement,
  getSoftwareRegistrationUrl,
} from '#src/libs/invoice/actions';
import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';
import type { FormValues } from '#src/libs/invoice/verifactu/types';
import type { PlatformCustomerEntityRepresentative } from '#src/libs/platform-billing/type';

type CreateOrUpdateRepresentativeData = {
  first_name: string;
  last_name: string;
  identification_number: string;
  address_street: string;
  address_number: string;
  address_postal_code: string;
  address_city: string;
  address_municipality: string;
  address_country_code: string;
};

/**
 * Helper to create formik-compatible callbacks that handle setSubmitting
 */
const createFormikCallbacks = <T>(
  formikHelpers: FormikHelpers<T>,
  onSuccess?: () => void,
  onError?: () => void,
) => ({
  onSuccess: () => {
    formikHelpers.setSubmitting(false);
    onSuccess?.();
  },
  onError: () => {
    formikHelpers.setSubmitting(false);
    onError?.();
  },
});

/**
 * Maps form values to API format for representative data
 */
const mapFormValuesToRepresentativeData = (
  values: FormValues,
): CreateOrUpdateRepresentativeData => ({
  first_name: values.first_name,
  last_name: values.last_name,
  identification_number: values.dni_nie || '',
  address_street: values.address || '',
  address_number: values.street_number || '',
  address_postal_code: values.postal_code || '',
  address_city: values.city || '',
  address_municipality: values.municipality || '',
  address_country_code: values.country || '',
});

/**
 * Creates or updates a representative
 */
const createOrUpdateRepresentative = (
  dispatch: any,
  representative: PlatformCustomerEntityRepresentative | null,
  representativeData: CreateOrUpdateRepresentativeData,
  callbacks: {
    onSuccess: () => void;
    onError: () => void;
  },
) => {
  if (representative?.id) {
    dispatch(
      updatePlatformCustomerEntityRepresentative(
        representative.id,
        representativeData,
        callbacks,
      ),
    );
  } else {
    dispatch(
      createPlatformCustomerEntityRepresentative(representativeData, callbacks),
    );
  }
};

/**
 * Hook that provides form submission handlers for the Verifactu onboarding flow.
 *
 * Handles three main operations:
 * 1. **handleSaveForLater**: Saves representative details without creating the agreement.
 *    - Only requires first_name and last_name
 *    - Validates format of filled fields but doesn't require all fields
 *    - Creates or updates the representative in the platform
 *
 * 2. **handleOnboardCompany**: Creates/regenerates the Social Collaboration Agreement.
 *    - Validates all fields are filled (including DNI/NIE)
 *    - Creates or updates the representative first
 *    - Then calls onboardFiskalyCompany to generate/regenerate the agreement PDF
 *    - Updates state to show the sign & upload form (step 2)
 *
 * 3. **handleUploadSignedAgreement**: Uploads the signed agreement PDF.
 *    - Accepts a File and manages upload state
 *    - Updates the signed agreement file URL on success
 *    - Shows success/error snackbars
 *
 * All handlers manage Formik's setSubmitting state and return Promises
 * for proper async form handling.
 */
export const useVerifactuHandlers = (
  representative: PlatformCustomerEntityRepresentative | null,
  setAgreementUrl: (url: string | null) => void,
  setIsOnboarded: (onboarded: boolean) => void,
  setSignedAgreementFile: (file: string | null) => void,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('b2b_invoice');

  const handleSaveForLater = useCallback(
    (
      values: FormValues,
      formikHelpers: FormikHelpers<FormValues>,
    ): Promise<void> => {
      return new Promise<void>((resolve) => {
        formikHelpers.setSubmitting(true);

        // Only first_name and last_name are required for "save for later"
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

          const representativeData = mapFormValuesToRepresentativeData(values);

          createOrUpdateRepresentative(
            dispatch,
            representative,
            representativeData,
            createFormikCallbacks(
              formikHelpers,
              () => {
                dispatch(
                  snackbarSuccess(
                    t('configuration.verifactu.form.save_for_later_success'),
                  ),
                );
                resolve();
              },
              () => {
                dispatch(
                  snackbarError(
                    t('configuration.verifactu.form.save_for_later_error'),
                  ),
                );
                resolve();
              },
            ),
          );
        });
      });
    },
    [dispatch, representative, t],
  );

  const handleOnboardCompany = useCallback(
    (
      values: FormValues,
      formikHelpers: FormikHelpers<FormValues>,
    ): Promise<void> => {
      return new Promise<void>((resolve) => {
        formikHelpers.setSubmitting(true);

        // Validate all fields are filled
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

          // Create or update representative before onboarding
          const representativeData = mapFormValuesToRepresentativeData(values);

          createOrUpdateRepresentative(
            dispatch,
            representative,
            representativeData,
            {
              onSuccess: () => {
                // After successful create/update, proceed with onboarding
                dispatch(
                  onboardFiskalyCompany({
                    onSuccess: (data) => {
                      if (!data?.agreement_url) {
                        console.error('No agreement URL found');
                        formikHelpers.setSubmitting(false);
                        resolve();
                        return;
                      }

                      dispatch(
                        snackbarSuccess(
                          t(
                            'configuration.verifactu.onboarding.agreement_created',
                          ),
                        ),
                      );
                      setAgreementUrl(data.agreement_url);
                      setIsOnboarded(true);
                      formikHelpers.setSubmitting(false);
                      resolve();
                    },
                    onError: () => {
                      dispatch(
                        snackbarError(
                          t(
                            'configuration.verifactu.onboarding.agreement_error',
                          ),
                        ),
                      );
                      formikHelpers.setSubmitting(false);
                      resolve();
                    },
                  }),
                );
              },
              onError: () => {
                dispatch(
                  snackbarError(
                    t('configuration.verifactu.form.representative_error'),
                  ),
                );
                formikHelpers.setSubmitting(false);
                resolve();
              },
            },
          );
        });
      });
    },
    [dispatch, representative, t, setAgreementUrl, setIsOnboarded],
  );

  const handleUploadSignedAgreement = useCallback(
    (
      file: File,
      setIsUploadingFile: (uploading: boolean) => void,
    ): Promise<void> => {
      return new Promise<void>((resolve) => {
        setIsUploadingFile(true);
        dispatch(
          uploadSignedAgreement(file, {
            onSuccess: (data) => {
              dispatch(
                snackbarSuccess(
                  t('configuration.verifactu.signed_agreement.upload_success'),
                ),
              );
              setSignedAgreementFile(data?.file || null);
              setIsUploadingFile(false);
              resolve();
            },
            onError: () => {
              dispatch(
                snackbarError(
                  t('configuration.verifactu.signed_agreement.upload_error'),
                ),
              );
              setIsUploadingFile(false);
              resolve();
            },
          }),
        );
      });
    },
    [dispatch, t, setSignedAgreementFile],
  );

  const handleGetSoftwareRegistrationUrl = useCallback(() => {
    dispatch(
      getSoftwareRegistrationUrl({
        onSuccess: (data) => {
          if (data?.software_registration_url) {
            window.open(data.software_registration_url, '_blank');
          } else {
            dispatch(
              snackbarError(
                t('configuration.verifactu.active.certificate_error'),
              ),
            );
          }
        },
        onError: () => {
          dispatch(
            snackbarError(
              t('configuration.verifactu.active.certificate_error'),
            ),
          );
        },
      }),
    );
  }, [dispatch, t]);

  return {
    handleSaveForLater,
    handleOnboardCompany,
    handleUploadSignedAgreement,
    handleGetSoftwareRegistrationUrl,
  };
};
