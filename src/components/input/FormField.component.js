// @flow
import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { Settings } from 'luxon';
import { LocalizedLuxonUtils } from '#src/i18n/utils/luxon-picker-utils';

import { DateTimePicker, DatePicker } from 'material-ui-pickers';
import { getCurrencyDisplay } from '../../libs/theme/selectors';

import Sport from '../../libs/category/components/SCT.component';

// dont change to number unless good testing
const NOT_RECURRENT = '0';
const WEEKLY = '1';
const MONTHLY = '2';
const DAILY = '3';

const styles = (theme) => ({
  textInput: {
    marginRight: theme.spacing(1),
  },
  formControl: {
    minWidth: 140,
    marginRight: theme.spacing(1),
  },
  formControlLarge: {
    minWidth: 200,
    marginRight: theme.spacing(1),
  },
});

type Props = {
  id: string,
  value: ?Object,
  onChange: () => void,
};

type State = {
  value: ?Object,
};

// prettier-ignore
// eslint-disable-next-line no-useless-escape
const emailRegexp = new RegExp('[A-z0-9-_]+@[A-z0-9-_]+\.[A-z]+$');

export class FormField extends Component<Props, State> {
  state = {
    error: false,
    value: null,
  };

  constructor(props: Props) {
    super(props);
    if (props.value) {
      this.state.value = props.value;
      this.state.selectedDate = props.value || DateTime.now();
    }
  }

  handleDateChange = (date: DateTime) => {
    this.setState({ selectedDate: date });
    this.handleChange({ target: { value: date } });
  };

  validator = (value: string) => {
    /*
     * Return true if error in input
     */
    const { id, required } = this.props;
    if (required && !value) {
      return true;
    }
    switch (id) {
      case 'email':
        if (value) {
          return !emailRegexp.test(value);
        }
        return true;

      case 'birthdayYear':
        const year = parseInt(value, 10);
        return year > 2020 || year < 1900;
      case 'waiting_list_max_size':
        const size = parseInt(value, 10);
        return size > 100 || size < 0;
      default:
        return false;
    }
  };

  formatInput = (input: string) => {
    const { id } = this.props;
    switch (id) {
      case 'birthdayYear':
      case 'phone':
      case 'default_price':
      case 'default_credits':
      case 'price':
      case 'credits':
      case 'effectif':
      case 'code':
        return input.replace(/[^0-9+]/g, '');
      case 'hour':
        return input || '0';
      default:
        return input;
    }
  };

  handleChange = (event) => {
    const { id } = this.props;
    if (id === 'photo') {
      this.setState({ value: event.target.files[0] });
    }
    const formattedInput = this.formatInput(event.target.value);
    const error = this.validator(formattedInput);
    this.setState({
      value: formattedInput,
      error,
    });
    this.props.onChange(id)(formattedInput, error);
  };

  getItem = (elt) => {
    const { id, disabled } = this.props;
    switch (id) {
      case 'SCT':
        return (
          <MenuItem key={elt.id} disabled={disabled} value={elt.id}>
            <Sport parentCategory={elt.SCS.id} SCTName={elt.name} />
          </MenuItem>
        );
      case 'coach':
        return (
          <MenuItem
            key={elt.id}
            dense
            disabled={disabled}
            value={elt.id}
            wrap="noWrap"
          >
            <ListItemText primary={elt.name} />
          </MenuItem>
        );
      case 'establishment':
        return (
          <MenuItem key={elt.id} disabled={disabled} value={elt.id}>
            <ListItemText primary={elt.title} />
          </MenuItem>
        );
    }
  };

