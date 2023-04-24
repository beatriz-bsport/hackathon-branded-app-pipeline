// @ts-nocheck
import { Typography } from '@material-ui/core';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NestedAlertError: React.FC<{
  name: string;
}> = ({ name }) => {
  const { t } = useTranslation('reporting');
  return (
    <Field name={name}>
      {(field: any) => {
        if (typeof field.meta.error !== 'string') return null;
        if (typeof field.meta.error === 'string') {
          return (
            <Typography variant="caption" color="error">
              {t(field.meta.error)}
            </Typography>
          );
        }
        return null;
      }}
    </Field>
  );
};

export default NestedAlertError;
