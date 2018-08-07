import React, { Component } from 'react';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Input,
  InputAdornment,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { Sport, Avatar } from '../components';

const styles = (theme) => ({
  textInput: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
    minWidth: 140,
    marginRight: theme.spacing.unit,
  },
  formControlLarge: {
    minWidth: 280,
    marginRight: theme.spacing.unit,
  },
});

type Props = {
  id: String,
  onChange: () => void,
};

//prettier-ignore
const emailRegexp = new RegExp('[A-z0-9-_]+@[A-z0-9-_]+\.[A-z]+$');

export class FormField extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      value: null,
    };
  }

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
        } else {
          return true;
        }
      case 'birthdayYear':
        const year = parseInt(value, 10);
        return year > 2020 || 1900 > year;
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
    const { id } = this.props;
    switch (id) {
      case 'SCT':
        return (
          <MenuItem value={elt.id}>
            <Sport parentCategory={elt.SCS.id} SCTName={elt.name} />
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
    } = this.props;
    const { value, error } = this.state;

    const InputProps =
      'default_price' === id
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
        return (
          <TextField
            className={classes.textInput}
            required={required}
            value={value}
            id={id}
            label={t(`form.${id}`)}
            onChange={this.handleChange}
            error={error}
            multiline={multiline}
            fullWidth={fullWidth}
            InputProps={InputProps}
          />
        );
      case 'gender':
        return (
          <FormControl
            className={classes.formControl}
            required={required}
            margin="normal"
          >
            <InputLabel htmlFor="gender-helper">{t('form.gender')}</InputLabel>
            <Select value={value || 'M'} onChange={this.handleChange}>
              <MenuItem value="M">{t('common.male')}</MenuItem>
              <MenuItem value="F">{t('common.female')}</MenuItem>
            </Select>
          </FormControl>
        );
      case 'default_last_booking_minutes':
      case 'default_last_discard_minutes':
      case 'default_duration_minutes':
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
              <MenuItem value={60}>{t('form.oneHour')}</MenuItem>
              <MenuItem value={90}>{t('form.oneHourAndHalf')}</MenuItem>
              <MenuItem value={120}>{t('form.twoHour')}</MenuItem>
              <MenuItem value={360}>{t('form.sixHour')}</MenuItem>
              <MenuItem value={24 * 60}>{t('form.oneDay')}</MenuItem>
            </Select>
          </FormControl>
        );
      case 'SCT':
        return (
          <FormControl
            className={classes.formControl}
            required={required}
            margin="normal"
          >
            <InputLabel htmlFor={`${id}-helper`}>{t(`form.${id}`)}</InputLabel>
            <Select value={value || choices[0]} onChange={this.handleChange}>
              {choices.map((elt) => this.getItem(elt))}
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  }
}

export default withStyles(styles)(translate()(FormField));
