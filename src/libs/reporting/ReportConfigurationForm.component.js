// @flow

import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';

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

import type { ReportCategoryMetadata } from './types';

import ReportCategoriesSelector from './ReportCategoriesSelector.component';
import ReportColumnSelector from './ReportColumnSelector.component';

type Props = {
  isSubmitting: boolean,
  categoryMetadata: ReportCategoryMetadata,
  onClose: () => void,
  t: TFunction,
  classes: { [string]: string },
  categories: *[],
  globalCategories: *[],
};

const ReportConfigurationSchema = Yup.object().shape({
  name: Yup.string().required('required'),
  description: Yup.string().required('required'),
  category: Yup.string().required('required'),
  columns: Yup.array().of(Yup.string().required()).min(1),
});

export function ReportConfigurationForm(props: Props) {
  const {
    isSubmitting,
    onClose,
    categoryMetadata,
    categories,
    globalCategories,
    t,
  } = props;
  return (
    <Form>
      <TextField required name="name" fullWidth label={t('form.name')} />
      <AlertError name="name" />
      <TextField
        required
        name="description"
        fullWidth
        label={t('form.description')}
      />
      <AlertError name="description" />
      <FormControl label={t('form.category')}>
        <Field name="category">
          {({ field: { value, onChange } }) => (
            <ReportCategoriesSelector
              selected={value}
              categories={categories}
              globalCategories={globalCategories}
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
        <Button onClick={onClose}>{t('form.cancel')}</Button>
        <Submit disabled={isSubmitting}>{t('form.save')}</Submit>
      </Actions>
    </Form>
  );
}

export default compose(
  withTranslation(['reporting']),
  withFormik({
    mapPropsToValues: ({ initial }) =>
      initial || {
        name: '',
        description: '',
        category: '',
        columns: [],
      },
    validationSchema: ReportConfigurationSchema,
    handleSubmit: defaultHandleSubmit,
  }),
  withProps(({ metadata, values: { category } }) => ({
    categoryMetadata: metadata.find((m) => m.category === category),
    categories: metadata.map((c) => c.category),
    globalCategories: metadata.map((c) => c.global_category),
  })),
)(ReportConfigurationForm);
