// @flow

import omit from 'lodash/omit';

import React, { useCallback } from 'react';

import { Field, ErrorMessage, useField } from 'formik';

import { useTranslation, withTranslation, TFunction } from 'react-i18next';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker,
} from 'material-ui-pickers';

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
import { DateTime, Settings } from 'luxon';
import { makeStyles } from '@material-ui/core';

import MuiTextField from '@material-ui/core/TextField';
import MuiButton from '@material-ui/core/Button';
import MuiFormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import { LocalizedLuxonUtils } from '../i18n/utils/luxon-picker-utils';
import { formatISOStringAsTime } from '../utils/datetime';
import TagSelector from '../libs/tag/components/TagSelector.selector';
import type { Tag } from '../libs/tag/types';

import { getCurrencyDisplay } from '../libs/theme/selectors';
import i18n from '../i18n';
import DelayedTextField from './DelayedTextField.component';
import ColorInput from './input/ColorInput.component';
import Selector from './Selector.component';
import IconInput from './input/IconInput.component';
import InformationIcon from './InformationIcon';

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
      <ErrorMessage {...props}>
        {(message) => (
          <Typography className={classes.alertError} variant="body2">
            {t(message)}
          </Typography>
        )}
      </ErrorMessage>
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
            error={!!(touched && typeof error === 'string')}
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
                error={!!(meta.touched && meta.error)}
                label={
                  meta.touched && meta.error ? (
                    <Typography color="error" variant="caption">
                      {`${props.label}: ${t(meta.error)}`}
                    </Typography>
                  ) : (
                    props.label
                  )
                }
                onBlur={field.onBlur}
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
                error={!!(meta.touched && meta.error)}
                helperText={
                  meta.touched && meta.error ? (
                    <Typography color="error" variant="caption">
                      {`${t(meta.error)}`}
                    </Typography>
                  ) : (
                    props.helperText
                  )
                }
                InputProps={{ inputProps: { min: props.min ?? 0 } }}
                onBlur={field.onBlur}
                type="number"
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
      color="primary"
      type="submit"
      variant="contained"
      {...props}
      classes={props.classes}
      className={classes.button}
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
  const { parseAsString, clearable } = props;
  const now = DateTime.now();
  const nowISODate = now.toISODate();

  const thirtyYearsAgoISODate = DateTime.now()
    .startOf('year')
    .minus({ year: 30 })
    .toISODate();

  const getDateFieldValueOnChange = useCallback(
    (date) => {
      // In this case we consider that the form using a date that is clearable will
      // handle the null value itself
      if (clearable && !date) {
        return null;
      }
      // In this case we consider that the form is not ready to handle null value : only clearable input
      // can actually handle null value on change.
      if (!date) {
        return parseAsString ? nowISODate : now;
      }

      return parseAsString ? date.toISODate() : date;
    },
    [now, nowISODate, parseAsString, clearable],
  );

  return (
    <Field {...props}>
      {({
        field,
        meta: { touched, error },
        form: { setFieldValue, setFieldTouched },
      }) => (
        <MuiPickersUtilsProvider
          locale={Settings.defaultLocale}
          utils={LocalizedLuxonUtils}
        >
          <DatePicker
            {...field}
            {...props}
            error={!!(touched && error)}
            format="D"
            label={
              touched &&
              error &&
              !props.outsideErrorDisplay &&
              !props.bottomError ? (
                <Typography color="error" variant="caption">
                  {`${props.label}: ${t(error)}`}
                </Typography>
              ) : (
                props.label
              )
            }
            onChange={(date) => {
              props?.onChange?.(date);
              setFieldTouched(props.name);

              setFieldValue(props.name, getDateFieldValueOnChange(date));
            }}
            style={{ minWidth: 120 }}
            value={
              props.allowNullValue
                ? field.value
                : field.value || thirtyYearsAgoISODate
            }
          />
          {props.bottomError && !props.outsideErrorDisplay && (
            <ErrorMessage
              {...props}
              render={(message) => (
                <Typography className={classes.alertError} variant="body2">
                  {t(message)}
                </Typography>
              )}
            />
          )}
        </MuiPickersUtilsProvider>
      )}
    </Field>
  );
};

