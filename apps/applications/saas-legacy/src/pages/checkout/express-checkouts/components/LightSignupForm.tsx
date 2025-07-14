import React from 'react';
import { Form, withFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { emailValidationRegExp } from '#src/libs/custom-form/constants';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { getItemInStorage, setItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES } from '#src/actions/constants';
import TextField from '#src/components/css-only/Fabrique/Temporary/Textfield';
import Checkboxfield from '#src/components/css-only/Fabrique/Temporary/Checkboxfield';
import AcceptTermsAndConditions from '#src/components/css-only/Fabrique/Temporary/AcceptTermsAndConditions';
import { TermsAndConditionType } from '#src/libs/payment/types';
import { useTheme } from '#src/pages/marketplace/passes/hooks/useTheme';
import PasswordField from '#src/components/css-only/Fabrique/Temporary/PasswordField';

export type LightSignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  acceptEmail: boolean;
  acceptSms: boolean;
  acceptTermsAndConditions: boolean;
};

const LightSignupForm = () => {
  const { t } = useTranslation('booking');

  const { general_terms_and_conditions } = useTheme() ?? {};

  return (
    <Form noValidate className="bs-light-signup-form__container">
      <div className="bs-light-signup-form__name-section">
        <TextField
          isFullWidth
          isRequired
          id="light-signup-first-name"
          inputId="light-signup-first-name-input"
          label={t('lightSignup.form.firstName.label')}
          name="firstName"
          placeholder={t('lightSignup.form.firstName.label')}
          size="lg"
        />
        <TextField
          isFullWidth
          isRequired
          id="light-signup-last-name"
          inputId="light-signup-last-name-input"
          label={t('lightSignup.form.lastName.label')}
          name="lastName"
          placeholder={t('lightSignup.form.lastName.label')}
          size="lg"
        />
      </div>
      <div className="bs-light-signup-form__contact-section">
        <TextField
          isFullWidth
          isRequired
          id="light-signup-email"
          inputId="light-signup-email-input"
          label={t('lightSignup.form.email.label')}
          name="email"
          placeholder={t('lightSignup.form.email.label')}
          size="lg"
          type="email"
        />
        <TextField
          isFullWidth
          isRequired
          id="light-signup-phone"
          inputId="light-signup-last-name-input"
          label={t('lightSignup.form.phone.label')}
          name="phone"
          placeholder={t('lightSignup.form.phone.placeholder')}
          size="lg"
          type="tel"
        />
      </div>
      <div className="bs-light-signup-form__password-section">
        <PasswordField
          id="light-signup-password"
          label={t('lightSignup.form.password.label')}
          name="password"
          size="lg"
        />
      </div>
      <Checkboxfield
        id="light-signup-accept-email"
        label={t('lightSignup.form.acceptEmail.label')}
        name="acceptEmail"
      />
      <Checkboxfield
        id="light-signup-accept-sms"
        label={t('lightSignup.form.acceptSms.label')}
        name="acceptSms"
      />

      <AcceptTermsAndConditions
        id="one-click-checkout-terms-and-conditions"
        label={t('lightSignup.form.acceptTermsAndCondition.label')}
        name="acceptTermsAndConditions"
        termsAndConditions={general_terms_and_conditions}
        type={TermsAndConditionType.TERMS_AND_CONDITIONS}
      />
    </Form>
  );
};

const lightSignupFormValidationSchema = Yup.object().shape({
  firstName: Yup.string().required(
    'booking:lightSignup.form.errors.requiredField',
  ),
  lastName: Yup.string().required(
    'booking:lightSignup.form.errors.requiredField',
  ),
  email: Yup.string()
    .matches(emailValidationRegExp, 'booking:lightSignup.form.errors.email')
    .required('booking:lightSignup.form.errors.requiredField'),
  phone: Yup.string()
    .required('booking:lightSignup.form.errors.requiredField')
    .test(
      'is-phone',
      'booking:lightSignup.form.errors.phone',
      (value) => !value || isValidPhoneNumber(value),
    ),
  password: Yup.string()
    .required('booking:lightSignup.form.errors.requiredField')
    .matches(
      /^[^\s]{6,}$/,
      'booking:lightSignup.form.errors.passwordMinimumRequirements',
    ),
  passwordConfirm: Yup.string()
    .required('booking:lightSignup.form.errors.requiredField')
    .oneOf(
      [Yup.ref('password')],
      'booking:lightSignup.form.errors.passwordConfirmation',
    ),
  acceptEmail: Yup.boolean(),
  acceptSms: Yup.boolean(),
  acceptTermsAndConditions: Yup.boolean(),
});

export const lightSignupFormWrapper = withFormik<{}, LightSignupFormValues>({
  enableReinitialize: true,
  validateOnChange: true,
  validationSchema: lightSignupFormValidationSchema,
  handleSubmit: async (formValues) => {
    formValues.phone = formValues.phone.replace(/\s+/g, '');
    setItemInStorage(
      'local',
      STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES,
      JSON.stringify(formValues),
    );
  },
  mapPropsToValues: () => {
    return getItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES)
      ? JSON.parse(
          getItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES) || '',
        )
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          passwordConfirm: '',
          acceptEmail: false,
          acceptSms: false,
          acceptTermsAndConditions: false,
        };
  },
});

export default LightSignupForm;
