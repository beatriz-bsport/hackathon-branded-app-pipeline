// @ts-nocheck
import React, { ReactNode } from 'react';
import classNames from 'classnames';

import MuiTextField from '@material-ui/core/TextField';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Field, FieldProps, useField } from 'formik';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Switch } from '@material-ui/core';
import MaterialUISelector, {
  Props as MaterialUISelectorProps,
} from '#components/Selector/MaterialUISelector.component';

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
          disabled={disabled}
          error={!!meta.error}
          inputProps={{
            'data-testid': 'input-test',
          }}
          label={label}
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          required={required}
          value={field.value}
          variant={variant}
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
          classes={classes}
          control={
            <Checkbox
              checked={reverted ? !field.value : field.value}
              disabled={!!disabled}
              {...props}
              {...field}
              error={!!(meta.touched && meta.error)}
              onChange={() => {
                onChange && onChange(!field.value);
                helpers.setValue(!field.value);
              }}
            />
          }
          id="checkbox"
          label={label}
        />
      )}
    </Field>
  );
};

type SwitchFieldProps = {
  id?: string;
  name: string;
  disabled?: boolean;
  label: string;
  switchColor?: 'default' | 'primary' | 'secondary';
  revertValue?: boolean;
};
export const SwitchField = (props: SwitchFieldProps) => {
  const { name, disabled, label, switchColor, revertValue, id } = props;
  return (
    <Field name={name}>
      {({ field }: FieldProps) => {
        return (
          <FormControlLabel
            id={id}
            {...field}
            checked={revertValue ? !field.value : field.value}
            control={<Switch color={switchColor ?? 'primary'} />}
            disabled={disabled}
            label={label}
            value=""
          />
        );
      }}
    </Field>
  );
};

type MaterialUiSingleSelectorOwnProps = {
  options: Array<{ label: string; value: number }>;
  title?: ReactNode;
  onChange?: (value: { label: string; value: any }) => void;
  forceError?: boolean;
} & Partial<
  Pick<
    MaterialUISelectorProps<{
      label: string;
      value: string;
    }>,
    | 'chipsRenderer'
    | 'isMenuListVirtualized'
    | 'itemRenderer'
    | 'inScrollBar'
    | 'placeholder'
    | 'isDisabled'
  >
>;

type MaterialUiSingleSelectorProps = BaseFieldProps &
  MaterialUiSingleSelectorOwnProps & {
    className?: string;
  };

const useMaterialUiSingleSelectStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
  },
}));

export const MaterialUiSingleSelectorField: React.FC<
  MaterialUiSingleSelectorProps
> = (props) => {
  const [field, meta, helpers] = useField<number>(props.name);
  const value = props.options.find((option) => option.value === field.value);
  const classes = useMaterialUiSingleSelectStyles();

  return (
    <div className={classNames(classes.container, props.className)}>
      {!!props.title && props.title}
      <Field {...props}>
        {() => (
          <MaterialUISelector
            chipsRenderer={props.chipsRenderer}
            error={!!(meta.touched && meta.error) || props.forceError}
            inScrollBar={props.inScrollBar}
            isDisabled={props.isDisabled}
            isMenuListVirtualized={props.isMenuListVirtualized}
            isMulti={false}
            onChange={(option) => {
              props.onChange
                ? props.onChange(option)
                : helpers.setValue(option.value);
              helpers.setTouched(true, false);
            }}
            options={props.options}
            placeholder={props.placeholder}
            value={value}
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
  isMenuListVirtualized?: boolean;
  className?: string;
  defaultNumberShown?: number;
  forceError?: boolean;
  withoutConfirmButton?: boolean;
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
    <div className={classNames(classes.container, props.className)}>
      {!!props.title && props.title}
      <Field {...props}>
        {() => (
          <MaterialUISelector
            isMulti
            defaultNumberShown={props.defaultNumberShown}
            error={!!(meta.touched && meta.error) || props.forceError}
            inScrollBar={props.inScrollBar}
            isDisabled={props.isDisabled}
            isMenuListVirtualized={props.isMenuListVirtualized}
            onChange={(optionList) => {
              const valueList = optionList.map((option) => option.value);
              helpers.setValue(valueList);
              helpers.setTouched(true, false);
            }}
            options={props.options}
            placeholder={props.placeholder}
            value={value}
            withoutConfirmButton={props.withoutConfirmButton}
          />
        )}
      </Field>
    </div>
  );
};
