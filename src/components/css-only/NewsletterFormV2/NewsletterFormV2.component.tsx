import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import TextField from '#Fabrique/TextFieldV2';
import Button from '#Fabrique/ButtonV2';
import Typography from '#Fabrique/Typography';
import { emailValidationRegExp } from '#libs/custom-form/constants';

import { NewsletterV2FieldsKind } from '#libs/marketplace/constants';

import './styles.css';
import { OptionCallback } from '../../../state/types';

// @ts-expect-error
import Analytics from '#components/analytics/Analytics.component';

const NewsletterFormSchema = Yup.object({
  firstName: Yup.string().nullable(),
  lastName: Yup.string().nullable(),
  email: Yup.string().matches(emailValidationRegExp).required(),
});

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
};

export type Props = {
  /** The variant aka the fields to display: Full name and email, email only.. */
  fieldsType: `${NewsletterV2FieldsKind}`;
  /** The custom title text, displayed if `showTitle` is set to `true` */
  title?: string;
  /** If `true`, displays the title. If no custom text provided, a default one is provided as fallback. */
  showTitle?: boolean;
  /** The custom subtitle text, displayed if `showSubtitle` is set to `true` */
  subtitle?: string;
  /** If `true`, displays the subtitle. If no custom text provided, a default one is provided as fallback. */
  showSubtitle?: boolean;
  /** The action to perform once the form is submitted. The field values from formik are passed into the handler. */
  onSubmit: (
    {
      email,
      first_name,
      last_name,
    }: {
      email: string;
      first_name: string;
      last_name: string;
    },
    options: OptionCallback,
  ) => void;
};

type Values = {
  email: string;
  firstName: string;
  lastName: string;
};

const NewsletterFormV2: React.FC<Props> = ({
  fieldsType,
  title,
  showTitle,
  subtitle,
  showSubtitle,
  onSubmit,
}) => {
  const { t } = useTranslation('marketing');

  const handleSubmit = useCallback(
    (values: Values, formikHelpers: FormikHelpers<Values>) => {
      return onSubmit(
        {
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
        },
        {
          onSuccess: () => {
            formikHelpers?.resetForm();
            Analytics.newsletterSubmitSuccess({
              email: values.email,
              first_name: values.firstName,
              last_name: values.lastName,
            });
          },
        },
      );
    },
    [onSubmit],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NewsletterFormSchema}
    >
      {(formik) => (
        <div className="bs-newsletter-form__container">
          <div className="bs-newsletter-form__root">
            {(showTitle || showSubtitle) && (
              <div className="bs-newsletter-form__root__text">
                {showTitle && (
                  <Typography
                    className="bs-newsletter-form__root__text__title"
                    variant="title-md"
                  >
                    {title || t('marketing:newsletter.formV2.title')}
                  </Typography>
                )}
                {showSubtitle && (
                  <Typography
                    className="bs-newsletter-form__root__text__subtitle"
                    variant="body-md"
                  >
                    {subtitle || t('marketing:newsletter.formV2.subtitle')}
                  </Typography>
                )}
              </div>
            )}

            <Form className="bs-newsletter-form__root__form">
              <div className="bs-newsletter-form__root__form-fields">
                {fieldsType !== 'emailOnly' && (
                  <div className="bs-newsletter-form__root__form__name-fields">
                    <TextField
                      classes={{
                        inputContainer:
                          'bs-newsletter-form__root__form__field-input-container',
                        label: 'bs-newsletter-form__root__form__field-label',
                        input: 'bs-newsletter-form__root__form__field-input',
                      }}
                      id="bs-newsletter-form-field-container-first-name"
                      inputId="bs-newsletter-form-field-first-name"
                      label={t('marketing:newsletter.form.firstName')}
                      name="firstName"
                      onChange={formik.handleChange}
                      placeholder={t('marketing:newsletter.form.firstName')}
                      size="sm"
                      value={formik.values.firstName}
                    />
                    {fieldsType !== 'firstNameAndEmail' && (
                      <TextField
                        classes={{
                          inputContainer:
                            'bs-newsletter-form__root__form__field-input-container',
                          label: 'bs-newsletter-form__root__form__field-label',
                          input: 'bs-newsletter-form__root__form__field-input',
                        }}
                        id="bs-newsletter-form-field-container-last-name"
                        inputId="bs-newsletter-form-field-last-name"
                        label={t('marketing:newsletter.form.lastName')}
                        name="lastName"
                        onChange={formik.handleChange}
                        placeholder={t('marketing:newsletter.form.lastName')}
                        size="sm"
                        value={formik.values.lastName}
                      />
                    )}
                  </div>
                )}

                <TextField
                  isRequired
                  classes={{
                    inputContainer:
                      'bs-newsletter-form__root__form__field-input-container',
                    label: 'bs-newsletter-form__root__form__field-label',
                    input: 'bs-newsletter-form__root__form__field-input',
                  }}
                  helperText={
                    !formik.isValid &&
                    (formik.values.email
                      ? t('marketing:newsletter.formV2.error.invalidEmail')
                      : t('marketing:newsletter.formV2.error.emailRequired'))
                  }
                  id="bs-newsletter-form-field-container-email"
                  inputId="bs-newsletter-form-field-email"
                  isError={!!formik.errors.email}
                  label={t('marketing:newsletter.formV2.email')}
                  name="email"
                  onChange={formik.handleChange}
                  placeholder={t('marketing:newsletter.formV2.email')}
                  size="sm"
                  type="email"
                  value={formik.values.email}
                />
              </div>

              <Button
                isRippleEnabled
                className="bs-newsletter-form__root__form__submit"
                color="primary"
                isDisabled={!!formik.errors.email || !formik.values.email}
                type="submit"
                variant="contained"
              >
                {t('marketing:newsletter.formV2.validate')}
              </Button>
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export const NewsletterFormBase = marketplaceCssHoc<Props>()(
  React.memo(NewsletterFormV2),
);

export default React.memo(NewsletterFormV2);
