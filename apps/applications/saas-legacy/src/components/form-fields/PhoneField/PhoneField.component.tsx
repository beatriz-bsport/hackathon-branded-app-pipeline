import React from 'react';

import { Field, ErrorMessage, useField } from 'formik';

import { useTranslation } from 'react-i18next';
import PhoneInput, {
  Country,
  FlagProps,
  Value,
} from 'react-phone-number-input';

import InputLabel from '@material-ui/core/InputLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MuiFormControl from '@material-ui/core/FormControl';
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import 'react-phone-number-input/style.css';
import './phone_number_input.css';

/* ------------------------------ Flag Component ------------------------------ */
/**
 * This component displays a flag image based on the provided country code.
 *
 * @param {string} props.country - The country code for the flag to be displayed.
 * @returns {JSX.Element} The rendered flag component.
 */
const FlagComponent: React.FC<FlagProps> = React.memo(({ country }) => (
  <div className="fill">
    <img
      alt="flag"
      src={`https://flagcdn.com/48x36/${(country ?? 'fr').toLowerCase()}.png`}
    />
  </div>
));

/* ------------------------------ Input Component ------------------------------ */
/**
 * This component renders a text field with custom styling and forwards its ref.
 *
 * @param {Object} props - The text field component props.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to be forwarded to the input element.
 * @returns {JSX.Element} The rendered input component.
 */
const InputComponent = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    const { value, onChange, ...rest } = props;
    const classes = useInputComponentStyles();
    return (
      <MuiTextField
        className={classes.field}
        inputRef={ref}
        onChange={onChange}
        value={value}
        {...rest}
      />
    );
  },
);
const useInputComponentStyles = makeStyles((theme) => ({
  field: {
    marginBottom: theme.spacing(1),
  },
}));

/* ----------------------- Enhanced Phone Input Component ----------------------- */
/**
 * This component enhances the PhoneInput component with additional props and styles
 * to match our design requirements.
 *
 * @param {Object} props - The props to be passed to the PhoneInput component.
 * @returns {JSX.Element} The rendered enhanced phone input component.
 */
export const EnhancedPhoneInput: React.FC<
  React.ComponentProps<typeof PhoneInput>
> = React.memo((props) => {
  const classes = usePhoneInputStyles();

  return (
    <PhoneInput
      {...props}
      autoComplete="tel"
      className={classes.phoneInput}
      flagComponent={FlagComponent}
      inputComponent={InputComponent}
    />
  );
});
const usePhoneInputStyles = makeStyles(() => ({
  phoneInput: {
    marginTop: 18,
  },
}));

/* ---------------------------- Phone Field Component ---------------------------- */
type PhoneFieldV2Props = {
  /** The label displayed for the phone field. */
  label: string;
  /** The name given to the phone field div. */
  name: string;
  /** The country code for the phone input. */
  phoneCountry: string;
  /** Whether the phone field is disabled. */
  disabled?: boolean;
  /** Whether the phone field should take up the full width of its container. */
  fullWidth?: boolean;
  /** Whether the phone field is required. */
  required?: boolean;
};
/**
 * This component renders a form field for phone input, integrating validation
 * and custom styles.
 *
 * @param {string} label - The label for the phone field.
 * @param {string} name - The name of the phone field.
 * @param {string} phoneCountry - The default country code for the phone input.
 * @param {boolean} [disabled] - Whether the phone field is disabled.
 * @param {boolean} [fullWidth] - Whether the phone field should take up the full width of its container.
 * @param {boolean} [required] - Whether the phone field is required.
 * @returns {JSX.Element} The rendered phone field component.
 */
export const PhoneFieldV2: React.FC<PhoneFieldV2Props> = React.memo(
  ({ label, name, phoneCountry, disabled, fullWidth, required }) => {
    const { t } = useTranslation();
    const classes = usePhoneFieldStyles();

    const [field, meta, helpers] = useField<Value>(name);
    const { touched, error } = meta;
    const { setValue } = helpers;

    return (
      <Field name={name}>
        {() => (
          <>
            <MuiFormControl
              error={!!(touched && error)}
              fullWidth={fullWidth}
              required={required}
            >
              <InputLabel
                shrink
                classes={{
                  root: classes.labelRoot,
                  shrink: classes.labelShrink,
                }}
                htmlFor={name}
              >
                {label}
              </InputLabel>
              <EnhancedPhoneInput
                {...field}
                defaultCountry={phoneCountry as Country}
                disabled={disabled}
                name={name}
                onBlur={field.onBlur}
                onChange={setValue}
              />
            </MuiFormControl>
            <ErrorMessage name={name}>
              {(message) => (
                <Typography className={classes.alertError} variant="body2">
                  {t(message)}
                </Typography>
              )}
            </ErrorMessage>
          </>
        )}
      </Field>
    );
  },
);
const usePhoneFieldStyles = makeStyles((theme) => ({
  labelRoot: {
    position: 'absolute',
    left: 42,
  },
  labelShrink: {
    left: 0,
  },
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
}));

export default PhoneFieldV2;