export const TimeField = (props: TimeFieldProps) => {
  const { t } = useTranslation();
  return (
    <Field {...props}>
      {({ field, meta: { touched, error }, form: { setFieldValue } }) => (
        <MuiPickersUtilsProvider
          locale={Settings.defaultLocale}
          utils={LocalizedLuxonUtils}
        >
          <TimePicker
            {...field}
            {...props}
            ampm={i18n.language === 'en-US'}
            error={!!(touched && error)}
            // format="t"
            label={
              touched && error && !props.outsideErrorDisplay ? (
                <Typography color="error" variant="caption">
                  {t(error)}
                </Typography>
              ) : (
                props.label
              )
            }
            onChange={(time: DateTime) => {
              setFieldValue(
                props.name,
                props.parseAsString
                  ? formatISOStringAsTime(time.toISO())
                  : time,
              );
            }}
            style={{ width: 100 }}
          />
          <AccessTimeIcon
            style={{ marginLeft: -25, marginBottom: 4, color: 'grey' }}
          />
        </MuiPickersUtilsProvider>
      )}
    </Field>
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
      <Field {...props}>
        {({ field, form: { setFieldValue }, meta: { touched, error } }) => {
          const total = parseInt(field.value || 0, 10);
          const days = parseInt(total / (60 * 24), 10);
          const hours = parseInt((total - days * 24 * 60) / 60, 10);
          const minutes = total - days * 24 * 60 - hours * 60;

          const [internalDays, setDays] = React.useState(days);
          const [internalHours, setHours] = React.useState(hours);
          const [internalMinutes, setMinutes] = React.useState(minutes);

          const setDaysFromEvent = React.useCallback(
            (ev) => setDays(ev.target.value),
            [setDays],
          );
          const setHoursFromEvent = React.useCallback(
            (ev) => setHours(ev.target.value),
            [setHours],
          );
          const setMinutesFromEvent = React.useCallback(
            (ev) => setMinutes(ev.target.value),
            [setMinutes],
          );

          const onFocusDays = React.useCallback(() => {
            if (!internalDays) setDays('');
          }, [internalDays, setDays]);
          const onFocusHours = React.useCallback(() => {
            if (!internalHours) setHours('');
          }, [internalHours, setHours]);
          const onFocusMinutes = React.useCallback(() => {
            if (!internalMinutes) setMinutes('');
          }, [internalMinutes, setMinutes]);

          const computeGlobal = React.useCallback(() => {
            const newValue =
              parseInt(internalMinutes || 0, 10) +
              parseInt(internalHours || 0, 10) * 60 +
              parseInt(internalDays || 0, 10) * 24 * 60;
            if (internalDays === '') setDays(0);
            if (internalHours === '') setHours(0);
            if (internalMinutes === '') setMinutes(0);
            setFieldValue(props.name, newValue);
          }, [
            setFieldValue,
            internalDays,
            internalHours,
            internalMinutes,
            setDays,
            setHours,
            setMinutes,
          ]);

          React.useEffect(() => {
            setDays(days || 0);
            setHours(hours || 0);
            setMinutes(minutes || 0);
          }, [days, hours, minutes]);

          return (
            <MuiFormControl
              error={!!(touched && error)}
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {!!props.label && (
                <div className={props.classes.inputLabelContainer}>
                  <Typography shrink htmlFor={props.name} variant="body1">
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
                <Grid container alignItems="center" direction="row">
                  <Grid item md={4} xs={12}>
                    <FormHelperText>
                      {props.t('form.duration.day', { count: days })}
                    </FormHelperText>
                    <TextField
                      fullWidth
                      InputProps={{
                        inputProps: { min: 0, step: 1 },
                      }}
                      onBlur={computeGlobal}
                      onChange={setDaysFromEvent}
                      onFocus={onFocusDays}
                      type="number"
                      value={internalDays}
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
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
                          onBlur={computeGlobal}
                          onChange={setHoursFromEvent}
                          onFocus={onFocusHours}
                          type="number"
                          value={internalHours}
                        />
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={4} xs={12}>
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
                          onBlur={computeGlobal}
                          onChange={setMinutesFromEvent}
                          onFocus={onFocusMinutes}
                          type="number"
                          value={internalMinutes}
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
                    className={props.classes.alertError}
                    variant="body2"
                  >
                    {props.t(message)}
                  </Typography>
                )}
              </ErrorMessage>
            </MuiFormControl>
          );
        }}
      </Field>
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
          buttonStyle={props.buttonStyle}
          color={field.value}
          onChange={(color) => setFieldValue(props.name, color)}
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

export const GenderField = withStyles(styles)(
  withTranslation([])((props: GenderFieldProps) => {
    const { t, label, fullWidth, required } = props;
    return (
      <Field {...props}>
        {({ field, meta: { touched, error } }) => (
          <MuiFormControl
            error={!!(touched && error)}
            fullWidth={fullWidth}
            required={required}
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
                <Typography color="error" variant="caption">
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
            error={!!(touched && error)}
            fullWidth={fullWidth}
            required={required}
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
                <Typography className={classes.alertError} variant="body2">
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
            error={!!(touched && error)}
            fullWidth={fullWidth}
            required={required}
          >
            {label && (
              <InputLabel ref={labelRef} shrink htmlFor="select-helper">
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
              classes={selectClasses}
              onChange={(e) => {
                if (!props.keepFocusOnSelect) {
                  labelRef.current?.classList?.remove('Mui-focused');
                  selectRef.current?.classList?.remove('Mui-focused');
                }
                setFieldValue(field.name, e.target.value);
              }}
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
                <Typography className={classes.alertError} variant="body1">
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
            classes={classes}
            control={
              <Checkbox
                checked={reverted ? !field.value : field.value}
                disabled={!!disabled}
                {...props}
                {...field}
                error={!!(touched && error)}
                onChange={() => {
                  setFieldValue(field.name, !field.value);
                }}
              />
            }
            helperText={helperText}
            id="checkbox"
            label={label}
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
          component="legend"
          style={{ marginBottom: -2 }}
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
                control={
                  <Checkbox
                    checked={
                      field.value ? field.value.some((v) => v === id) : false
                    }
                    disabled={!!disabled}
                    onChange={() => {
                      const newValue = field.value.some((v) => v === id)
                        ? field.value.filter((v) => v !== id)
                        : [...field.value, id];
                      setFieldValue(field.name, newValue);
                    }}
                    value={`${id}`}
                  />
                }
                label={optionLabel}
                name={name}
              />
            ))
          }
        </Field>
      </FormGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </Container>
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
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
};
export const SwitchField = (props: SwitchFieldProps) => {
  const { name, disabled, label, inverse, className, helperText, onChange } =
    props;

  return (
    <div>
      <Field name={name}>
        {({ field }) => (
          <FormControlLabel
            {...field}
            checked={inverse ? !field.value : field.value}
            className={className}
            control={
              <Switch
                color={props.color}
                onChange={(event, checked) => {
                  field.onChange(event); // Call Formik's handler to update its state
                  onChange?.(event); // Call custom handler if provided
                }}
              />
            }
            disabled={disabled}
            label={label}
            value=""
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
    helperTextInformationIcon: string,
  }[],
  labelClass?: any,
  divContainerClass?: any,
  isRow?: boolean,
};

export const RadioGroupField = (props: RadioFieldProps) => {
  const { name, choices, label, labelClass, isRow, divContainerClass } = props;
  const classes = useStylesRadioGroupField();

  return (
    <Field name={name}>
      {({ field, form: { setFieldValue } }) => (
        <RadioGroup
          name={name}
          onChange={(_, value) => setFieldValue(field.name, value)}
          row={isRow}
        >
          <FormLabel className={labelClass}>{label}</FormLabel>
          {choices.map(
            ({
              value,
              label: l,
              helperText,
              helperTextInformationIcon,
              disabled,
            }) => (
              <div key={value} className={divContainerClass}>
                <FormControlLabel
                  key={value}
                  classes={props.classes}
                  control={<Radio checked={`${field.value}` === `${value}`} />}
                  disabled={props.disabled || disabled}
                  label={l}
                  value={value}
                />
                {helperText ? (
                  <FormHelperText style={{ marginTop: -8 }}>
                    {helperText}
                  </FormHelperText>
                ) : null}
                {helperTextInformationIcon && (
                  <div className={classes.helperTextInformationIcon}>
                    <InformationIcon text={helperTextInformationIcon} />
                  </div>
                )}
              </div>
            ),
          )}
        </RadioGroup>
      )}
    </Field>
  );
};
const useStylesRadioGroupField = makeStyles((theme) => ({
  helperTextInformationIcon: {
    alignItems: 'center',
    display: 'flex',
    paddingBottom: theme.spacing(0.5),
  },
}));

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
        <Typography className={classes.label} variant="body2">
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

const useSelectFieldStyles = makeStyles((theme) => ({
  field: {
    marginBottom: theme.spacing(1),
  },
}));

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
                  <Typography color="error" variant="caption">
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

export const TagSelectorFieldNoMulti: React.FC<Props> = React.memo(
  (props: Props) => {
    const { shrink, name } = props;
    const classes = useSelectFieldStyles();
    const onTagSelectorChange = useCallback(
      (setFieldValue: () => void) =>
        (item: Tag & { label: string, value: number }) => {
          return setFieldValue(name, item.value);
        },
      [name],
    );
    const onTagDelete = useCallback(
      (setFieldValue: () => void) => () => setFieldValue(name, null),
      [name],
    );
    return (
      <Field {...props}>
        {({ field, meta: { touched, error }, form: { setFieldValue } }) => {
          return (
            <TagSelector
              noMulti
              className={classes.field}
              shrink={shrink}
              {...field}
              {...omit(props, ['field'])}
              error={!!(touched && error)}
              onChange={onTagSelectorChange(setFieldValue)}
              onDeleteTag={onTagDelete(setFieldValue)}
            />
          );
        }}
      </Field>
    );
  },
);
