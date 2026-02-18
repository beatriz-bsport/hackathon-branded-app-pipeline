import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import TextField from '#Fabrique/TextFieldV2';
import Button from '#Fabrique/ButtonV2';
import Typography from '#Fabrique/Typography';
import BigIcon from '#Fabrique/BigIcon';
import { emailValidationRegExp } from '#src/libs/custom-form/constants';

import { NewsletterV2FieldsKind } from '#src/libs/marketplace/constants';

import './styles.css';
import { OptionCallback } from '../../../state/types';
import analyticsUtils from '#src/components/analytics/analytics';
import ReCAPTCHA from 'react-google-recaptcha';
import Config from '#src/config';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

const NewsletterFormSchema = Yup.object({
  firstName: Yup.string().nullable(),
  lastName: Yup.string().nullable(),
  email: Yup.string().matches(emailValidationRegExp).required(),
});

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  recaptcha: '',
};

type FormProps = {
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
      recaptcha,
    }: {
      email: string;
      first_name: string;
      last_name: string;
      recaptcha: string;
    },
    options: OptionCallback,
  ) => void;
};

type SuccessProps = {
  successTitle?: string;
  showSuccessTitle?: boolean;
  successText?: string;
  showSuccessText?: boolean;
};

export type Props = FormProps & SuccessProps;

type Values = {
  email: string;
  firstName: string;
  lastName: string;
  recaptcha: string;
};

