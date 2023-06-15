import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import classnames from 'classnames';

export type Props = {
  name: string;
  placeholder: string;
  label?: string;
  value: string;
  minRows?: number;
  onChange: (event: React.ChangeEvent) => void;
  onFocus?: () => void;
  className?: string;
  colorsOverride?: ColorsOverride;
  fullWidth?: boolean;
  variant?: 'filled' | 'outlined' | 'standard';
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  error?: boolean;
  helperText?: string;
};

type ColorsOverride = {
  borderColor?: string;
  borderColorFocus?: string;
  borderColorHover?: string;
  textColor?: string;
  placeholderColor?: string;
  labelColor?: string;
  labelColorFocus?: string;
};

const TextFieldWithCustomColors: React.FC<Props> = (props) => {
  const classes = useStyles(props.colorsOverride || {});
  const numRows = props.minRows || 1;

  return (
    <TextField
      name={props.name ?? ''}
      placeholder={props.placeholder}
      fullWidth={props.fullWidth}
      label={props.label}
      minRows={numRows}
      multiline={numRows > 1}
      value={props.value}
      onChange={props.onChange}
      variant={props.variant || 'outlined'}
      className={classnames([props.className, classes.overrideRoot])}
      InputProps={{
        classes: {
          input: classes.input,
          inputMultiline: classes.input,
        },
        endAdornment: props.endAdornment,
        startAdornment: props.startAdornment,
      }}
      onFocus={props.onFocus}
      error={props.error}
      helperText={props.helperText}
    />
  );
};

const useStyles = makeStyles<Theme, ColorsOverride>(() => ({
  overrideRoot: (props) => ({
    '& label': {
      color: props.labelColor || 'default',
    },
    // input label when focused
    '& label.Mui-focused': {
      color: props.labelColorFocus || 'default',
    },
    // focused color for input with variant='standard'
    '& .MuiInput-underline:after': {
      borderBottomColor: props.borderColorFocus || 'default',
    },
    // focused color for input with variant='filled'
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: props.borderColorFocus || 'default',
    },
    // focused color for input with variant='outlined'
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: props.borderColor || 'default',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: props.borderColorHover || 'default',
      },
      '&.Mui-focused fieldset': {
        borderColor: props.borderColorFocus || 'default',
      },
    },
  }),
  input: (props) => ({
    color: props.textColor || 'default',
    '&::placeholder': {
      color: props.placeholderColor || 'default',
    },
  }),
}));

export default React.memo(TextFieldWithCustomColors);
