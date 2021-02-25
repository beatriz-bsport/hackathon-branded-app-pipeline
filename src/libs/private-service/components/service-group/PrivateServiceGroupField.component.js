// @flow
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { omit } from 'lodash';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import PrivateServiceGroupSelector from './PrivateServiceGroupSelector.component';

export default (props: SelectFieldProps) => {
  const { label, fullWidth, required } = props;
  const classes = useStyles();
  const { t } = useTranslation()
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
              <Typography variant="body1" className={classes.alertError}>
                {t(message)}
              </Typography>
            )}
          </ErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const useStyles = makeStyles((theme) => ({
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
}));
