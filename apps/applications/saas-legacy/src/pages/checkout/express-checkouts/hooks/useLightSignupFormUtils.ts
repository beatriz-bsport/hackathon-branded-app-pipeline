import { useCallback, useMemo } from 'react';
import { useFormikContext } from 'formik';
import type { LightSignupFormValues } from '#src/pages/checkout/express-checkouts/components/LightSignupForm';
import { PHONE_NUMBER_IN_USE } from '#src/pages/checkout/express-checkouts/constants';
import {
  COACH_EDIT_EMAIL_ADDRESS_IS_STAFF_USER,
  COACH_EMAIL_ADDRESS_EXISTS,
} from '@bsport/common/lib/master-data/error-codes/associated-coach';
import { useTranslation } from 'react-i18next';
import { isAxiosError } from '#src/pages/checkout/express-checkouts/utils/typeGuard';

/**
 * Custom hook for form validation utilities
 *
 * ⚠️ IMPORTANT: This hook must be used within a component wrapped by withFormik or <Formik>
 *
 * @returns Object containing form validation utilities
 */
export const useLightSignupFormUtils = () => {
  let formikContext;

  try {
    formikContext = useFormikContext<LightSignupFormValues>();
  } catch (error) {
    throw new Error(
      `useLightSignupFormUtils must be used within a component wrapped by withFormik or <Formik>. ` +
        `Make sure the component using this hook is wrapped with lightSignupFormWrapper or is inside a <Formik> component. ` +
        `Original error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
    );
  }

  const { validateForm, setFieldError } = formikContext;

  const { t } = useTranslation('booking');

  const customFieldErrors = useMemo(
    () => ({
      [PHONE_NUMBER_IN_USE]: {
        fieldName: 'phone',
        message: t('booking:lightSignup.form.errors.phoneTaken'),
      },
      [COACH_EDIT_EMAIL_ADDRESS_IS_STAFF_USER]: {
        fieldName: 'email',
        message: t('booking:lightSignup.form.errors.emailTaken'),
      },
      [COACH_EMAIL_ADDRESS_EXISTS]: {
        fieldName: 'email',
        message: t('booking:lightSignup.form.errors.emailTaken'),
      },
    }),
    [t],
  );

  /**
   * Checks if the light signup form has validation errors
   *
   * @returns Promise<boolean> - true if form is invalid, false if valid
   */
  const getIsFormInvalid = useCallback(async (): Promise<boolean> => {
    try {
      const formErrors = await validateForm();
      return Object.values(formErrors).length > 0;
    } catch (error) {
      console.error('Form validation failed:', error);
      return true; // Assume invalid if validation fails
    }
  }, [validateForm]);

  const _getCustomFieldErrors = useCallback(
    (errorCode?: number) => {
      if (errorCode && errorCode in customFieldErrors) {
        const error =
          customFieldErrors[errorCode as keyof typeof customFieldErrors];
        setFieldError(error.fieldName, error.message);
      }
    },
    [setFieldError, customFieldErrors],
  );

  /**
   * Handles custom error codes for light signup form fields from API responses
   *
   * This function extracts error codes from Axios errors and maps them to specific
   * form field errors with translated messages. It's specifically designed to handle
   * common signup errors like phone number already in use or email conflicts.
   *
   * @param error - The error object to process, typically from an API call
   *                Can be an AxiosError containing response data with error_code,
   *                or undefined/null if no error occurred
   */
  const getLighSignUpCustomErrors = useCallback(
    (error: Error | undefined) => {
      _getCustomFieldErrors(
        isAxiosError(error) ? error.response?.data?.error_code : undefined,
      );
    },
    [_getCustomFieldErrors],
  );

  /**
   * Trims whitespace from all string fields in a LightSignupFormValues object.
   *
   * This function is necessary because the backend may return string values without
   * leading or trailing whitespace, while the frontend form values might contain
   * extraneous spaces. By trimming the form values before comparison, we ensure
   * consistency between the frontend and backend data. This consistency is crucial
   * for accurately determining whether an update is necessary, as it prevents
   * false positives caused by mere differences in whitespace.
   *
   * @param formValues - The LightSignupFormValues object containing form data.
   * @returns A new LightSignupFormValues object with all string fields trimmed of
   * leading and trailing whitespace.
   */
  const trimFormValues = useCallback(
    (formValues: LightSignupFormValues): LightSignupFormValues => {
      return {
        ...formValues,
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
      };
    },
    [],
  );

  return {
    getIsFormInvalid,
    getLighSignUpCustomErrors,
    trimFormValues,
  };
};
