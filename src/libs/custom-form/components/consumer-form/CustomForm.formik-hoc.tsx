import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { withFormik, FieldArray } from 'formik';
import {
  CUSTOM_FORM_FIELD_FILE_OPTION,
  CUSTOM_FORM_FIELD_SIGNATURE_OPTION,
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
  CUSTOM_FORM_FIELD_SIGN_UP_PHOTO,
  CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS,
  CUSTOM_FORM_FIELD_SIGN_UP_WAIVER,
  CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS,
} from '@bsport/common/lib/master-data/custom-form';
import CustomFormConsumerInput from './CustomFormField.input';
import { CUSTOM_FORM_FIELDS_WITH_CHOICES } from '../../utils';
import type {
  CustomFormField,
  CustomFormFieldAnswer,
  Layout,
  ResponsiveLayouts,
} from '../../types';
import { mapFormDataWithObject } from '../../../../pages/form.utils';
import GridLayoutWrapper from '../consumer-form-layout/GridLayoutWrapper.component';

type OwnProps = {
  layouts?: ResponsiveLayouts;
  isEditing: boolean;
  onLayoutChange?: (l: Array<Layout>, allLayouts: ResponsiveLayouts) => void;
  customProviderWidth?: number;
};
type Props = OwnProps & WithTranslation;

const CustomFormFilledMap = {
  custom_form_id: 'custom_form_id',
  custom_form_field_filled: 'custom_form_field_filled',
};
export const ConsumerFormFields = (props: Props) => {
  // Need to not pass classes in props otherwise
  // thousands of errors are raised by MUI
  /* eslint-disable */
  const { classes, ...restProps } = props;
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
            onLayoutChange={props.onLayoutChange}
            layouts={props.layouts}
            isEditing={props.isEditing}
            customProviderWidth={props.customProviderWidth}
          >
            {custom_form_field?.map((field: CustomFormField, i: number) => (
              <div key={field?.id?.toString()}>
                <CustomFormConsumerInput
                  {...restProps}
                  field={field}
                  index={i}
                />
              </div>
            ))}
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
          function (item) {
            if (
              this.parent.signup_question_kind ===
                CUSTOM_FORM_FIELD_SIGN_UP_WAIVER ||
              this.parent.signup_question_kind ===
                CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS
            ) {
              return item === 'true';
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
            /^(?=.*[a-z])(?=.{6,})/,
            'marketing:customForm.submit.errors.passwordMinimumRequirementsError',
          ),
        })
        .when('signup_question_kind', {
          is: CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
          then: Yup.string().matches(
            /[A-z0-9-_]+@[A-z0-9-_]+.[A-z]+$/,
            'marketing:customForm.submit.errors.invalidEmail',
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
      function (item) {
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
  mapPropsToValues: ({ initial, initialWithAnswer }) => {
    if (initialWithAnswer) {
      return {
        ...initialWithAnswer,
        custom_form_field: initialWithAnswer.custom_form_field?.map(
          (field: CustomFormFieldAnswer) => ({
            ...field,
            // eslint-disable-next-line
            answer: field.answer
              ? field.answer
              : CUSTOM_FORM_FIELDS_WITH_CHOICES.includes(field.kind)
              ? []
              : null,
          }),
        ),
      };
    }
    if (initial) {
      return {
        ...initial,
        custom_form_field: initial.custom_form_field?.map(
          (field: CustomFormFieldAnswer) => ({
            ...field,
            // eslint-disable-next-line
            answer: field.answer
              ? field.answer
              : CUSTOM_FORM_FIELDS_WITH_CHOICES.includes(field.kind)
              ? []
              : null,
          }),
        ),
      };
    }
    return {};
  },
  enableReinitialize: true,
  validationSchema: ValidationSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const {
      /* eslint-disable */
      date_created,
      name,
      disabled,
      id,
      custom_form_field,
      layout,
      is_member_form,
      is_signup,
      passwordConfirm,
      /* eslint-disable */
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
    const formData = mapFormDataWithObject(
      cleaned_values,
      CustomFormFilledMap,
      [],
    );
    
    values.custom_form_field
      .filter((_field: CustomFormFieldAnswer) =>
        [
          CUSTOM_FORM_FIELD_FILE_OPTION,
          CUSTOM_FORM_FIELD_SIGNATURE_OPTION,
        ].includes(_field.kind),
      )
      .map((field: CustomFormFieldAnswer) =>
        field.answer && formData.append(`file:${field.id}`, field.answer),
    );
    values.custom_form_field
      .filter((_field: CustomFormFieldAnswer) =>
        [
          CUSTOM_FORM_FIELD_SIGN_UP_PHOTO,
        ].includes(_field.signup_question_kind),
      )
      .map((field: CustomFormFieldAnswer) =>
        field.answer && formData.append(`file:${field.id}`, field.answer),
      );
    onSubmit(formData, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});
export default compose<any, OwnProps>(
  withTranslation(),
)(ConsumerFormFields);
