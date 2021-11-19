// @flow
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import omit from 'lodash/omit';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import LevelSelector from './LevelSelector.component';

export default (props: SelectFieldProps) => {
  const { t, label, fullWidth, classes, required } = props;
  return (
    <Field {...props}>
      {({ field, form: { touched, setFieldValue, errors } }) => {
        return (
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
            <LevelSelector
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
              closeMenuOnSelect={!!props.closeMenuOnSelect}
              isNotMulti={!!props.isNotMulti}
              selectedLevels={field.value ? [field.value] : []}
              selectOption={(option) => {
                setFieldValue(field.name, option.value);
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
                <Typography variant="body1" className={classes.alertError}>
                  {t(message)}
                </Typography>
              )}
            </ErrorMessage>
          </FormControl>
        );
      }}
    </Field>
  );
};