  render() {
    const {
      id,
      choices,
      t,
      multiline,
      fullWidth,
      required,
      classes,
      disabled,
      type,
      name,
      disallowedCredits,
      creditError,
      defaultValue,
    } = this.props;
    const { value, error, selectedDate } = this.state;

    const InputProps =
      id === 'default_price' || id === 'price'
        ? {
            startAdornment: (
              <InputAdornment position="start">
                {getCurrencyDisplay()}
              </InputAdornment>
            ),
          }
        : {};

    switch (id) {
      case 'birthdayYear':
      case 'email':
      case 'phone':
      case 'lastname':
      case 'firstname':
      case 'description':
      case 'name':
      case 'default_price':
      case 'default_credits':
      case 'price':
      case 'title':
      case 'effectif':
      case 'waiting_list_max_size':
      case 'partner_max_booking_count':
      case 'password':
      case 'code':
        return (
          <TextField
            className={classes.textInput}
            data-testid={id}
            disabled={disabled}
            error={error}
            fullWidth={fullWidth}
            id={id}
            InputProps={InputProps}
            label={t(`form.${id}`)}
            multiline={multiline}
            name={name}
            onChange={this.handleChange}
            required={required}
            type={type}
            value={value}
          />
        );
      case 'credits':
        return (
          <div>
            <TextField
              className={classes.textInput}
              error={disallowedCredits}
              fullWidth={fullWidth}
              helperText={disallowedCredits ? creditError : null}
              id={id}
              InputProps={InputProps}
              label={t(`form.${id}`)}
              multiline={multiline}
              name={name}
              onChange={this.handleChange}
              required={required}
              type={type}
              value={value}
            />
          </div>
        );

      case 'specific_info':
        return (
          <TextField
            multiline
            className={classes.textInput}
            error={error}
            fullWidth={fullWidth}
            id={id}
            InputProps={InputProps}
            label={t(`form.${id}`)}
            name={name}
            onChange={this.handleChange}
            required={required}
            rows={3}
            type={type}
            value={value}
            variant="outlined"
          />
        );
      case 'date_time':
        return (
          <MuiPickersUtilsProvider
            locale={Settings.defaultLocale}
            utils={LocalizedLuxonUtils}
          >
            <DateTimePicker
              onChange={this.handleDateChange}
              value={selectedDate}
            />
          </MuiPickersUtilsProvider>
        );
      case 'date_interval_start':
      case 'date_interval_end':
      case 'upper_date':
      case 'lower_date':
      case 'date':
        return (
          <MuiPickersUtilsProvider
            locale={Settings.defaultLocale}
            utils={LocalizedLuxonUtils}
          >
            <DatePicker
              keyboard
              disabled={disabled}
              format="D"
              onChange={this.handleDateChange}
              value={selectedDate}
            />
          </MuiPickersUtilsProvider>
        );
      case 'hour':
        return (
          <TextField
            disabled={disabled}
            onChange={this.handleChange}
            required={required}
            style={{ minWidth: 120 }}
            type="time"
            // I have no idea what's up with this, but probably not used
            value={DateTime.fromFormat(value, 't').toFormat('HH:mm')}
          />
        );
      case 'recurrence':
        return (
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label={t('form.recurrence')}
              className={classes.group}
              id="recurrence_checkbox"
              name={id}
              onChange={this.handleChange}
              value={this.props.value}
            >
              <FormControlLabel
                control={<Radio />}
                id="not_recurrent"
                label={t('form.notRecurrent')}
                value={NOT_RECURRENT}
              />
              <FormControlLabel
                control={<Radio />}
                id="weekly"
                label={t('form.weekly')}
                value={WEEKLY}
              />
              <FormControlLabel
                control={<Radio />}
                id="monthly"
                label={t('form.monthly')}
                value={MONTHLY}
              />
            </RadioGroup>
          </FormControl>
        );

      case 'gender':
        return (
          <FormControl
            fullWidth
            className={classes.formControl}
            required={required}
          >
            <InputLabel htmlFor="gender-helper">{t('form.gender')}</InputLabel>
            <Select
              name="gender"
              onChange={this.handleChange}
              value={value || 'M'}
            >
              <MenuItem value="M">{t('common.male')}</MenuItem>
              <MenuItem value="F">{t('common.female')}</MenuItem>
            </Select>
          </FormControl>
        );
      case 'default_last_booking_minutes':
      case 'default_last_discard_minutes':
      case 'default_duration_minutes':
      case 'duration_minute':
        return (
          <FormControl
            className={classes.formControlLarge}
            data-cy={name}
            margin="normal"
            required={required}
          >
            <InputLabel htmlFor={`${id}-helper`}>{t(`form.${id}`)}</InputLabel>
            <Select name={name} onChange={this.handleChange} value={value || 0}>
              <MenuItem value={0}>{t('form.zeroMinute')}</MenuItem>
              <MenuItem value={15}>{t('form.quarterHour')}</MenuItem>
              <MenuItem value={30}>{t('form.halfHour')}</MenuItem>
              <MenuItem value={45}>{t('form.halfAndQuarterHour')}</MenuItem>
              <MenuItem value={60}>{t('form.oneHour')}</MenuItem>
              <MenuItem value={90}>{t('form.oneHourAndHalf')}</MenuItem>
              <MenuItem value={120}>{t('form.twoHour')}</MenuItem>
              <MenuItem value={180}>{t('form.threeHour')}</MenuItem>
              <MenuItem value={360}>{t('form.sixHour')}</MenuItem>
              <MenuItem value={720}>{t('form.twelveHour')}</MenuItem>
              <MenuItem value={24 * 60}>{t('form.oneDay')}</MenuItem>
            </Select>
          </FormControl>
        );
      case 'SCT':
      case 'coach':
      case 'establishment':
        return (
          <FormControl
            className={classes.formControlLarge}
            disabled={this.props.disabled}
            id="sport-category-select"
            margin="normal"
            required={required}
          >
            <InputLabel htmlFor={`${id}-helper`}>{t(`form.${id}`)}</InputLabel>
            <Select
              name={name}
              onChange={this.handleChange}
              required={required}
              value={value || defaultValue}
            >
              {choices.map((elt) => this.getItem(elt))}
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  }
}

FormField.defaultProps = {
  fullWidth: true,
};

export default withStyles(styles)(withTranslation()(FormField));
