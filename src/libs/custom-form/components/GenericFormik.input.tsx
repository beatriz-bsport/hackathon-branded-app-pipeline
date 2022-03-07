import React, { ReactNode } from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Field, useField } from 'formik';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Switch } from '@material-ui/core';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';

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
  onChange?: (newValue: boolean) => void;
};
export const CheckboxField = (props: CheckboxFieldProps) => {
  const { reverted, disabled, label, classes, onChange } = props;
  const [field, meta, helpers] = useField(props.name);
  return (
    <Field {...props}>
      {() => (
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
                onChange && onChange(!field.value);
                helpers.setValue(!field.value);
              }}
              error={!!(meta.touched && meta.error)}
            />
          }
        />
      )}
    </Field>
  );
};

type SwitchFieldProps = { name: string; disabled?: boolean; label: string };
export const SwitchField = (props: SwitchFieldProps) => {
  const { name, disabled, label } = props;
  return (
    <Field name={name}>
      {({ field }) => (
        <FormControlLabel
          {...field}
          value=""
          checked={field.value}
          label={label}
          disabled={disabled}
          control={<Switch />}
        />
      )}
    </Field>
  );
};

type MaterialUiSingleSelectorOwnProps = {
  options: Array<{ label: string; value: number }>;
  title?: ReactNode;
  placeholder?: string;
  inScrollBar?: boolean;
};

type MaterialUiSingleSelectorProps = BaseFieldProps &
  MaterialUiSingleSelectorOwnProps;

const useMaterialUiSingleSelectStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export const MaterialUiSingleSelectorField: React.FC<
  MaterialUiSingleSelectorProps
> = (props) => {
  const [field, meta, helpers] = useField<number>(props.name);
  const value = props.options.find((option) => option.value === field.value);
  const classes = useMaterialUiSingleSelectStyles();
  return (
    <div className={classes.container}>
      {!!props.title && props.title}
      <Field {...props}>
        {() => (
          <MaterialUISelector
            placeholder={props.placeholder}
            onChange={(option) => {
              helpers.setValue(option.value);
            }}
            value={value}
            isMulti={false}
            inScrollBar={props.inScrollBar}
            options={props.options}
            error={!!(meta.touched && meta.error)}
          />
        )}
      </Field>
    </div>
  );
};

type MaterialUiMultiSelectorProps = {
  options: Array<{ label: string; value: number }>;
  title?: ReactNode;
  placeholder?: string;
  inScrollBar?: boolean;
  isDisabled?: boolean;
};

type Props = BaseFieldProps & MaterialUiMultiSelectorProps;

const useMaterialUiMultiSelectStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export const MaterialUiMultiSelectorField: React.FC<Props> = (props) => {
  const [field, meta, helpers] = useField<Array<number>>(props.name);
  const value = field.value.map((val) =>
    props.options.find((option) => option.value === val),
  );
  const classes = useMaterialUiMultiSelectStyles();
  return (
    <div className={classes.container}>
      {!!props.title && props.title}
      <Field {...props}>
        {() => (
          <MaterialUISelector
            isDisabled={props.isDisabled}
            placeholder={props.placeholder}
            onChange={(optionList) => {
              const valueList = optionList.map((option) => option.value);
              helpers.setValue(valueList);
            }}
            inScrollBar={props.inScrollBar}
            value={value}
            isMulti
            options={props.options}
            error={!!(meta.touched && meta.error)}
          />
        )}
      </Field>
    </div>
  );
};
