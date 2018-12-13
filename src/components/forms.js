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
  row: {
    textAlign: 'right',
  },
  root: {
    margin: theme.spacing.unit,
  },
});
export const Submit = withStyles(buttonStyles)((props: SubmitProps) => {
  const { classes } = props;
  return (
    <div className={classes.row}>
      <MuiButton
        variant="contained"
        type="submit"
        color="primary"
        {...props}
        classes={props.classes}
      />
    </div>
  );
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
