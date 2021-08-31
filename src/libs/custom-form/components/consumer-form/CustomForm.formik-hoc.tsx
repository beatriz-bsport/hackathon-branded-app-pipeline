import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { withFormik, FieldArray } from 'formik';
import withStyles from '@material-ui/core/styles/withStyles';
import { MaterialStyleType } from '../../../../utils/types';
import CustomFormConsumerInput from './CustomFormField.input';
import {
  CUSTOM_FORM_FIELDS_WITH_CHOICES,
  CUSTOM_FORM_FIELD_FILE_OPTION,
  CUSTOM_FORM_FIELD_SIGNATURE_OPTION,
} from '../../utils';
import type { CustomFormField, CustomFormFieldAnswer } from '../../types';
import { mapFormDataWithObject } from '../../../../pages/form.utils';

type OwnProps = {};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const CustomFormFilledMap = {
  custom_form_id: 'custom_form_id',
  custom_form_field_filled: 'custom_form_field_filled',
};
export const ConsumerFormFields = (props: Props) => {
  return (
    <FieldArray name="custom_form_field">
      {({
        form: {
          values: { custom_form_field },
        },
      }) => (
        <>
          {custom_form_field.map((field: CustomFormField, i: number) => (
            <CustomFormConsumerInput {...props} field={field} index={i} />
          ))}
        </>
      )}
    </FieldArray>
  );
};
const styles = () => ({});
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
      label: Yup.string().nullable(false),
      mandatory: Yup.boolean(),
      choices: Yup.array().of(Yup.string()),
      answer: Yup.string()
        .nullable(true)
        .test(
          'test_mandatory_field',
          'marketing:customForm.submit.errors.requiredField',
          function (item) {
            return !this.parent.mandatory || !!item;
          },
        ),
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
});
export const ConsumerFormFieldsHOC = withFormik({
  mapPropsToValues: ({ initial, initialWithAnswer }) => {
    if (initialWithAnswer) {
      return {
        ...initialWithAnswer,
        custom_form_field: initialWithAnswer.custom_form_field?.map(
          (field: CustomFormField) => ({
            ...field,
            answer: CUSTOM_FORM_FIELDS_WITH_CHOICES.includes(field.kind)
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
          (field: CustomFormField) => ({
            ...field,
            answer: CUSTOM_FORM_FIELDS_WITH_CHOICES.includes(field.kind)
              ? []
              : null,
          }),
        ),
      };
    }
    return {};
  },
  validationSchema: ValidationSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const {
      /* eslint-disable */
      date_created,
      name,
      disabled,
      id,
      custom_form_field,
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

    onSubmit(formData, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});
export default compose<any, OwnProps>(
  withTranslation(),
  withStyles(styles),
)(ConsumerFormFields);
