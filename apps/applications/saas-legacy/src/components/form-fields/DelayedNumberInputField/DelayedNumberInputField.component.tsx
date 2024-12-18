import React from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import {
  CircularProgress,
  InputAdornment,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DelayedNumericInput from '#src/components/DelayedNumericInput.component';

// ---------------------- Left Icon or Circular Loading ----------------------

type InputEndAdornmentProps = {
  isLoading?: boolean;
  isValid?: boolean;
};

const InputEndAdornment: React.FC<InputEndAdornmentProps> = React.memo(
  ({ isLoading, isValid }) => {
    const classes = useInputEndAdornmentStyles();

    if (isLoading) return <CircularProgress color="inherit" size={20} />;

    if (isValid) return <CheckIcon className={classes.checkIcon} />;

    if (!isValid) return <ErrorOutlineIcon color="error" />;
  },
);

const useInputEndAdornmentStyles = makeStyles((theme) => ({
  checkIcon: {
    color: theme.palette.success.main,
  },
}));

// --------------------------- Number Input Field ----------------------------

type Props = InputEndAdornmentProps & {
  disabled?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  label: string;
  name: string;
  required?: boolean;
  withValidationIcon?: boolean;
};

const DelayedNumberInputField: React.FC<Props> = ({
  disabled,
  errorMessage,
  fullWidth,
  isLoading,
  isValid,
  label,
  name,
  required,
  withValidationIcon,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [field, meta] = useField(name);

  const showErrorBorder = React.useMemo(
    () =>
      !isLoading &&
      (!!errorMessage || (meta.touched && (!isValid || !!meta.error))),
    [errorMessage, isLoading, isValid, meta.error, meta.touched],
  );

  const showErrorMessage = React.useMemo(
    () => !isLoading && (!!errorMessage || (meta.touched && meta.error)),
    [errorMessage, isLoading, meta.error, meta.touched],
  );

  return (
    <div>
      <DelayedNumericInput
        {...field}
        disabled={disabled}
        error={showErrorBorder}
        fullWidth={fullWidth}
        inputClass={classes.inputProps}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: withValidationIcon && (
            <InputAdornment position="end">
              <InputEndAdornment
                isLoading={isLoading}
                isValid={isValid && !meta.error}
              />
            </InputAdornment>
          ),
        }}
        label={label}
        required={required}
        size="small"
        variant="outlined"
      />
      {showErrorMessage ? (
        <Typography color="error" variant="caption">
          {errorMessage || t(meta.error)}
        </Typography>
      ) : null}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  inputProps: {
    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
      {
        '-webkit-appearance': 'none',
        margin: '-56px', // This completely hides the arrows by positioning the corresponding div outside of the input field
      },
    '& input[type=number]': {
      '-moz-appearance': 'none',
    },
  },
}));

export default React.memo(DelayedNumberInputField);
