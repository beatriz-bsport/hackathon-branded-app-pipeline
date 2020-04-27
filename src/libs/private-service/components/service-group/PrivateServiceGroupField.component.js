// @flow
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { omit } from 'lodash';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import PrivateServiceGroupSelector from './PrivateServiceGroupSelector.component';

export default (props: SelectFieldProps) => {
  const { t, label, fullWidth, classes, required } = props;
  return (
    <Field {...props}>
      {({ field, form: { touched, setFieldValue, errors } }) => (
        <FormControl
          fullWidth={fullWidth}
          required={required}
          error={!!(touched[field.name] && errors[field.name])}
        >
          {label ? (
            <div style={{ marginBottom: 16 }}>
              <InputLabel shrink htmlFor="select-helper">
                {label}
              </InputLabel>
            </div>
          ) : null}
          <PrivateServiceGroupSelector
            nameCypress={`select-${props.name}`}
            {...field}
            {...omit(props, [
              't',
              'tReady',
              'defaultNS',
              'i18n',
              'i18nOptions',
              'reportNS',
            ])}
            selectOption={(option) => {
              if (!option) {
                setFieldValue(field.name, null);
              } else {
                setFieldValue(field.name, option.value);
              }
            }}
          />
          {!props.disabled && (
            <input
              tabIndex={-1}
              autoComplete="off"
              style={{ opacity: 0, height: 0 }}
              value={field.value}
              required={required}
            />
          )}
          <ErrorMessage {...props}>
            {(message) => (
              <Typography variant="body2" className={classes.alertError}>
                {t(message)}
              </Typography>
            )}
          </ErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
