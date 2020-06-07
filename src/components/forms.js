// @flow

import omit from 'lodash/omit';

import React from 'react';

import { Field, ErrorMessage } from 'formik';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import DatePicker from 'material-ui-pickers/DatePicker';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import AddIcon from '@material-ui/icons/Add';

import * as Yup from 'yup';

import MuiTextField from '@material-ui/core/TextField';
import MuiButton from '@material-ui/core/Button';
import MuiFormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import DelayedTextField from './DelayedTextField.component';
import ColorInput from './input/ColorInput.component';

type AlertErrorProps = {
  t: TFunction,
};

const styles = (theme) => ({
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
});

export const AlertError = withTranslation([])(
  withStyles(styles)((props: AlertErrorProps) => {
    const { classes, t } = props;
    return (
      <ErrorMessage
        {...props}
        render={(message) => (
          <Typography variant="body2" className={classes.alertError}>
            {t(message)}
          </Typography>
        )}
      />
    );
  }),
);

const textFieldStyles = (theme) => ({
  field: {
    marginBottom: theme.spacing(1),
  },
});

export const TextField = withStyles(textFieldStyles)((props: Props) => {
  const { classes } = props;
  return (
    <Field {...props}>
      {({ field, form: { touched, errors } }) => (
        <MuiTextField
          className={classes.field}
          {...field}
          {...props}
          error={!!(touched[field.name] && errors[field.name])}
        />
      )}
    </Field>
  );
});

export const DelayTextField = withStyles(textFieldStyles)((props: Props) => {
  const { classes } = props;
  return (
    <Field {...props}>
      {({ field, form: { touched, errors } }) => (
        <div>
          <DelayedTextField
            className={classes.field}
            {...field}
            {...props}
            error={!!(touched[field.name] && errors[field.name])}
          />
        </div>
      )}
    </Field>
  );
});

export function PriceField(props) {
  return (
    <TextField
      InputProps={{
        inputProps: { min: 0, step: 0.01 },
        startAdornment: <InputAdornment position="start">€</InputAdornment>,
      }}
      type="number"
      {...props}
    />
  );
}

export function IntegerField(props) {
  return (
    <TextField
      InputProps={{
        inputProps: { min: 0, step: 1 },
      }}
      type="number"
      {...props}
    />
  );
}

