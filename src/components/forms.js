// @flow

import React from 'react';

import { Field, ErrorMessage } from 'formik';

import DatePicker from 'material-ui-pickers/DatePicker';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  TextField as MuiTextField,
  Button as MuiButton,
} from '@material-ui/core';

type AlertErrorProps = {};

const styles = (theme) => ({
  alertError: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    color: theme.palette.error.dark,
  },
});

export const AlertError = withStyles(styles)((props: AlertErrorProps) => {
  const { classes } = props;
  return (
    <ErrorMessage
      {...props}
      render={(message) => (
        <Typography variant="body2" className={classes.alertError}>
          {message}
        </Typography>
      )}
    />
  );
});

export function TextField(props: props) {
  return (
    <Field
      {...props}
      render={({ field, form: { touched, errors } }) => (
        <MuiTextField
          {...field}
          {...props}
          error={!!(touched[field.name] && errors[field.name])}
        />
      )}
    />
  );
}

const buttonStyles = (theme) => ({
  button: {
    marginLeft: theme.spacing.unit * 2,
  },
});
export const Submit = withStyles(buttonStyles)((props: SubmitProps) => {
  const { classes } = props;
  return (
    <MuiButton
      variant="contained"
      type="submit"
      color="primary"
      {...props}
      className={classes.button}
      classes={props.classes}
    />
  );
});

const actionsStyles = (theme) => ({
  row: {
    textAlign: 'right',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});
export const Actions = withStyles(actionsStyles)((props: ActionsProps) => {
  const { classes } = props;
  return <div className={classes.row}>{props.children}</div>;
});

export const DateField = (props: DateFieldProps) => {
  return (
    <Field
      {...props}
      render={({ field, form: { touched, errors } }) => (
        <DatePicker
          {...field}
          {...props}
          format="DD/MM/YYYY"
          error={!!(touched[field.name] && errors[field.name])}
        />
      )}
    />
  );
};

type FormControlProps = {};

const formControlStyles = (theme) => ({
  control: {
    marginTop: theme.spacing.unit,
  },
  label: {
    marginBottom: theme.spacing.unit,
  },
});

export const FormControl = withStyles(formControlStyles)(
  (props: FormControlProps) => {
    const { classes, label, children } = props;
    return (
      <div className={classes.control}>
        <Typography variant="body2" className={classes.label}>
          {label}
        </Typography>
        {children}
      </div>
    );
  },
);

export function addFieldsErrors(errors, setFieldError) {
  Object.keys(errors).forEach((key) => {
    const messages = errors[key];
    if (messages.length) {
      messages.forEach((error) => setFieldError(key, error.message));
    }
  });
}

export function bindFormHandlers({ setSubmitting, setFieldError }) {
  return {
    onSuccess: () => setSubmitting(false),
    onError: (errors) => {
      setSubmitting(false);
      addFieldsErrors(errors, setFieldError);
    },
  };
}

export function bindSubmitHandlers(handler, { onSuccess, onError } = {}) {
  return (data, baseOptions) => {
    const composedOptions = {
      onSuccess(...args) {
        if (onSuccess) onSuccess(...args);
        if (baseOptions.onSuccess) baseOptions.onSuccess(...args);
      },
      onError(...args) {
        if (onError) onError(...args);
        if (baseOptions.onError) baseOptions.onError(...args);
      },
    };
    handler(data, composedOptions);
  };
}

export function defaultHandleSubmit<T>(
  values: T,
  { props: { onSubmit }, setSubmitting, setFieldError },
) {
  onSubmit(values, bindFormHandlers({ setSubmitting, setFieldError }));
}
