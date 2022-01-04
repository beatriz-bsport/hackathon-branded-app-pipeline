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
import { getCurrencyDisplay } from '../../libs/theme/selectors';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';
import DatePicker from 'material-ui-pickers/DatePicker';

import LEVELS from '@bsport/common/lib/master-data/levels';

import { Level } from '../category';
import Sport from '../../libs/category/components/SCT.component';
import { Moment } from '../../i18n';

// dont change to number unless good testing
export const NOT_RECURRENT = '0';
export const WEEKLY = '1';
export const MONTHLY = '2';
export const DAILY = '3';

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
      case 'hour':
        return input || 0;
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
      case 'password':
      case 'code':
        return (
          <TextField
            className={classes.textInput}
            required={required}
            disabled={disabled}
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
      case 'credits':
        return (
          <div>
            <TextField
              className={classes.textInput}
              required={required}
              value={value}
              id={id}
              name={name}
              label={t(`form.${id}`)}
              onChange={this.handleChange}
              error={disallowedCredits}
              multiline={multiline}
              fullWidth={fullWidth}
              InputProps={InputProps}
              type={type}
              helperText={disallowedCredits ? creditError : null}
            />
          </div>
        );

      case 'specific_info':
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
            multiline
            rows={3}
            fullWidth={fullWidth}
            InputProps={InputProps}
            type={type}
            variant="outlined"
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
          <MuiPickersUtilsProvider
            utils={MomentUtils}
            moment={Moment}
            locale={Moment.locale()}
          >
            <DatePicker
              format="L"
              keyboard
              disabled={disabled}
              value={selectedDate}
              onChange={this.handleDateChange}
              mask={(value) => {
                if (value) {
                  return [
                    /\d/,
                    /\d/,
                    '/',
                    /\d/,
                    /\d/,
                    '/',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ];
                }
                return [];
              }}
            />
          </MuiPickersUtilsProvider>
        );
      case 'hour':
        return (
          <TextField
            style={{ minWidth: 120 }}
            type="time"
            value={moment(value, 'LT').format('HH:mm')}
            onChange={this.handleChange}
            required={required}
            disabled={disabled}
          />
        );
      case 'recurrence':
        return (
          <FormControl component="fieldset">
            <RadioGroup
              id="recurrence_checkbox"
              aria-label={t('form.recurrence')}
              row
              name={id}
              className={classes.group}
              value={this.props.value}
              onChange={this.handleChange}
            >
              <FormControlLabel
                id="not_recurrent"
                value={NOT_RECURRENT}
                control={<Radio />}
                label={t('form.notRecurrent')}
              />
              <FormControlLabel
                id="weekly"
                value={WEEKLY}
                control={<Radio />}
                label={t('form.weekly')}
              />
              <FormControlLabel
                id="monthly"
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
            <Select
              name="gender"
              value={value || 'M'}
              onChange={this.handleChange}
            >
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
            <Select
              id={this.props.id}
              name="level"
              value={value}
              onChange={this.handleChange}
            >
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
            data-cy={name}
          >
            <InputLabel htmlFor={`${id}-helper`}>{t(`form.${id}`)}</InputLabel>
            <Select value={value || 0} onChange={this.handleChange} name={name}>
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
            required={required}
            margin="normal"
            id="sport-category-select"
            disabled={this.props.disabled}
          >
            <InputLabel htmlFor={`${id}-helper`}>{t(`form.${id}`)}</InputLabel>
            <Select
              name={name}
              value={value || defaultValue}
              onChange={this.handleChange}
              required={required}
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
