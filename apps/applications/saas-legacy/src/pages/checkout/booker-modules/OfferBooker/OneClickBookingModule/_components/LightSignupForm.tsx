import React from 'react';
import { Form, withFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { emailValidationRegExp } from '#src/libs/custom-form/constants';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { getItemInStorage, setItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES } from '#src/actions/constants';
import TextField from '#src/components/css-only/Fabrique/Temporary/Textfield';

export type LightSignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

const LightSignupForm = () => {
  const { t } = useTranslation('booking');

  return (
    <Form noValidate className="bs-light-signup-form__container">
      <div className="bs-light-signup-form__name-section">
        <TextField
          isFullWidth
          id="light-signup-first-name"
          inputId="light-signup-first-name-input"
          label={t('lightSignup.form.firstName.label')}
          name="firstName"
          placeholder={t('lightSignup.form.firstName.label')}
          size="lg"
        />
        <TextField
          isFullWidth
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
          id="light-signup-phone"
          inputId="light-signup-last-name-input"
          label={t('lightSignup.form.phone.label')}
          name="phone"
          placeholder={t('lightSignup.form.phone.placeholder')}
          size="lg"
          type="tel"
        />
      </div>
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
  phone: Yup.string().test(
    'is-phone',
    'booking:lightSignup.form.errors.phone',
    (value) => !value || isValidPhoneNumber(value),
  ),
});

export const lightSignupFormWrapper = withFormik<{}, LightSignupFormValues>({
  enableReinitialize: true,
  validateOnChange: false,
  validationSchema: lightSignupFormValidationSchema,
  handleSubmit: async (formValues) => {
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
        };
  },
});

export default LightSignupForm;
