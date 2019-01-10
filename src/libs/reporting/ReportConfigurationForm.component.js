// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { compose, withProps } from 'recompose';

import * as Yup from 'yup';
import { withFormik, Form, Field, FieldArray } from 'formik';

import {
  AlertError,
  TextField,
  Submit,
  FormControl,
  Actions,
  defaultHandleSubmit,
} from '../../components/forms';

import type { ReportConfiguration, ReportCategoryMetadata } from './types';

import ReportCategorySelector from './ReportCategorySelector.component';
import ReportColumnSelector from './ReportColumnSelector.component';

import { CATEGORIES } from './utils';

type Props = {
  isSubmitting: boolean,
  categoryMetadata: ReportCategoryMetadata,
  t: TFunction,
  classes: { [string]: string },
  categories: *[],
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
  const { isSubmitting, categoryMetadata, categories, t } = props;
  return (
    <Form>
      <TextField name="name" fullWidth label={t('form.name')} />
      <AlertError name="name" />
      <TextField name="description" fullWidth label={t('form.description')} />
      <AlertError name="description" />
      <FormControl label={t('form.category')}>
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
        <FormControl label={t('form.columns')}>
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
  withNamespaces(['reporting']),
  withFormik({
    mapPropsToValues: ({ initial }) =>
      initial || {
        name: '',
        description: '',
        category: 'members',
        columns: [],
      },
    validationSchema: ReportConfigurationSchema,
    handleSubmit: defaultHandleSubmit,
  }),
  withProps(({ metadata, values: { category } }) => ({
    categoryMetadata: metadata.find((m) => m.category === category),
    categories: metadata.map((c) => c.category),
  })),
)(ReportConfigurationForm);
