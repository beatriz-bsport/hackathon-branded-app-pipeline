import React, { ReactNode } from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Field, useField } from 'formik';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export type BaseFieldProps = {
  name: string;
};
const useTextFieldStyles = makeStyles(() => ({
  field: {
    width: '100%',
  },
}));

type TextFieldProps = {
  variant: 'filled' | 'standard' | 'outlined';
  label: string;
  required: boolean;
  disabled: boolean;
} & BaseFieldProps;
export const TextField = (props: TextFieldProps) => {
  const { variant, label, required, disabled } = props;
  const [field, meta] = useField(props);
  const classes = useTextFieldStyles();

  return (
    <Field>
      {() => (
        <MuiTextField
          className={classes.field}
          error={!!meta.error}
          variant={variant}
          label={label}
          required={required}
          disabled={disabled}
          onBlur={field.onBlur}
          onChange={field.onChange}
          value={field.value}
          name={field.name}
          inputProps={{
            'data-testid': 'input-test',
          }}
        />
      )}
    </Field>
  );
};

type CheckboxFieldProps = BaseFieldProps & {
  disabled?: boolean;
  label?: string | ReactNode;
  reverted?: boolean;
  classes?: { [key: string]: any };
};
export const CheckboxField = (props: CheckboxFieldProps) => {
  const { reverted, disabled, label, classes } = props;
  const [field, meta, helpers] = useField(props);
  return (
    <Field
      {...props}
      render={() => (
        <FormControlLabel
          label={label}
          id="checkbox"
          classes={classes}
          control={
            <Checkbox
              disabled={!!disabled}
              checked={reverted ? !field.value : field.value}
              {...props}
              {...field}
              onChange={() => {
                helpers.setValue(!field.value);
              }}
              error={!!(meta.touched && meta.error)}
            />
          }
        />
      )}
    />
  );
};