const NewsletterFormV2SuccessStateComponent: React.FC<SuccessProps> = ({
  successTitle,
  showSuccessTitle,
  successText,
  showSuccessText,
}) => {
  return (
    <div className="bs-newsletter-form__success__root">
      <BigIcon variant="success" />
      {(showSuccessTitle || showSuccessText) && (
        <div className="bs-newsletter-form__success__text__root">
          {showSuccessTitle && (
            <Typography
              className="bs-newsletter-form__success__title"
              variant="title-md"
            >
              {successTitle}
            </Typography>
          )}
          {showSuccessText && (
            <Typography
              className="bs-newsletter-form__success__text"
              variant="body-md"
            >
              {successText}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

const NewsletterFormV2: React.FC<Props> = React.memo(
  ({
    fieldsType,
    title,
    showTitle,
    subtitle,
    showSubtitle,
    onSubmit,
    successTitle,
    showSuccessTitle,
    successText,
    showSuccessText,
  }) => {
    const [isSuccessState, setIsSuccessState] = React.useState(false);
    const [isCaptchaValidated, setIsCaptchaValidated] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const { t } = useTranslation('marketing');
    const recaptchaRef = React.useRef<ReCAPTCHA>(null);
    const requireCaptcha = useSafeFlag(
      FeatureFlags.LEAD_ACQUISITION_WIDGET_REQUIRE_RECAPTCHA,
    );

    const handleSubmit = useCallback(
      (values: Values, formikHelpers: FormikHelpers<Values>) => {
        setIsSubmitting(true);

        return onSubmit(
          {
            email: values.email,
            first_name: values.firstName,
            last_name: values.lastName,
            recaptcha: recaptchaRef.current?.getValue() || '',
          },
          {
            onSuccess: () => {
              formikHelpers?.resetForm();
              recaptchaRef.current?.reset();
              setIsCaptchaValidated(false);
              analyticsUtils.onLeadAcquisitionSuccess({
                email: values.email,
                first_name: values.firstName,
                last_name: values.lastName,
              });
              setIsSuccessState(true);
              setIsSubmitting(false);
              setTimeout(() => {
                setIsSuccessState(false);
              }, 5000);
            },
            onError: () => {
              setIsSubmitting(false);
              recaptchaRef.current?.reset();
              setIsCaptchaValidated(false);
            },
          },
        );
      },
      [onSubmit],
    );

    const successArgs = React.useMemo(
      () => ({
        successTitle: successTitle || t('newsletter.formV2.successTitle'),
        showSuccessTitle,
        successText: successText || t('newsletter.formV2.successText'),
        showSuccessText,
      }),
      [successTitle, showSuccessTitle, successText, showSuccessText, t],
    );

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={NewsletterFormSchema}
      >
        {(formik) => {
          const captureSatisfied =
            !requireCaptcha || (requireCaptcha && isCaptchaValidated);
          const canSubmitForm =
            !isSubmitting &&
            !isSuccessState &&
            formik.isValid &&
            captureSatisfied;

          return (
            <div className="bs-newsletter-form__container">
              <div className="bs-newsletter-form__root">
                {isSuccessState ? (
                  <NewsletterFormV2SuccessStateComponent {...successArgs} />
                ) : (
                  <>
                    {(showTitle || showSubtitle) && (
                      <div className="bs-newsletter-form__root__text">
                        {showTitle && (
                          <Typography
                            className="bs-newsletter-form__root__text__title"
                            variant="title-md"
                          >
                            {title || t('newsletter.formV2.title')}
                          </Typography>
                        )}
                        {showSubtitle && (
                          <Typography
                            className="bs-newsletter-form__root__text__subtitle"
                            variant="body-md"
                          >
                            {subtitle || t('newsletter.formV2.subtitle')}
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
                                label:
                                  'bs-newsletter-form__root__form__field-label',
                                input:
                                  'bs-newsletter-form__root__form__field-input',
                              }}
                              id="bs-newsletter-form-field-container-first-name"
                              inputId="bs-newsletter-form-field-first-name"
                              isDisabled={isSuccessState}
                              label={t('newsletter.form.firstName')}
                              name="firstName"
                              onChange={formik.handleChange}
                              placeholder={t('newsletter.form.firstName')}
                              size="sm"
                              value={formik.values.firstName}
                            />
                            {fieldsType !== 'firstNameAndEmail' && (
                              <TextField
                                classes={{
                                  inputContainer:
                                    'bs-newsletter-form__root__form__field-input-container',
                                  label:
                                    'bs-newsletter-form__root__form__field-label',
                                  input:
                                    'bs-newsletter-form__root__form__field-input',
                                }}
                                id="bs-newsletter-form-field-container-last-name"
                                inputId="bs-newsletter-form-field-last-name"
                                isDisabled={isSuccessState}
                                label={t('newsletter.form.lastName')}
                                name="lastName"
                                onChange={formik.handleChange}
                                placeholder={t('newsletter.form.lastName')}
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
                            label:
                              'bs-newsletter-form__root__form__field-label',
                            input:
                              'bs-newsletter-form__root__form__field-input',
                          }}
                          helperText={
                            !formik.isValid
                              ? formik.values.email
                                ? t('newsletter.formV2.error.invalidEmail')
                                : t('newsletter.formV2.error.emailRequired')
                              : undefined
                          }
                          id="bs-newsletter-form-field-container-email"
                          inputId="bs-newsletter-form-field-email"
                          isDisabled={isSuccessState}
                          isError={!!formik.errors.email}
                          label={t('newsletter.formV2.email')}
                          name="email"
                          onChange={formik.handleChange}
                          placeholder={t('newsletter.formV2.email')}
                          size="sm"
                          type="email"
                          value={formik.values.email}
                        />
                      </div>
                      {requireCaptcha && (
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          onChange={(token: string | null) => {
                            setIsCaptchaValidated(!!token);
                          }}
                          onErrored={() => setIsCaptchaValidated(false)}
                          onExpired={() => setIsCaptchaValidated(false)}
                          sitekey={`${Config.REACT_APP_RECAPTCHA_V2}`}
                        />
                      )}

                      <Button
                        isRippleEnabled
                        className="bs-newsletter-form__root__form__submit"
                        color="primary"
                        isDisabled={!canSubmitForm}
                        type="submit"
                        variant="contained"
                      >
                        {isSuccessState ? '' : t('newsletter.formV2.validate')}
                      </Button>
                    </Form>
                  </>
                )}
              </div>
            </div>
          );
        }}
      </Formik>
    );
  },
);

export const NewsletterFormBase: React.ComponentType<Props> =
  marketplaceCssHoc<Props>()(React.memo(NewsletterFormV2));

export default React.memo(NewsletterFormV2);
