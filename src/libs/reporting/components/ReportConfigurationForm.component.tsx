import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose, withProps } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form, Field, FieldArray } from 'formik';

import Button from '@material-ui/core/Button';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import {
  AlertError,
  TextField,
  Submit,
  FormControl,
  Actions,
  defaultHandleSubmit,
  // @ts-expect-error
} from '#src/components/forms';
import { ReportMetadataValue } from '#src/libs/reporting/types';
import ReportCategoriesSelector from './ReportCategoriesSelector.component';
import ReportColumnSelector from './ReportColumnSelector.component';

type Props = {
  isSubmitting: boolean;
  categoryMetadata: ReportMetadataValue;
  onClose: () => void;
  trackintent: () => void;
  categories: ReportCategoryEnum[];
  globalCategories: ReportCategoryEnum[];
};

const ReportConfigurationSchema = Yup.object().shape({
  name: Yup.string().required('required'),
  description: Yup.string().required('required'),
  category: Yup.string().required('required'),
  columns: Yup.array().of(Yup.string().required()).min(1),
});

const ReportConfigurationForm: React.FC<Props> = ({
  isSubmitting,
  onClose,
  trackintent,
  categoryMetadata,
  categories,
  globalCategories,
}) => {
  const { t } = useTranslation('reporting');

  return (
    <Form>
      <TextField fullWidth required label={t('form.name')} name="name" />
      <AlertError name="name" />
      <TextField
        fullWidth
        required
        label={t('form.description')}
        name="description"
      />
      <AlertError name="description" />
      <FormControl label={t('form.category')}>
        <Field name="category">
          {/* @ts-expect-error */}
          {({ field: { value, onChange } }) => (
            <ReportCategoriesSelector
              categories={categories}
              globalCategories={globalCategories}
              onSelect={onChange('category')}
              selected={value}
            />
          )}
        </Field>
        <AlertError name="category" />
      </FormControl>
      {categoryMetadata ? (
        <FormControl>
          <FieldArray name="columns">
            {({ name, form: { values, setFieldValue } }) => (
              <ReportColumnSelector
                columns={categoryMetadata.columns}
                onChange={(value) => {
                  setFieldValue('columns', value, true);
                }}
                value={values[name]}
              />
            )}
          </FieldArray>
          <AlertError name="columns" />
        </FormControl>
      ) : null}
      <Actions>
        <Button onClick={onClose}>{t('form.cancel')}</Button>
        <Submit disabled={isSubmitting} onClick={trackintent}>
          {t('form.save')}
        </Submit>
      </Actions>
    </Form>
  );
};

export default compose(
  withFormik({
    // @ts-expect-error
    mapPropsToValues: ({ initial }) => {
      return {
        name: initial.name || '',
        description: initial.description || '',
        category: initial.category || '',
        columns: initial.columns || [],
      };
    },
    validationSchema: ReportConfigurationSchema,
    handleSubmit: defaultHandleSubmit,
  }),
  withProps(({ metadata, values: { category } }) => ({
    // @ts-expect-error
    categoryMetadata: metadata.find((m) => m.category === category),
    // @ts-expect-error
    categories: metadata.map((c) => c.category),
    // @ts-expect-error
    globalCategories: metadata.map((c) => c.global_category),
  })),
)(ReportConfigurationForm);
