// @flow

import omit from 'lodash/omit';

import React from 'react';

import { Field, ErrorMessage, useField } from 'formik';

import { useTranslation, withTranslation, TFunction } from 'react-i18next';

import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import TimePicker from 'material-ui-pickers/TimePicker';
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
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import moment from 'moment-timezone';
import makeStyles from '@material-ui/styles/makeStyles';

import * as Yup from 'yup';

import MuiTextField from '@material-ui/core/TextField';
import MuiButton from '@material-ui/core/Button';
import MuiFormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';

import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { getCurrencyDisplay } from '../libs/theme/selectors';
import 'react-phone-number-input/style.css';
import i18n, { Moment } from '../i18n';
import DelayedTextField from './DelayedTextField.component';
import ColorInput from './input/ColorInput.component';
import Selector from './Selector.component';
import IconInput from './input/IconInput.component';
import { formatAsTime } from '../utils/datetime';

type AlertErrorProps = {
  t: TFunction,
};

const styles = (theme) => ({
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
  inputLabelContainer: {
    paddingBottom: theme.spacing(2),
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
  const { classes, shrink } = props;
  return (
    <Field {...props}>
      {({
        field,
        meta: { touched, error },
        form: { setFieldValue, setFieldTouched },
      }) => {
        return (
          <MuiTextField
            className={classes.field}
            shrink={shrink}
            {...field}
            {...omit(props, ['field'])}
            onChange={(ev) => {
              props?.onChange?.(ev);
              setFieldTouched(props.name);
              if (props.castAsNumber) {
                const value = Number.parseFloat(ev.target.value);

                setFieldValue(props.name, Number.isNaN(value) ? 0 : value);

                return;
              }
              setFieldValue(props.name, ev.target.value);
            }}
            error={!!(touched && typeof error === 'string')}
          />
        );
      }}
    </Field>
  );
});

export const TextFieldEnhancedLabelWithError = withStyles(textFieldStyles)(
  (props: Props) => {
    const { classes, shrink } = props;
    const { t } = useTranslation();
    const [field, meta] = useField(props);

    return (
      <Field {...props}>
        {() => {
          return (
            <>
              <MuiTextField
                className={classes.field}
                shrink={shrink}
                {...field}
                {...omit(props, ['field', 'classes'])}
                onBlur={field.onBlur}
                error={!!(meta.touched && meta.error)}
                label={
                  meta.touched && meta.error ? (
                    <Typography variant="caption" color="error">
                      {`${props.label}: ${t(meta.error)}`}
                    </Typography>
                  ) : (
                    props.label
                  )
                }
              />
            </>
          );
        }}
      </Field>
    );
  },
);

export const IntegerFieldEnhancedHelperTextError = withStyles(textFieldStyles)(
  (props: Props) => {
    const { classes, shrink } = props;
    const { t } = useTranslation();
    const [field, meta] = useField(props);

    return (
      <Field {...props}>
        {() => {
          return (
            <>
              <MuiTextField
                className={classes.field}
                shrink={shrink}
                {...field}
                {...omit(props, ['field', 'classes'])}
                onBlur={field.onBlur}
                error={!!(meta.touched && meta.error)}
                InputProps={{ inputProps: { min: props.min ?? 0 } }}
                type="number"
                helperText={
                  meta.touched && meta.error ? (
                    <Typography variant="caption" color="error">
                      {`${t(meta.error)}`}
                    </Typography>
                  ) : (
                    props.helperText
                  )
                }
              />
            </>
          );
        }}
      </Field>
    );
  },
);

export const DelayTextField = withStyles(textFieldStyles)((props: Props) => {
  const { classes } = props;
  return (
    <Field {...props}>
      {({ field, meta: { touched, error } }) => (
        <div>
          <DelayedTextField
            className={classes.field}
            {...field}
            {...omit(props, ['field'])}
            error={!!(touched && error)}
          />
        </div>
      )}
    </Field>
  );
});

type PriceFieldProps = {
  min?: number,
  fullWidth?: boolean,
} & TextFieldProps;

PriceField.defaultProps = {
  fullWidth: false,
};

export function PriceField(props: PriceFieldProps) {
  return (
    <TextField
      castAsNumber
      fullWidth={props.fullWidth}
      InputProps={{
        inputProps: { min: props.min ?? 0, step: 0.01 },
        startAdornment: (
          <InputAdornment position="start">
            {getCurrencyDisplay()}
          </InputAdornment>
        ),
      }}
      type="number"
      {...omit(props, ['field'])}
    />
  );
}

type IntegerFieldProps = {
  min?: number,
} & TextFieldProps;

export function IntegerField(props: IntegerFieldProps) {
  return (
    <TextField
      castAsNumber
      InputProps={{
        inputProps: { min: props.min ?? 0, step: 1 },
      }}
      type="number"
      {...omit(props, ['field'])}
    />
  );
}

export function PercentField(props: any) {
  return (
    <TextField
      castAsNumber
      InputProps={{
        inputProps: { min: 0, step: props.step || 1, max: 100 },
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      type="number"
      {...omit(props, ['field'])}
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

const useDateFieldStyles = makeStyles((theme) => ({
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
  inputLabelContainer: {
    paddingBottom: theme.spacing(2),
  },
}));
export const DateField = (
  props: DateFieldProps & { allowNullValue?: boolean },
) => {
  const { t } = useTranslation();
  const classes = useDateFieldStyles();
  const now = moment().startOf('year').add(-30, 'years').format('YYYY-MM-DD');

  return (
    <Field
      {...props}
      render={({
        field,
        meta: { touched, error },
        form: { setFieldValue, setFieldTouched },
      }) => (
        <MuiPickersUtilsProvider
          utils={MomentUtils}
          moment={Moment}
          locale={Moment.locale()}
        >
          <DatePicker
            {...field}
            {...props}
            style={{ minWidth: 120 }}
            value={props.allowNullValue ? field.value : field.value || now}
            onChange={(date) => {
              props?.onChange?.(date);
              setFieldTouched(props.name);
              setFieldValue(
                props.name,
                props.parseAsString ? moment(date).format('YYYY-MM-DD') : date,
              );
            }}
            format="L"
            error={!!(touched && error)}
            label={
              touched &&
              error &&
              !props.outsideErrorDisplay &&
              !props.bottomError ? (
                <Typography variant="caption" color="error">
                  {`${props.label}: ${t(error)}`}
                </Typography>
              ) : (
                props.label
              )
            }
          />
          {props.bottomError && !props.outsideErrorDisplay && (
            <ErrorMessage
              {...props}
              render={(message) => (
                <Typography variant="body2" className={classes.alertError}>
                  {t(message)}
                </Typography>
              )}
            />
          )}
        </MuiPickersUtilsProvider>
      )}
    />
  );
};

export const TimeField = (props: TimeFieldProps) => {
  const { t } = useTranslation();
  return (
    <Field
      {...props}
      render={({
        field,
        meta: { touched, error },
        form: { setFieldValue },
      }) => (
        <>
          <MuiPickersUtilsProvider
            utils={MomentUtils}
            moment={Moment}
            locale={Moment.locale()}
          >
            <TimePicker
              {...field}
              {...props}
              style={{ width: 100 }}
              onChange={(time) => {
                setFieldValue(
                  props.name,
                  props.parseAsString ? formatAsTime(time) : time,
                );
              }}
              format="LT"
              error={!!(touched && error)}
              label={
                touched && error && !props.outsideErrorDisplay ? (
                  <Typography variant="caption" color="error">
                    {t(error)}
                  </Typography>
                ) : (
                  props.label
                )
              }
              ampm={i18n.language === 'en-US'}
            />
          </MuiPickersUtilsProvider>
          <AccessTimeIcon
            style={{ marginLeft: -25, marginBottom: 4, color: 'grey' }}
          />
        </>
      )}
    />
  );
};
const DurationFieldstyles = (theme) => ({
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
  inputLabelContainer: {
    paddingBottom: theme.spacing(0.5),
  },
});

export const DurationField = withStyles(DurationFieldstyles)(
  withTranslation(['common'])((props: DateFieldProps) => {
    return (
      <Field
        {...props}
        render={({
          field,
          form: { setFieldValue },
          meta: { touched, error },
        }) => {
          const total = parseInt(field.value || 0, 10);
          const days = parseInt(total / (60 * 24), 10);
          const hours = parseInt((total - days * 24 * 60) / 60, 10);
          const minutes = total - days * 24 * 60 - hours * 60;
          return (
            <MuiFormControl
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
              error={!!(touched && error)}
            >
              {!!props.label && (
                <div className={props.classes.inputLabelContainer}>
                  <Typography variant="body1" htmlFor={props.name} shrink>
                    {props.label}
                  </Typography>
                </div>
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
                    <FormHelperText>
                      {props.t('form.duration.day', { count: days })}
                    </FormHelperText>
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
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                        }}
                      >
                        <FormHelperText>
                          {props.t('form.duration.hour', { count: hours })}
                        </FormHelperText>
                        <TextField
                          fullWidth
                          InputProps={{
                            inputProps: { min: 0, step: 1, max: 23 },
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
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                        }}
                      >
                        <FormHelperText>
                          {props.t('form.duration.minute', { count: minutes })}
                        </FormHelperText>
                        <TextField
                          fullWidth
                          InputProps={{
                            inputProps: { min: 0, max: 59, step: 1 },
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
    <Field {...props}>
      {({ field, form: { setFieldValue } }) => (
        <ColorInput
          id={props.id}
          {...field}
          {...props}
          onChange={(color) => setFieldValue(props.name, color)}
          color={field.value}
          buttonStyle={props.buttonStyle}
        />
      )}
    </Field>
  );
};
const IconFieldStyle = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export const IconField = (props: { name: string, label?: string }) => {
  const classes = IconFieldStyle();
  return (
    <Field {...props}>
      {({ field, form: { setFieldValue, setFieldTouched } }) => (
        <div className={classes.container}>
          <IconInput
            icon={field.value}
            label={props?.label}
            onChange={(icon) => setFieldValue(props.name, icon)}
            setFieldTouched={() => setFieldTouched(props.name, true)}
          />
          <ErrorMessage
            name={props.name}
            render={(message) => (
              <Typography color="error">{message}</Typography>
            )}
          />
        </div>
      )}
    </Field>
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
        {({ field, meta: { touched, error }, form: { setFieldValue } }) => (
          <div>
            <MuiFormControl
              required={required}
              error={!!(touched && error)}
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
                flags={flags}
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
    const { t, label, fullWidth, required } = props;
    return (
      <Field {...props}>
        {({ field, meta: { touched, error } }) => (
          <MuiFormControl
            fullWidth={fullWidth}
            required={required}
            error={!!(touched && error)}
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
              value={
                typeof field.value !== 'string'
                  ? JSON.stringify(field.value)
                  : field.value
              }
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
                <Typography variant="caption" color="error">
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

export const VaccinationStatusField = withStyles(styles)(
  withTranslation([])((props: GenderFieldProps) => {
    const { t, label, fullWidth, classes, required } = props;
    return (
      <Field {...props}>
        {({ field, meta: { touched, error } }) => (
          <MuiFormControl
            fullWidth={fullWidth}
            required={required}
            error={!!(touched && error)}
          >
            <InputLabel shrink htmlFor="vaccination-helper">
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
              value={
                typeof field.value !== 'string'
                  ? JSON.stringify(field.value)
                  : field.value
              }
            >
              <MenuItem key="true" value="true">
                {t('common.vaccinationDone')}
              </MenuItem>
              <MenuItem key="false" value="false">
                {t('common.vaccinationNotDone')}
              </MenuItem>
              <MenuItem key="null" value="null">
                {t('common.vaccinationDontWantToCommunicate')}
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

const useStyle = makeStyles(() => ({
  select: {
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
}));

export const SelectField = withStyles(styles)(
  withTranslation([])((props: SelectFieldProps) => {
    const { t, choices, label, fullWidth, classes, required } = props;
    const labelRef = React.useRef(null);
    const selectRef = React.useRef(null);
    const selectClasses = useStyle();
    return (
      <Field {...props}>
        {({ field, meta: { touched, error }, form: { setFieldValue } }) => (
          <MuiFormControl
            fullWidth={fullWidth}
            required={required}
            error={!!(touched && error)}
          >
            {label && (
              <InputLabel shrink htmlFor="select-helper" ref={labelRef}>
                {label}
              </InputLabel>
            )}
            <Select
              ref={selectRef}
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
              onChange={(e) => {
                if (!props.keepFocusOnSelect) {
                  labelRef.current?.classList?.remove('Mui-focused');
                  selectRef.current?.classList?.remove('Mui-focused');
                }
                setFieldValue(field.name, e.target.value);
              }}
              classes={selectClasses}
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
  { value: 10, label: 'form.tenMinutes' },
  { value: 15, label: 'form.quarterHour' },
  { value: 20, label: 'form.twentyMinutes' },
  { value: 30, label: 'form.halfHour' },
  { value: 45, label: 'form.halfAndQuarterHour' },
  { value: 50, label: 'form.fiftyMinutes' },
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

export const IntervalRecurrenceSelectField = withTranslation()(
  (props: SelectFieldProps & { displayPeriod?: boolean }) => (
    <SelectField
      choices={[
        ...(props?.withoutDaily ?? false
          ? []
          : [
              {
                value: 'day',
                label: props.displayPeriod
                  ? 'form.period.day'
                  : 'form.interval.day',
              },
            ]),
        {
          value: 'week',
          label: props.displayPeriod
            ? 'form.period.week'
            : 'form.interval.week',
        },
        {
          value: 'month',
          label: props.displayPeriod
            ? 'form.period.month'
            : 'form.interval.month',
        },
        {
          value: 'year',
          label: props.displayPeriod
            ? 'form.period.year'
            : 'form.interval.year',
        },
      ]}
      {...props}
    />
  ),
);

export const HoursDaysIntervalRecurrenceSelectField = (
  props: SelectFieldProps & { displayPeriod?: boolean },
) => (
  <SelectField
    choices={[
      {
        value: 'hour',
        label: props.displayPeriod ? 'form.period.hour' : 'form.interval.hour',
      },
      {
        value: 'day',
        label: props.displayPeriod ? 'form.period.day' : 'form.interval.day',
      },
    ]}
    {...props}
  />
);

export const CheckboxField = (props: Props) => {
  const { reverted, disabled, label, helperText, classes } = props;
  return (
    <FormControl>
      <Field {...props}>
        {({ field, form: { setFieldValue }, meta: { touched, error } }) => (
          <FormControlLabel
            label={label}
            id="checkbox"
            helperText={helperText}
            classes={classes}
            control={
              <Checkbox
                disabled={!!disabled}
                checked={reverted ? !field.value : field.value}
                {...props}
                {...field}
                onChange={() => {
                  setFieldValue(field.name, !field.value);
                }}
                error={!!(touched && error)}
              />
            }
          />
        )}
      </Field>
      <FormHelperText style={{ marginTop: -8 }}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export const MultipleCheckboxField = (props: Props) => {
  const { choices, disabled, asFieldset, label, name, helperText, labelClass } =
    props;
  const Container = asFieldset ? (p) => <fieldset {...p} /> : FormControl;
  const Label = asFieldset ? (p) => <legend {...p} /> : FormLabel;
  return (
    <Container component="fieldset">
      {!!label && (
        <Label
          className={labelClass}
          style={{ marginBottom: -2 }}
          component="legend"
        >
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
                    checked={
                      field.value ? field.value.some((v) => v === id) : false
                    }
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

type CheckboxFieldWithActionProps = Props & {
  reverted?: boolean,
  disabled?: boolean,
  label?: string,
  helperText?: string,
  classes?: { [key: string]: string },
  handleOnChange: () => void,
};

export const CheckboxFieldWithAction = (
  props: CheckboxFieldWithActionProps,
) => {
  const { reverted, disabled, label, helperText, classes, handleOnChange } =
    props;

  const onChangeCheckboxFieldWithAction = React.useCallback(
    (setValue, name, value) => () => {
      setValue(name, value);
      handleOnChange();
    },
    [handleOnChange],
  );

  return (
    <FormControl>
      <Field {...props}>
        {({ field, form: { setFieldValue }, meta: { touched, error } }) => (
          <FormControlLabel
            label={label}
            id="checkbox"
            helperText={helperText}
            classes={classes}
            control={
              <Checkbox
                disabled={!!disabled}
                checked={reverted ? !field.value : field.value}
                {...props}
                {...field}
                onChange={onChangeCheckboxFieldWithAction(
                  setFieldValue,
                  field.name,
                  !field.value,
                )}
                error={!!(touched && error)}
              />
            }
          />
        )}
      </Field>
      <FormHelperText style={{ marginTop: -8 }}>{helperText}</FormHelperText>
    </FormControl>
  );
};

type SwitchFieldProps = {
  name: string,
  disabled: boolean,
  label: string,
  className: string,
  inverse?: boolean,
  helperText?: string,
  color?: Variant,
};
export const SwitchField = (props: SwitchFieldProps) => {
  const { name, disabled, label, inverse, className, helperText } = props;
  return (
    <div>
      <Field name={name}>
        {({ field }) => (
          <FormControlLabel
            {...field}
            value=""
            checked={inverse ? !field.value : field.value}
            label={label}
            disabled={disabled}
            control={<Switch color={props.color} />}
            className={className}
          />
        )}
      </Field>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </div>
  );
};

type RadioFieldProps = {
  disabled?: boolean,
  label?: string,
  classes?: any,
  name: string,
  choices: {
    label: string,
    value: any,
    helperText?: string,
  }[],
  labelClass?: any,
  isRow?: boolean,
};

export const RadioGroupField = (props: RadioFieldProps) => {
  const { name, choices, label, labelClass, isRow } = props;
  return (
    <Field name={name}>
      {({ field, form: { setFieldValue } }) => (
        <RadioGroup
          name={name}
          onChange={(_, value) => setFieldValue(field.name, value)}
          row={isRow}
        >
          <FormLabel className={labelClass}>{label}</FormLabel>
          {choices.map(({ value, label: l, helperText }) => (
            <div key={value}>
              <FormControlLabel
                key={value}
                value={value}
                disabled={props.disabled}
                control={<Radio checked={`${field.value}` === `${value}`} />}
                label={l}
                classes={props.classes}
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

const selectFieldStyles = (theme) => ({
  field: {
    marginBottom: theme.spacing(1),
  },
});

export const SelectFieldWithEnhancedLabeLError = withStyles(selectFieldStyles)(
  (props: Props) => {
    const { classes, shrink } = props;
    const { t } = useTranslation();
    return (
      <Field {...props}>
        {({ field, meta: { touched, error } }) => {
          return (
            <Selector
              className={classes.field}
              shrink={shrink}
              {...field}
              {...omit(props, ['field'])}
              error={!!(touched && error)}
              placeholder={
                touched && error ? (
                  <Typography variant="caption" color="error">
                    {`${props.label}: ${t(error)}`}
                  </Typography>
                ) : (
                  props.label
                )
              }
            />
          );
        }}
      </Field>
    );
  },
);
