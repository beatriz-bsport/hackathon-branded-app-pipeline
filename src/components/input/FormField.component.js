// @flow
import React, { Component } from 'react';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  ListItemText,
  Avatar,
  FormControlLabel,
  Radio,
  RadioGroup,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';
import DatePicker from 'material-ui-pickers/DatePicker';
import TimePicker from 'material-ui-pickers/TimePicker';

import LEVELS from 'bsport-commons/lib/master-data/levels';

import { Level, Sport } from '../category';
import { Moment } from '../../i18n';

// dont change to number unless good testing
export const NOT_RECURRENT = '0';
export const WEEKLY = '1';
export const MONTHLY = '2';

const styles = (theme) => ({
  textInput: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
    minWidth: 140,
    marginRight: theme.spacing.unit,
  },
  formControlLarge: {
    minWidth: 200,
    marginRight: theme.spacing.unit,
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
      this.state.selectedDate = props.value || Moment();
    }
  }

  handleDateChange = (date: Object) => {
    this.setState({ selectedDate: date });
    this.handleChange({ target: { value: date } });
  };

  validator = (value) => {
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

  formatInput = (input) => {
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

  uploadHandler = () => {};

  getItem = (elt) => {
    const { id, disabled } = this.props;
    switch (id) {
      case 'SCT':
        return (
          <MenuItem key={elt.id} value={elt.id} disabled={disabled}>
            <Sport parentCategory={elt.SCS.id} SCTName={elt.name} />
          </MenuItem>
        );
      case 'coach':
        return (
          <MenuItem
            dense
            key={elt.id}
            value={elt.id}
            disabled={disabled}
            wrap="noWrap"
          >
            <ListItemText primary={elt.name} />
          </MenuItem>
        );
      case 'establishment':
        return (
          <MenuItem key={elt.id} value={elt.id} disabled={disabled}>
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
      defaultValue,
    } = this.props;
    const { value, error, selectedDate } = this.state;

    const InputProps =
      id === 'default_price' || id === 'price'
        ? {
            endAdornment: <InputAdornment position="end">€</InputAdornment>,
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
      case 'specific_info':
      case 'title':
      case 'credits':
      case 'effectif':
      case 'waiting_list_max_size':
      case 'password':
      case 'code':
        return (
          <TextField
            className={classes.textInput}
            required={required}
            value={value}
            id={id}
            name={name}
            label={t(`form.${id}`)}
            onChange={this.handleChange}
            error={error}
            multiline={multiline}
            fullWidth={fullWidth}
            InputProps={InputProps}
            type={type}
          />
        );
      case 'date_time':
        return (
          <DateTimePicker
            value={selectedDate}
            onChange={this.handleDateChange}
          />
        );
      case 'date_interval_start':
      case 'date_interval_end':
      case 'upper_date':
      case 'lower_date':
      case 'date':
        return (
          <DatePicker
            format="DD/MM/YYYY"
            value={selectedDate}
            disabled={disabled}
            onChange={this.handleDateChange}
          />
        );
      case 'hour':
        return (
          <TextField
            style={{ minWidth: 120 }}
            type="time"
            value={value}
            onChange={this.handleChange}
            disabled={disabled}
          />
        );
      case 'recurrence':
        return (
          <FormControl component="fieldset">
            <RadioGroup
              aria-label={t('form.recurrence')}
              row
              name={id}
              className={classes.group}
              value={this.props.value}
              onChange={this.handleChange}
            >
              <FormControlLabel
                value={NOT_RECURRENT}
                control={<Radio />}
                label={t('form.notRecurrent')}
              />
              <FormControlLabel
                value={WEEKLY}
                control={<Radio />}
                label={t('form.weekly')}
              />
              <FormControlLabel
                value={MONTHLY}
                control={<Radio />}
                label={t('form.monthly')}
              />
            </RadioGroup>
          </FormControl>
        );

      case 'gender':
        return (
          <FormControl
            className={classes.formControl}
            required={required}
            fullWidth
          >
            <InputLabel htmlFor="gender-helper">{t('form.gender')}</InputLabel>
            <Select value={value || 'M'} onChange={this.handleChange}>
              <MenuItem value="M">{t('common.male')}</MenuItem>
              <MenuItem value="F">{t('common.female')}</MenuItem>
            </Select>
          </FormControl>
        );
      case 'level':
        return (
          <FormControl
            className={classes.formControl}
            required={required}
            margin="normal"
          >
            <InputLabel htmlFor={`${id}-helper`}>{t('form.level')}</InputLabel>
            <Select value={value} onChange={this.handleChange}>
              {LEVELS.map((l) => (
                <MenuItem value={l.id}>
                  <Level levelId={l.id} />
                </MenuItem>
              ))}
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
            required={required}
            margin="normal"
          >
            <InputLabel htmlFor={`${id}-helper`}>{t(`form.${id}`)}</InputLabel>
            <Select value={value || 30} onChange={this.handleChange}>
              <MenuItem value={15}>{t('form.quarterHour')}</MenuItem>
              <MenuItem value={30}>{t('form.halfHour')}</MenuItem>
              <MenuItem value={45}>{t('form.halfAndQuarterHour')}</MenuItem>
              <MenuItem value={60}>{t('form.oneHour')}</MenuItem>
              <MenuItem value={90}>{t('form.oneHourAndHalf')}</MenuItem>
              <MenuItem value={120}>{t('form.twoHour')}</MenuItem>
              <MenuItem value={360}>{t('form.sixHour')}</MenuItem>
              <MenuItem value={24 * 60}>{t('form.oneDay')}</MenuItem>
            </Select>
          </FormControl>
        );
      case 'SCT':
      case 'coach':
        console.log(value || defaultValue);
      case 'establishment':
        return (
          <FormControl
            className={classes.formControlLarge}
            required={required}
            margin="normal"
            disabled={this.props.disabled}
          >
            <InputLabel htmlFor={`${id}-helper`}>{t(`form.${id}`)}</InputLabel>
            <Select value={value || defaultValue} onChange={this.handleChange}>
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

export default withStyles(styles)(translate()(FormField));
