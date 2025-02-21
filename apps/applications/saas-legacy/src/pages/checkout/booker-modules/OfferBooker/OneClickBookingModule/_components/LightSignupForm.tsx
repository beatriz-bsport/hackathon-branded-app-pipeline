import React from 'react';
import { Form, useFormikContext, withFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '#Fabrique/TextFieldV2';
import { useTranslation } from 'react-i18next';
import { emailValidationRegExp } from '#src/libs/custom-form/constants';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { getItemInStorage, setItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES } from '#src/actions/constants';

export type LightSignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

const LightSignupForm = () => {
  const { t } = useTranslation('booking');
  const { values, errors, handleChange, setFieldError } =
    useFormikContext<LightSignupFormValues>();

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldError(e.target.name, undefined);
    handleChange(e);
  };

  return (
    <Form noValidate className="bs-light-signup-form__container">
      <div className="bs-light-signup-form__name-section">
        <TextField
          isFullWidth
          isRequired
          classes={{ root: 'bs-light-signup-form__field' }}
          errorMessage={t(errors.firstName)}
          id="light-signup-first-name"
          inputId="light-signup-first-name-input"
          isError={!!errors.firstName}
          label={t('lightSignup.form.firstName.label')}
          name="firstName"
          onChange={handleFieldChange}
          placeholder={t('lightSignup.form.firstName.label')}
          type="text"
          value={values.firstName}
        />
        <TextField
          isFullWidth
          isRequired
          classes={{ root: 'bs-light-signup-form__field' }}
          errorMessage={t(errors.lastName)}
          id="light-signup-last-name"
          inputId="light-signup-last-name-input"
          isError={!!errors.lastName}
          label={t('lightSignup.form.lastName.label')}
          name="lastName"
          onChange={handleFieldChange}
          placeholder={t('lightSignup.form.lastName.label')}
          type="text"
          value={values.lastName}
        />
      </div>
      <div className="bs-light-signup-form__contact-section">
        <TextField
          isFullWidth
          isRequired
          classes={{ root: 'bs-light-signup-form__field' }}
          errorMessage={t(errors.email)}
          id="light-signup-email"
          inputId="light-signup-email-input"
          isError={!!errors.email}
          label={t('lightSignup.form.email.label')}
          name="email"
          onChange={handleFieldChange}
          placeholder={t('lightSignup.form.email.label')}
          type="email"
          value={values.email}
        />
        <TextField
          isFullWidth
          classes={{ root: 'bs-light-signup-form__field' }}
          errorMessage={t(errors.phone)}
          id="light-signup-phone"
          inputId="light-signup-last-name-input"
          isError={!!errors.phone}
          label={t('lightSignup.form.phone.label')}
          name="phone"
          onChange={handleFieldChange}
          placeholder={t('lightSignup.form.phone.placeholder')}
          type="tel"
          value={values.phone}
        />
      </div>
    </Form>
  );
};

const lightSignupFormValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('lightSignup.form.errors.requiredField'),
  lastName: Yup.string().required('lightSignup.form.errors.requiredField'),
  email: Yup.string()
    .matches(emailValidationRegExp, 'lightSignup.form.errors.email')
    .required('lightSignup.form.errors.requiredField'),
  phone: Yup.string().test(
    'is-phone',
    'lightSignup.form.errors.phone',
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