export function PercentField(props: any) {
  return (
    <TextField
      InputProps={{
        inputProps: { min: 0, step: props.step || 1, max: 100 },
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      type="number"
      {...props}
    />
  );
}

const buttonStyles = (theme) => ({
  root: {
    marginLeft: theme.spacing(2),
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
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
      render={({ field, form: { touched, errors, setFieldValue } }) => (
        <DatePicker
          {...field}
          {...props}
          style={{ minWidth: 120 }}
          onChange={(date) => {
            setFieldValue(props.name, date);
          }}
          format="DD/MM/YYYY"
          error={!!(touched[field.name] && errors[field.name])}
        />
      )}
    />
  );
};

export const DurationField = withStyles(styles)(
  withTranslation(['common'])((props: DateFieldProps) => {
    return (
      <Field
        {...props}
        render={({ field, form: { touched, errors, setFieldValue } }) => {
          const total = parseInt(field.value || 0, 10);
          const days = parseInt(total / (60 * 24), 10);
          const hours = parseInt((total - days * 24 * 60) / 60, 10);
          const minutes = total - days * 24 * 60 - hours * 60;
          /*
              onChange={(date) => {
                setFieldValue(props.name, date);
              }}
      error={!!(touched[field.name] && errors[field.name])}
      */
          return (
            <MuiFormControl
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
              error={!!(touched[field.name] && errors[field.name])}
            >
              {!!props.label && (
                <InputLabel htmlFor={props.name} shrink>
                  {props.label}
                </InputLabel>
              )}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 12,
                }}
              >
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      onChange={(value) => {
                        setFieldValue(
                          props.name,
                          parseInt(value.target.value || 0, 10) * (24 * 60) +
                            hours * 60 +
                            minutes,
                        );
                      }}
                      InputProps={{
                        inputProps: { min: 0, step: 1 },
                        startAdornment: (
                          <InputAdornment position="start">
                            {props.t('form.duration.day', { count: days })}
                          </InputAdornment>
                        ),
                      }}
                      type="number"
                      value={days}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <AddIcon style={{ marginRight: 4 }} />
                      <TextField
                        fullWidth
                        InputProps={{
                          inputProps: { min: 0, step: 1, max: 23 },
                          startAdornment: (
                            <InputAdornment position="start">
                              {props.t('form.duration.hour', { count: hours })}
                            </InputAdornment>
                          ),
                        }}
                        onChange={(value) => {
                          setFieldValue(
                            props.name,
                            parseInt(value.target.value || 0, 10) * 60 +
                              days * 60 * 24 +
                              minutes,
                          );
                        }}
                        type="number"
                        value={hours}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <AddIcon style={{ marginRight: 4 }} />
                      <TextField
                        fullWidth
                        InputProps={{
                          inputProps: { min: 0, max: 59, step: 1 },
                          startAdornment: (
                            <InputAdornment position="start">
                              {props.t('form.duration.minute', {
                                count: minutes,
                              })}
                            </InputAdornment>
                          ),
                        }}
                        type="number"
                        value={minutes}
                        onChange={(value) => {
                          setFieldValue(
                            props.name,
                            parseInt(value.target.value || 0, 10) +
                              days * 60 * 24 +
                              hours * 60,
                          );
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
              {!!props.helperText && (
                <FormHelperText style={{ marginTop: -2 }}>
                  {props.helperText}
                </FormHelperText>
              )}
              <ErrorMessage {...props}>
                {(message) => (
                  <Typography
                    variant="body2"
                    className={props.classes.alertError}
                  >
                    {props.t(message)}
                  </Typography>
                )}
              </ErrorMessage>
            </MuiFormControl>
          );
        }}
      />
    );
  }),
);

export const ColorField = (props: ColorFieldProps) => {
  return (
    <Field
      {...props}
      render={({ field, form: { setFieldValue } }) => (
        <ColorInput
          {...field}
          {...props}
          onChange={(color) => setFieldValue(props.name, color)}
          color={field.value}
        />
      )}
    />
  );
};

type AddressFieldsProps = {
  t: TFunction,
  autoComplete: boolean,
  required: boolean,
  disabled?: boolean,
};

export const AddressFieldsSchema = {
  address_line_1: Yup.string().required(),
  address_line_2: Yup.string(),
  city: Yup.string().required(),
  zipcode: Yup.string().required(),
  country: Yup.string().required(),
};

export const AddressFields = withTranslation([])(
  (props: AddressFieldsProps) => {
    const { t, autoComplete, required, disabled } = props;
    return (
      <div>
        <TextField
          required={required}
          name="address_line_1"
          autoComplete={autoComplete ? 'address-line1' : null}
          fullWidth
          disabled={!!disabled}
          label={t('form.address.addressLine1')}
        />
        <TextField
          name="address_line_2"
          autoComplete={autoComplete ? 'address-line2' : null}
          fullWidth
          disabled={!!disabled}
          label={t('form.address.addressLine2')}
        />
        <Grid container direction="row" spacing={2}>
          <Grid item>
            <TextField
              name="zipcode"
              autoComplete={autoComplete ? 'zipcode' : null}
              label={t('form.address.zipcode')}
              disabled={!!disabled}
              required={required}
            />
          </Grid>
          <Grid item>
            <TextField
              name="city"
              autoComplete={autoComplete ? 'city' : null}
              label={t('form.address.city')}
              disabled={!!disabled}
              required={required}
            />
          </Grid>
        </Grid>
        <TextField
          name="country"
          autoComplete={autoComplete ? 'country' : null}
          required={required}
          disabled={!!disabled}
          label={t('form.address.country')}
        />
      </div>
    );
  },
);

type PhoneFieldProps = {};

const phoneStyles = () => ({
  phoneInput: { marginTop: 18 },
  labelRoot: {
    position: 'absolute',
    left: 42,
  },
  labelShrink: {
    left: 0,
  },
});
export const PhoneField = withTranslation([])(
  withStyles(phoneStyles)((props: PhoneFieldProps) => {
    const { t, label, name, classes, fullWidth, required } = props;
    return (
      <Field {...props}>
        {({ field, form: { touched, errors, setFieldValue } }) => (
          <div>
            <MuiFormControl
              required={required}
              error={!!(touched[field.name] && errors[field.name])}
              fullWidth={fullWidth}
            >
              <InputLabel
                htmlFor={name}
                shrink
                classes={{
                  root: classes.labelRoot,
                  shrink: classes.labelShrink,
                }}
              >
                {label}
              </InputLabel>
              <PhoneInput
                country="FR"
                autoComplete="tel"
                {...field}
                name={name}
                /* FIXME */
                onBlur={(e) => field.onBlur(e)}
                onChange={(value) => setFieldValue(field.name, value)}
                {...omit(props, [
                  'fullWidth',
                  't',
                  'tReady',
                  'i18n',
                  'i18nOptions',
                  'defaultNS',
                  'reportNS',
                ])}
                className={classes.phoneInput}
              />
            </MuiFormControl>
            <ErrorMessage {...props}>
              {(message) => (
                <Typography variant="body2" className={classes.alertError}>
                  {t(message)}
                </Typography>
              )}
            </ErrorMessage>
          </div>
        )}
      </Field>
    );
  }),
);

export const GenderField = withStyles(styles)(
  withTranslation([])((props: GenderFieldProps) => {
    const { t, label, fullWidth, classes, required } = props;
    return (
      <Field {...props}>
        {({ field, form: { touched, errors } }) => (
          <MuiFormControl
            fullWidth={fullWidth}
            required={required}
            error={!!(touched[field.name] && errors[field.name])}
          >
            <InputLabel shrink htmlFor="gender-helper">
              {label}
            </InputLabel>
            <Select
              {...field}
              {...omit(props, [
                't',
                'tReady',
                'defaultNS',
                'i18n',
                'i18nOptions',
                'reportNS',
              ])}
            >
              <MenuItem key="F" value="F">
                {t('common.female')}
              </MenuItem>
              <MenuItem key="M" value="M">
                {t('common.male')}
              </MenuItem>
              <MenuItem key="X" value="X">
                {t('common.otherGender')}
              </MenuItem>
            </Select>
            <ErrorMessage {...props}>
              {(message) => (
                <Typography variant="body2" className={classes.alertError}>
                  {t(message)}
                </Typography>
              )}
            </ErrorMessage>
          </MuiFormControl>
        )}
      </Field>
    );
  }),
);

export const SelectField = withStyles(styles)(
  withTranslation([])((props: SelectFieldProps) => {
    const { t, choices, label, fullWidth, classes, required } = props;
    return (
      <Field {...props}>
        {({ field, form: { touched, errors } }) => (
          <MuiFormControl
            fullWidth={fullWidth}
            required={required}
            error={!!(touched[field.name] && errors[field.name])}
          >
            <InputLabel shrink htmlFor="select-helper">
              {label}
            </InputLabel>
            <Select
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
            >
              {choices.map((c) => {
                if (props.itemRenderer) {
                  return props.itemRenderer(c);
                }
                return (
                  <MenuItem key={c.value} value={c.value}>
                    {t(c.label)}
                  </MenuItem>
                );
              })}
            </Select>
            <ErrorMessage {...props}>
              {(message) => (
                <Typography variant="body1" className={classes.alertError}>
                  {t(message)}
                </Typography>
              )}
            </ErrorMessage>
          </MuiFormControl>
        )}
      </Field>
    );
  }),
);

export const DURATION_CHOICES_SHORT = [
  { value: 0, label: 'form.zeroMinute' },
  { value: 15, label: 'form.quarterHour' },
  { value: 20, label: 'form.twentyMinutes' },
  { value: 30, label: 'form.halfHour' },
  { value: 45, label: 'form.halfAndQuarterHour' },
  { value: 60, label: 'form.oneHour' },
  { value: 75, label: 'form.oneHourFifteen' },
  { value: 90, label: 'form.oneHourAndHalf' },
  { value: 120, label: 'form.twoHour' },
  { value: 180, label: 'form.threeHour' },
  { value: 240, label: 'form.fourHour' },
  { value: 360, label: 'form.sixHour' },
  { value: 60 * 8, label: 'form.eightHour' },
  { value: 60 * 12, label: 'form.twelveHour' },
  { value: 24 * 60, label: 'form.oneDay' },
  { value: 999999, label: 'form.never' },
];

const DURATION_CHOICES_LONG = [
  { value: 0, label: 'form.zeroMinute' },
  { value: 60, label: 'form.oneHour' },
  { value: 60 * 12, label: 'form.twelveHour' },
  { value: 24 * 60, label: 'form.oneDay' },
  { value: 2 * 24 * 60, label: 'form.twoDays' },
  { value: 7 * 24 * 60, label: 'form.oneWeek' },
  { value: 10 * 24 * 60, label: 'form.tenDays' },
  { value: 14 * 24 * 60, label: 'form.twoWeeks' },
  { value: 30 * 24 * 60, label: 'form.oneMonth' },
  { value: 999999, label: 'form.never' },
];

export const DurationMinuteSelectField = withTranslation()(
  (props: SelectFieldProps) => (
    <SelectField
      choices={
        props.variant === 'long'
          ? DURATION_CHOICES_LONG
          : DURATION_CHOICES_SHORT
      }
      {...props}
    />
  ),
);

export const CheckboxField = (props: Props) => {
  const { reverted, disabled, label, helperText } = props;
  return (
    <FormControl>
      <Field
        {...props}
        render={({ field, form: { setFieldValue } }) => (
          <FormControlLabel
            label={label}
            helperText={helperText}
            control={
              <Checkbox
                disabled={!!disabled}
                checked={reverted ? !field.value : field.value}
                {...props}
                {...field}
                onChange={() => {
                  setFieldValue(field.name, !field.value);
                }}
              />
            }
          />
        )}
      />
      <FormHelperText style={{ marginTop: -8 }}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export const MultipleCheckboxField = (props: Props) => {
  const { choices, disabled, asFieldset, label, name, helperText } = props;
  const Container = asFieldset ? (p) => <fieldset {...p} /> : FormControl;
  const Label = asFieldset ? (p) => <legend {...p} /> : FormLabel;
  return (
    <Container component="fieldset">
      {!!label && (
        <Label style={{ marginBottom: -2 }} component="legend">
          {label}
        </Label>
      )}
      <FormGroup>
        <Field name={name}>
          {({ field, form: { setFieldValue } }) =>
            choices.map(({ id, optionLabel }) => (
              <FormControlLabel
                key={id}
                name={name}
                label={optionLabel}
                control={
                  <Checkbox
                    disabled={!!disabled}
                    checked={field.value.some((v) => v === id)}
                    onChange={() => {
                      const newValue = field.value.some((v) => v === id)
                        ? field.value.filter((v) => v !== id)
                        : [...field.value, id];
                      setFieldValue(field.name, newValue);
                    }}
                    value={`${id}`}
                  />
                }
              />
            ))
          }
        </Field>
      </FormGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </Container>
  );
};

type SwitchFieldProps = { name: string, disabled: boolean, label: string };
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

type RadioFieldProps = {
  disabled?: boolean,
  label?: string,
  name: string,
  choices: { label: string, value: * }[],
};

export const RadioGroupField = (props: RadioFieldProps) => {
  const { name, choices, label } = props;
  return (
    <Field name={name}>
      {({ field, form: { setFieldValue } }) => (
        <RadioGroup
          name={name}
          onChange={(_, value) => setFieldValue(field.name, value)}
        >
          <FormLabel>{label}</FormLabel>
          {choices.map(({ value, label: l, helperText }) => (
            <div key={value}>
              <FormControlLabel
                key={value}
                value={value}
                disabled={props.disabled}
                control={<Radio checked={`${field.value}` === `${value}`} />}
                label={l}
              />
              {helperText ? (
                <FormHelperText style={{ marginTop: -8 }}>
                  {helperText}
                </FormHelperText>
              ) : null}
            </div>
          ))}
        </RadioGroup>
      )}
    </Field>
  );
};

type FormControlProps = {};

const formControlStyles = (theme) => ({
  control: {
    marginTop: theme.spacing(1),
  },
  label: {
    marginBottom: theme.spacing(1),
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
  if (!errors) return;
  Object.keys(errors).forEach((key) => {
    const messages = errors[key];
    if (messages.length) {
      messages.forEach((error) => setFieldError(key, error.message));
    }
  });
}

export function bindFormHandlers({ setSubmitting, setFieldError }) {
  return {
    onSuccess: () => {
      setSubmitting(false);
    },
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
