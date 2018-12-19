// @flow

import React from 'react';

import { compose, withProps } from 'recompose';

import * as Yup from 'yup';
import { withFormik, Form, Field, FieldArray } from 'formik';

import {
  AlertError,
  TextField,
  Submit,
  FormControl,
  Actions,
} from '../../components/forms';

import type { ReportConfiguration, ReportCategoryMetadata } from './types';

import ReportCategorySelector from './ReportCategorySelector.component';
import ReportColumnSelector from './ReportColumnSelector.component';

import { CATEGORIES } from './utils';

type Props = {
  isSubmitting: boolean,
  categoryMetadata: ReportCategoryMetadata,
};

const ReportConfigurationSchema = Yup.object().shape({
  name: Yup.string().required('required'),
  description: Yup.string().required('required'),
  category: Yup.string().required('required'),
  columns: Yup.array()
    .of(Yup.string().required())
    .min(1),
});

export function ReportConfigurationForm(props: Props) {
  const { isSubmitting, categoryMetadata, categories } = props;
  return (
    <Form>
      <TextField name="name" fullWidth label="Name" />
      <AlertError name="name" />
      <TextField name="description" fullWidth label="Description" />
      <AlertError name="description" />
      <FormControl label="Category">
        <Field name="category">
          {({ field: { value, onChange } }) => (
            <ReportCategorySelector
              selected={value}
              categories={categories}
              onSelect={onChange('category')}
            />
          )}
        </Field>
        <AlertError name="category" />
      </FormControl>

      {categoryMetadata ? (
        <FormControl label="Columns">
          <FieldArray name="columns">
            {({ name, form: { values, setFieldValue } }) => (
              <ReportColumnSelector
                columns={categoryMetadata.columns}
                value={values[name]}
                onChange={(value) => {
                  setFieldValue('columns', value, true);
                }}
              />
            )}
          </FieldArray>
          <AlertError name="columns" />
        </FormControl>
      ) : null}
      <Actions>
        <Submit disabled={isSubmitting}>Save</Submit>
      </Actions>
    </Form>
  );
}

export default compose(
  withFormik({
    mapPropsToValues: ({ initial }) =>
      initial || {
        name: '',
        description: '',
        category: 'members',
        columns: [],
      },
    validationSchema: ReportConfigurationSchema,
    handleSubmit: (
      values: ReportConfiguration,
      { props: { onSubmit }, setSubmitting },
    ) => {
      onSubmit(values);
      setSubmitting(false);
    },
  }),
  withProps(({ metadata, values: { category } }) => ({
    categoryMetadata: metadata.find((m) => m.category === category),
    categories: metadata.map((c) => c.category),
  })),
)(ReportConfigurationForm);
