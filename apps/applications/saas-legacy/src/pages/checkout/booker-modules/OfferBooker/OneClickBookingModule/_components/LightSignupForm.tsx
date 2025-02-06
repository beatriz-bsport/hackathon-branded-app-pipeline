import React, { useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import TextField from '#Fabrique/TextFieldV2';
import { useTranslation } from 'react-i18next';
import { emailValidationRegExp } from '#src/libs/custom-form/constants';
import { isValidPhoneNumber } from 'libphonenumber-js';
import Typography from '#Fabrique/Typography';
import ButtonV2 from '#src/components/css-only/Fabrique/ButtonV2';
import Loader from './Loader';

export type LightSignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

type SubmitFunction = (
  formValues: LightSignupFormValues,
  helpers: FormikHelpers<LightSignupFormValues>,
) => Promise<void>;

type PropsType = {
  submitValidatedForm: SubmitFunction;
};

const LightSignupForm = ({ submitValidatedForm }: PropsType) => {
  const { t } = useTranslation('booking');
  const [submitError, setSubmitError] = useState<string | undefined>();
  const onSubmit: SubmitFunction = async (formValues, helpers) => {
    const formErrors = await helpers.validateForm();
    const isFormValid = Object.values(formErrors).length === 0;
    if (!isFormValid) {
      setSubmitError(t('lightSignup.form.errors.global'));
      return;
    }
    setSubmitError(undefined);
    localStorage.setItem('lightSignupFormValues', JSON.stringify(formValues));
    try {
      await submitValidatedForm(formValues, helpers);
    } catch {
      setSubmitError(t('lightSignup.form.errors.global'));
    }
  };

  const initialValues: LightSignupFormValues = localStorage.getItem(
    'lightSignupFormValues',
  )
    ? JSON.parse(localStorage.getItem('lightSignupFormValues') || '')
    : {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      };

  return (
    <Formik<LightSignupFormValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={lightSignupFormValidationSchema}
    >
      {({ values, errors, handleChange, isSubmitting }) => (
        <Form noValidate className="bs-light-signup-form__container">
          <TextField
            isFullWidth
            isRequired
            errorMessage={t(errors.email)}
            id="light-signup-email"
            inputId="light-signup-email-input"
            isError={!!errors.email}
            label={t('lightSignup.form.email.label')}
            name="email"
            onChange={handleChange}
            placeholder={t('lightSignup.form.email.label')}
            type="email"
            value={values.email}
          />
          <TextField
            isFullWidth
            isRequired
            errorMessage={t(errors.firstName)}
            id="light-signup-first-name"
            inputId="light-signup-first-name-input"
            isError={!!errors.firstName}
            label={t('lightSignup.form.firstName.label')}
            name="firstName"
            onChange={handleChange}
            placeholder={t('lightSignup.form.firstName.label')}
            type="text"
            value={values.firstName}
          />
          <TextField
            isFullWidth
            isRequired
            errorMessage={t(errors.lastName)}
            id="light-signup-last-name"
            inputId="light-signup-last-name-input"
            isError={!!errors.lastName}
            label={t('lightSignup.form.lastName.label')}
            name="lastName"
            onChange={handleChange}
            placeholder={t('lightSignup.form.lastName.label')}
            type="text"
            value={values.lastName}
          />
          <TextField
            isFullWidth
            errorMessage={t(errors.phone)}
            id="light-signup-phone"
            inputId="light-signup-last-name-input"
            isError={!!errors.phone}
            label={t('lightSignup.form.phone.label')}
            name="phone"
            onChange={handleChange}
            placeholder={t('lightSignup.form.phone.placeholder')}
            type="tel"
            value={values.phone}
          />
          {submitError && (
            <Typography color="error" variant="body-sm">
              {submitError}
            </Typography>
          )}
          <ButtonV2
            className="bs-light-signup-form__submit-button"
            type="submit"
          >
            {isSubmitting ? (
              <div className="bs-light-signup-form__submit-button-loader">
                <Loader />
              </div>
            ) : (
              t('lightSignup.form.button.label')
            )}
          </ButtonV2>
        </Form>
      )}
    </Formik>
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
    (value) => isValidPhoneNumber(value),
  ),
});

export default LightSignupForm;
