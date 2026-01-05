import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { withFormik, FieldArray, FastField } from 'formik';
import {
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
  CUSTOM_FORM_FIELD_SIGN_UP_PHOTO,
  CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS,
  CUSTOM_FORM_FIELD_SIGN_UP_WAIVER,
  CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS,
  CUSTOM_FORM_FIELD_LOCATION_OPTION,
  CUSTOM_FORM_FIELD_SIGN_UP_OFFICIAL_DOCUMENT_ID,
} from '@bsport/common/lib/master-data/custom-form.js';
import {
  CUSTOM_FORM_FIELDS_WITH_CHOICES,
  parseCustomFormAnswersToFormData,
  SIGNUP_CHECKBOX_FIELDS,
} from '#src/libs/custom-form/utils';
import { emailValidationRegExp } from '#src/libs/custom-form/constants';
import CustomFormConsumerInput from './CustomFormField.input';
import type {
  CustomFormField,
  CustomFormFieldAnswer,
  Layout,
  ResponsiveLayouts,
} from '../../types';
import GridLayoutWrapper from '../consumer-form-layout/GridLayoutWrapper.component';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { convertBlobToBase64 } from '#src/libs/utils';

type OwnProps = {
  layouts?: ResponsiveLayouts;
  isEditing?: boolean;
  onLayoutChange?: (l: Array<Layout>, allLayouts: ResponsiveLayouts) => void;
  customProviderWidth?: number;
  measureBeforeMount?: boolean;
  fieldsAreIndependent?: boolean; // if they are, FastField is used to avoid useless re-rendering
  isCssVariantActivated?: boolean;
  shouldWrapLayerInCssHoc?: boolean;
  rowHeight?: number;
};
type Props = OwnProps & WithTranslation;

export const CustomFormFilledMap = {
  custom_form_id: 'custom_form_id',
  custom_form_field_filled: 'custom_form_field_filled',
};

const isWidget = WidgetUtils.isWidget();

export const ConsumerFormFields = (props: Props) => {
  // Need to not pass classes in props otherwise
  // thousands of errors are raised by MUI

  const {
    // @ts-expect-error
    classes,
    fieldsAreIndependent,
    isCssVariantActivated,
    shouldWrapLayerInCssHoc,
    measureBeforeMount,
    ...restProps
  } = props;
  /* eslint-disable */
  return (
    <FieldArray name="custom_form_field">
      {({
        form: {
          values: { custom_form_field },
        },
      }) => (
        <>
          <GridLayoutWrapper
            customProviderWidth={props.customProviderWidth}
            isCssVariantActivated={isCssVariantActivated}
            isEditing={props.isEditing}
            layouts={props.layouts}
            measureBeforeMount={measureBeforeMount}
            onLayoutChange={props.onLayoutChange}
            shouldWrapLayerInCssHoc={shouldWrapLayerInCssHoc}
            rowHeight={props.rowHeight}
          >
            {fieldsAreIndependent
              ? custom_form_field?.map((field: CustomFormField, i: number) => (
                  <div key={field?.id?.toString()}>
                    <FastField
                      key={i.toString()}
                      name={`custom_form_field.${i}.answer`}
                    >
                      {() => (
                        // @ts-expect-error
                        <CustomFormConsumerInput
                          {...restProps}
                          field={field}
                          index={i}
                          isCssVariantActivated={isCssVariantActivated}
                        />
                      )}
                    </FastField>
                  </div>
                ))
              : custom_form_field?.map((field: CustomFormField, i: number) => {
                  return (
                    <div
                      className="bs-fabrique-checkbox__wrapper"
                      key={field?.id?.toString()}
                    >
                      {/* @ts-expect-error */}
                      <CustomFormConsumerInput
                        {...restProps}
                        field={field}
                        index={i}
                        isCssVariantActivated={isCssVariantActivated}
                      />
                    </div>
                  );
                })}
          </GridLayoutWrapper>
        </>
      )}
    </FieldArray>
  );
};

const ValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(false),
  date_created: Yup.string().nullable(false),
  disabled: Yup.boolean(),
  name: Yup.string().nullable(false),
  custom_form_field: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().nullable(false),
      custom_form_id: Yup.number().nullable(false),
      field_index: Yup.number().nullable(false),
      kind: Yup.number().nullable(false),
      signup_question_kind: Yup.number().nullable(true),
      label: Yup.string().nullable(false),
      mandatory: Yup.boolean(),
      editable: Yup.boolean(),
      choices: Yup.array().of(Yup.string()),
      answer: Yup.string()
        .nullable(true)
        .test(
          'test_mandatory_field',
          'marketing:customForm.submit.errors.requiredField',
          function checkMandatoryFields(item) {
            if (
              this.parent.signup_question_kind ===
              CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS
            ) {
              return item === 'true';
            }
            if (
              this.parent.signup_question_kind ===
              CUSTOM_FORM_FIELD_SIGN_UP_WAIVER
            ) {
              return !this.parent.mandatory || item === 'true';
            }
            return (
              this.parent.signup_question_kind ===
                CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS ||
              !this.parent.mandatory ||
              !!item
            );
          },
        )
        .when('signup_question_kind', {
          is: CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
          then: Yup.string().matches(
            /^[^\s]{6,}$/,
            'marketing:customForm.submit.errors.passwordMinimumRequirementsError',
          ),
        })
        .when('signup_question_kind', {
          is: CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
          then: Yup.string().matches(
            emailValidationRegExp,
            'marketing:customForm.submit.errors.invalidEmail',
          ),
        })
        .when('signup_question_kind', {
          is: CUSTOM_FORM_FIELD_SIGN_UP_OFFICIAL_DOCUMENT_ID,
          then: Yup.string().matches(
            /^[A-Za-z0-9]+$/,
            'marketing:customForm.submit.errors.invalidOfficialDocumentId',
          ),
        }),
      custom_form_field_tag_rule: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().nullable(false),
          custom_form_field_id: Yup.number().nullable(false),
          tag_id: Yup.number().nullable(false),
          answer_for_tag: Yup.string().nullable(false),
        }),
      ),
    }),
  ),
  passwordConfirm: Yup.string()
    .nullable(true)
    .test(
      'password_confimration',
      'marketing:customForm.submit.errors.passwordConfirmationError',
      function checkPasswordConfirm(item) {
        const password_field = this.parent.custom_form_field.find(
          (field: CustomFormField) =>
            field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
        );
        if (password_field) {
          return item === password_field.answer;
        }
        return true;
      },
    ),
});
export const ConsumerFormFieldsHOC = withFormik({
  // @ts-expect-error
  mapPropsToValues: ({ initial, initialWithAnswer }) => {
    if (initialWithAnswer) {
      return {
        ...initialWithAnswer,
        custom_form_field: (initialWithAnswer.custom_form_field ?? [])
          .filter((field?: CustomFormFieldAnswer) => !!field)
          .map((field: CustomFormFieldAnswer) => {
            let answer: string | boolean | any[] | null = field.answer;

            if (answer) {
              const questionKind = field.signup_question_kind;
              const isSignupCheckboxField =
                questionKind && SIGNUP_CHECKBOX_FIELDS.includes(questionKind);
              return {
                ...field,
                answer: isSignupCheckboxField
                  ? answer === 'True' // Backend returns "True", FE handles "true"/true
                  : answer,
              };
            }

            const isCustomInputField =
              CUSTOM_FORM_FIELDS_WITH_CHOICES.includes(field.kind) ||
              field.kind === CUSTOM_FORM_FIELD_LOCATION_OPTION;
            return {
              ...field,
              answer: isCustomInputField ? [] : null,
            };
          }),
      };
    }
    if (initial) {
      return {
        ...initial,
        custom_form_field: (initial.custom_form_field ?? [])
          .filter((field?: CustomFormFieldAnswer) => !!field)
          .map((field: CustomFormFieldAnswer) => {
            let answer: boolean | any[] | null;
            const questionKind = field.signup_question_kind;
            if (field.answer) {
              answer = field.answer;
            } else if (
              questionKind &&
              SIGNUP_CHECKBOX_FIELDS.includes(questionKind)
            ) {
              answer = false;
            } else if (
              CUSTOM_FORM_FIELDS_WITH_CHOICES.includes(field.kind) ||
              field.kind === CUSTOM_FORM_FIELD_LOCATION_OPTION
            ) {
              answer = [];
            } else {
              answer = null;
            }

            return {
              ...field,
              answer: answer,
            };
          }),
      };
    }
    return {};
  },
  enableReinitialize: true,
  validationSchema: ValidationSchema,
  handleSubmit: async (
    values,
    // @ts-expect-error
    { props: { onSubmit, initial }, setSubmitting },
  ) => {
    const {
      date_created,
      name,
      disabled,
      id,
      custom_form_field,
      layout,
      is_member_form,
      is_signup,
      passwordConfirm,
      layout_configuration,
      ...cleaned_values
    } = {
      ...values,
      custom_form_id: values.id,
      custom_form_field_filled: values.custom_form_field.map(
        (field: CustomFormFieldAnswer) => {
          return { custom_form_field_id: field.id, answer: field.answer };
        },
      ),
    };

    /**
     * The final object that will be converted into a FormData instance for API
     * In the widget case, we want to prevent the conversion since not possible
     * to clone through a postMessage() API
     */
    let customFormCleanedValues;

    /**
     * The widget case
     * Convert any image into a base64 string to re-encode the image
     * right before sending it to the API
     */
    if (isWidget) {
      customFormCleanedValues = {
        ...values,
        initialPhotos: initial.custom_form_field
          .filter(
            (_field: CustomFormFieldAnswer) =>
              _field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_PHOTO,
          )
          .map((field: CustomFormFieldAnswer) => field.answer),
        custom_form_id: values.id,
        custom_form_field: await Promise.all(
          values.custom_form_field.map(async (field: CustomFormFieldAnswer) => {
            if (field.answer instanceof File) {
              return {
                ...field,
                answer: {},
                metaData: {
                  name: field.answer.name,
                  type: field.answer.type,
                  base64: await convertBlobToBase64(field.answer),
                },
              };
            }
            return field;
          }),
        ),
        custom_form_field_filled: await Promise.all(
          values.custom_form_field.map(async (field: CustomFormFieldAnswer) => {
            if (field.answer instanceof File) {
              return {
                custom_form_field_id: field.id,
                answer: {},
                metaData: {
                  name: field.answer.name,
                  type: field.answer.type,
                  base64: await convertBlobToBase64(field.answer),
                },
              };
            }
            return {
              custom_form_field_id: field.id,
              answer: field.answer,
            };
          }),
        ),
      };

      return onSubmit(customFormCleanedValues, {
        onSuccess: () => {
          setSubmitting(false);
        },
        onError: () => setSubmitting(false),
      });
    }

    /**
     * The web case
     * Convert formik values into FormData instance with files included
     */
    customFormCleanedValues = {
      ...values,
      initialPhotos: initial.custom_form_field
        .filter(
          (_field: CustomFormFieldAnswer) =>
            _field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_PHOTO,
        )
        .map((field: CustomFormFieldAnswer) => field.answer),
      custom_form_id: values.id,
      custom_form_field_filled: values.custom_form_field.map(
        (field: CustomFormFieldAnswer) => ({
          custom_form_field_id: field.id,
          answer: field.answer,
        }),
      ),
    };

    /**
     * The sign up form must send a JSON payload to the API
     * @see {@link submitSignUpCustomForm}
     */
    if (is_signup) {
      return onSubmit(customFormCleanedValues, {
        onSuccess: () => {
          setSubmitting(false);
        },
        onError: () => setSubmitting(false),
      });
    }

    const formData = parseCustomFormAnswersToFormData(customFormCleanedValues);

    onSubmit(formData, {
      onSuccess: () => {
        setSubmitting(false);
      },
      onError: () => setSubmitting(false),
    });
  },
});
export default compose<any, OwnProps>(withTranslation())(ConsumerFormFields);
